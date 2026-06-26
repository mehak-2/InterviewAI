import "../config/env.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const generateContentWithFallback = async (promptOrParts) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.1-flash-lite"];
    let lastError = null;

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(promptOrParts);
            return result;
        } catch (error) {
            console.warn(`Gemini model ${modelName} failed, trying next fallback:`, error.message || error);
            lastError = error;
        }
    }
    throw lastError || new Error("Failed to generate content from Gemini");
};

const fallbackQuestions = ({ role, interviewType, totalQuestions }) => {
    const templates = [
        {
            question: `Tell me about your background and why you want this ${role} role.`,
            category: "behavioural",
        },
        {
            question: `Walk me through a challenging ${role} project you have worked on and the trade-offs you made.`,
            category: "technical",
        },
        {
            question: `How do you approach debugging a difficult issue in a ${role} workflow?`,
            category: "technical",
        },
        {
            question: `Describe a time you had to collaborate across teams to deliver a better outcome.`,
            category: "situational",
        },
        {
            question: `What do you consider when making a high-impact technical decision in this role?`,
            category: interviewType === "behavioural" ? "situational" : "technical",
        },
        {
            question: `How do you prioritise speed, quality, and maintainability under a tight deadline?`,
            category: "situational",
        },
    ];

    const questions = [];

    for (let index = 0; index < totalQuestions; index += 1) {
        questions.push(templates[index % templates.length]);
    }

    return questions;
};

export const generateInterviewQuestions = async ({
    role,
    experience,
    difficulty,
    interviewType = "technical",
    totalQuestions = 5,
    resumeText = "",
}) => {
    const prompt = `You are an expert interviewer creating a mock interview for a ${role} candidate.

Candidate experience: ${experience}
Difficulty: ${difficulty}
Interview type: ${interviewType}
Question count: ${totalQuestions}

${resumeText ? `Resume summary:\n${resumeText.slice(0, 1500)}\n` : ""}

Generate exactly ${totalQuestions} interview questions that progressively increase in depth.
- Blend foundational and practical questions.
- Keep the questions specific to the target role.
- Use behavioural and situational questions when helpful, especially for mixed interviews.
- Avoid repetition.

Return ONLY a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "Question text",
      "category": "technical" | "behavioural" | "situational"
    }
  ]
}`;

    const json = await generateJSONWithRetry(prompt);

    if (!Array.isArray(json.questions) || json.questions.length === 0) {
        throw new Error("Gemini did not return any interview questions");
    }

    const normalisedQuestions = json.questions
        .filter((item) => item?.question)
        .map((item) => ({
            question: String(item.question).trim(),
            category: normaliseCategory(item.category),
        }))
        .slice(0, totalQuestions);

    if (normalisedQuestions.length >= totalQuestions) {
        return normalisedQuestions;
    }

    return [
        ...normalisedQuestions,
        ...fallbackQuestions({ role, interviewType, totalQuestions }).slice(
            normalisedQuestions.length
        ),
    ];
};

export const evaluateAnswer = async ({
    question,
    answer,
    role,
    experience,
    difficulty,
}) => {
    const prompt = `You are an expert interviewer evaluating a candidate's answer for a ${role} position.

Candidate experience: ${experience}
Difficulty: ${difficulty}

Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer on these 4 dimensions (score each 1-10):
1. Technical accuracy and relevance
2. Communication
3. Confidence
4. Clarity and structure

Return ONLY a JSON object:
{
  "technicalScore": number,
  "communicationScore": number,
  "confidenceScore": number,
  "clarityScore": number,
  "overallScore": number,
  "feedback": "2-3 sentences of specific constructive feedback",
  "improvedAnswer": "A brief outline of a stronger answer (2-3 bullet points)"
}`;

    const json = await generateJSONWithRetry(prompt);

    return {
        technicalScore: normaliseScore(json.technicalScore),
        communicationScore: normaliseScore(json.communicationScore),
        confidenceScore: normaliseScore(json.confidenceScore),
        clarityScore: normaliseScore(json.clarityScore),
        overallScore: normaliseScore(json.overallScore),
        feedback: String(json.feedback || "").trim(),
        improvedAnswer: String(json.improvedAnswer || "").trim(),
    };
};

export const generateSessionEvaluation = async ({
    role,
    experience,
    difficulty,
    responses,
}) => {
    const summaryText = responses
        .map(
            (r, i) =>
                `Q${i + 1}: ${r.question}\nAnswer summary score: ${r.overallScore}/10\nFeedback: ${r.feedback}`
        )
        .join("\n");

    const avgScore =
        responses.reduce((sum, r) => sum + (r.overallScore || 0), 0) /
        responses.length;

    const prompt = `You are evaluating a completed mock interview for a ${role} candidate.

Candidate experience: ${experience}
Difficulty: ${difficulty}

Answer summaries:
${summaryText}

Average score: ${avgScore.toFixed(1)}/10

Provide a holistic evaluation. Return ONLY a JSON object:
{
  "overallScore": number,
  "summary": "2-4 sentence interview summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["gap 1", "gap 2", "gap 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "improvementPlan": ["concrete action step 1", "concrete action step 2", "concrete action step 3"],
  "suggestedTopics": ["topic 1", "topic 2", "topic 3"],
  "learningResources": [
    { "title": "Resource Name (e.g. GeeksforGeeks, MDN, Youtube, etc.)", "url": "URL or specific topic search query link" }
  ],
  "roleReadiness": "not_ready" | "almost" | "ready"
}`;

    const json = await generateJSONWithRetry(prompt);

    const normaliseLearningResources = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(item => ({
            title: String(item?.title || "Educational Resource").trim(),
            url: String(item?.url || "https://google.com").trim()
        })).slice(0, 5);
    };

    return {
        overallScore: normalisePercentScore(json.overallScore),
        summary: String(json.summary || "").trim(),
        strengths: normaliseStringArray(json.strengths),
        weaknesses: normaliseStringArray(json.weaknesses),
        recommendations: normaliseStringArray(json.recommendations),
        improvementPlan: normaliseStringArray(json.improvementPlan),
        suggestedTopics: normaliseStringArray(json.suggestedTopics),
        learningResources: normaliseLearningResources(json.learningResources),
        roleReadiness: normaliseRoleReadiness(json.roleReadiness),
    };
};

const extractJSON = (text) => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in AI response");
    return JSON.parse(jsonMatch[0]);
};

const generateJSONWithRetry = async (prompt, maxRetries = 3) => {
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await generateContentWithFallback(prompt);
            const text = result.response.text();
            return extractJSON(text);
        } catch (error) {
            console.warn(`JSON generation attempt ${attempt} failed:`, error.message || error);
            lastError = error;
        }
    }
    throw lastError || new Error("Failed to generate valid JSON response from Gemini");
};

const normaliseCategory = (category) => {
    if (["technical", "behavioural", "situational"].includes(category)) {
        return category;
    }

    return "technical";
};

const normaliseScore = (value) => {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
        return 0;
    }

    return Math.min(10, Math.max(0, Number(parsed.toFixed(1))));
};

const normalisePercentScore = (value) => {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
        return 0;
    }

    return Math.min(100, Math.max(0, Math.round(parsed)));
};

const normaliseStringArray = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .slice(0, 5);
};

const normaliseRoleReadiness = (value) => {
    if (["not_ready", "almost", "ready"].includes(value)) {
        return value;
    }

    return "almost";
};

export const generateFollowUpQuestionText = async (prompt) => {
    try {
        const result = await generateContentWithFallback(prompt);
        return result.response.text().trim();
    } catch (err) {
        console.error("Gemini error generating follow up:", err);
        return "";
    }
};

export const transcribeAudio = async (buffer, mimeType) => {
    try {
        const audioPart = {
            inlineData: {
                data: buffer.toString("base64"),
                mimeType: mimeType || "audio/webm",
            },
        };

        const prompt = "Transcribe the following audio recording accurately. Return ONLY the transcribed text, with no extra tags, headers, or conversational fluff. If there is no speech, return an empty string.";

        const result = await generateContentWithFallback([audioPart, prompt]);
        return result.response.text().trim();
    } catch (err) {
        console.error("Gemini error transcribing audio:", err);
        throw new Error("Unable to transcribe audio recording");
    }
};
