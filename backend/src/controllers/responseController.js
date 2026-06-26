import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import cloudinary from "../config/cloudinary.js";
import Interview from "../models/Interview.js";
import Question from "../models/Question.js";
import Response from "../models/Response.js";
import {
    evaluateAnswer,
    generateFollowUpQuestionText,
    transcribeAudio,
} from "../services/geminiService.js";

const sendError = (res, error, fallbackMessage) => {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: statusCode >= 500 ? fallbackMessage : error.message,
    });
};

const isCloudinaryConfigured = () => {
    return !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    );
};

const uploadAudioBuffer = (buffer, fileName) =>
    new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "preprep/audio",
                resource_type: "video", // video encompasses audio resources in Cloudinary
                public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 80)}`,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });

const saveAudioLocally = (buffer, fileName, req) => {
    const uploadDir = path.join(process.cwd(), "uploads", "audio");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const safeName = `${Date.now()}-${fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 80)}.webm`;
    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, buffer);

    const protocol = req.secure ? "https" : "http";
    const host = req.get("host") || "localhost:5000";
    return `${protocol}://${host}/uploads/audio/${safeName}`;
};

export const submitResponse = async (req, res) => {
    try {
        const { questionId } = req.body;
        let answer = req.body.answer || "";

        if (!mongoose.Types.ObjectId.isValid(questionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid question id",
            });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        const interview = await Interview.findOne({
            _id: question.interview,
            user: req.user.id,
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found",
            });
        }

        if (interview.status !== "in_progress") {
            return res.status(400).json({
                success: false,
                message: "Responses can only be submitted to active interviews",
            });
        }

        let audioUrl = null;

        // If an audio file is uploaded, upload to Cloudinary or save locally, and transcribe via Gemini
        if (req.file) {
            try {
                if (isCloudinaryConfigured()) {
                    const uploadResult = await uploadAudioBuffer(
                        req.file.buffer,
                        req.file.originalname || "recording.webm"
                    );
                    audioUrl = uploadResult.secure_url;
                } else {
                    audioUrl = saveAudioLocally(
                        req.file.buffer,
                        req.file.originalname || "recording.webm",
                        req
                    );
                }

                const transcription = await transcribeAudio(
                    req.file.buffer,
                    req.file.mimetype
                );

                if (!transcription || transcription.trim().length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Audio answer could not be transcribed. Please speak clearly and try again.",
                    });
                }

                answer = transcription;
            } catch (err) {
                console.error("Audio processing/transcription error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Error processing or transcribing the audio recording",
                });
            }
        }

        if (!answer || answer.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Answer cannot be empty.",
            });
        }

        const evaluation = await evaluateAnswer({
            question: question.text,
            answer,
            role: interview.role,
            experience: interview.experience,
            difficulty: interview.difficulty,
        });

        const response = await Response.findOneAndUpdate(
            { interview: interview._id, question: question._id },
            {
                interview: interview._id,
                question: question._id,
                answerText: answer,
                technicalScore: evaluation.technicalScore,
                communicationScore: evaluation.communicationScore,
                confidenceScore: evaluation.confidenceScore,
                clarityScore: evaluation.clarityScore,
                overallScore: evaluation.overallScore,
                feedback: evaluation.feedback,
                improvedAnswer: evaluation.improvedAnswer,
                audioUrl,
                submittedAt: new Date(),
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true,
            }
        );

        // Dynamically adjust the next question in the database to be a follow-up
        const nextQuestionNumber = question.questionNumber + 1;
        const nextQuestion = await Question.findOne({
            interview: interview._id,
            questionNumber: nextQuestionNumber,
        });

        if (nextQuestion) {
            try {
                const followUpPrompt = `You are an expert interviewer.
The candidate is interviewing for a ${interview.role} role (${interview.experience} level, ${interview.difficulty} difficulty).
The previous question was: "${question.text}"
The candidate answered: "${answer}"
Your evaluation feedback: "${evaluation.feedback}"

The planned next question category is: "${nextQuestion.category}"
The planned next question focus/topic is: "${nextQuestion.text}"

Generate a personalized follow-up question that builds on the candidate's previous answer but steers towards the focus of the planned next question. Keep it under 2 sentences.
Return ONLY the raw question string, no JSON, no formatting, no wrapper.`;

                const followUpResult = await generateFollowUpQuestionText(followUpPrompt);
                if (followUpResult && followUpResult.trim().length > 0) {
                    nextQuestion.text = followUpResult.trim();
                    nextQuestion.type = "follow_up";
                    await nextQuestion.save();
                }
            } catch (err) {
                console.error("Error generating follow up question:", err);
            }
        }

        res.status(201).json({
            success: true,
            response,
        });
    } catch (error) {
        console.error("Submit response error:", error);
        sendError(res, error, "Error submitting response");
    }
};
