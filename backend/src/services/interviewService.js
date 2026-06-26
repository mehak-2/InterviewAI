import mongoose from "mongoose";

import Interview from "../models/Interview.js";
import Question from "../models/Question.js";
import Response from "../models/Response.js";
import Resume from "../models/Resume.js";
import {
    generateInterviewQuestions,
    generateSessionEvaluation,
} from "./geminiService.js";

const createHttpError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const findResumeForInterview = async ({ userId, resumeId }) => {
    if (resumeId) {
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            throw createHttpError(400, "Invalid resume id");
        }

        const resume = await Resume.findOne({ _id: resumeId, user: userId });
        if (!resume) {
            throw createHttpError(404, "Resume not found");
        }

        return resume;
    }

    return Resume.findOne({ user: userId, isActive: true });
};

export const createInterviewSession = async ({
    userId,
    role,
    experience,
    difficulty,
    interviewType = "technical",
    totalQuestions = 5,
    resumeId,
}) => {
    const resume = await findResumeForInterview({ userId, resumeId });

    const generatedQuestions = await generateInterviewQuestions({
        role,
        experience,
        difficulty,
        interviewType,
        totalQuestions,
        resumeText: resume?.parsedText || "",
    });

    if (!generatedQuestions.length) {
        throw createHttpError(502, "Unable to generate interview questions");
    }

    const interview = await Interview.create({
        user: userId,
        resume: resume?._id || null,
        role,
        experience,
        difficulty,
        interviewType,
        totalQuestions: generatedQuestions.length,
    });

    try {
        const questions = await Question.insertMany(
            generatedQuestions.map((item, index) => ({
                interview: interview._id,
                questionNumber: index + 1,
                text: item.question,
                type: index === 0 ? "opening" : "follow_up",
                category: item.category,
            }))
        );

        return { interview, questions };
    } catch (error) {
        await Interview.findByIdAndDelete(interview._id);
        throw error;
    }
};

export const getInterviewDetails = async ({ interviewId, userId }) => {
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        throw createHttpError(400, "Invalid interview id");
    }

    const interview = await Interview.findOne({
        _id: interviewId,
        user: userId,
    }).populate("resume");

    if (!interview) {
        throw createHttpError(404, "Interview not found");
    }

    const [questions, responses] = await Promise.all([
        Question.find({ interview: interview._id }).sort({ questionNumber: 1 }),
        Response.find({ interview: interview._id }).sort({ submittedAt: 1 }),
    ]);

    const responseMap = new Map(
        responses.map((response) => [String(response.question), response])
    );

    const hydratedQuestions = questions.map((question) => ({
        ...question.toObject(),
        response: responseMap.get(String(question._id)) || null,
    }));

    return {
        interview,
        questions: hydratedQuestions,
    };
};

export const getUserInterviews = async ({ userId, page, limit }) => {
    const dbQuery = Interview.find({ user: userId }).sort({ createdAt: -1 });

    if (page && limit) {
        const skip = (Number(page) - 1) * Number(limit);
        dbQuery.skip(skip).limit(Number(limit));
    }

    const interviews = await dbQuery.lean();

    const interviewIds = interviews.map((interview) => interview._id);

    const [questionCounts, responseCounts] = await Promise.all([
        Question.aggregate([
            { $match: { interview: { $in: interviewIds } } },
            { $group: { _id: "$interview", count: { $sum: 1 } } },
        ]),
        Response.aggregate([
            { $match: { interview: { $in: interviewIds } } },
            { $group: { _id: "$interview", count: { $sum: 1 } } },
        ]),
    ]);

    const questionCountMap = new Map(
        questionCounts.map((item) => [String(item._id), item.count])
    );
    const responseCountMap = new Map(
        responseCounts.map((item) => [String(item._id), item.count])
    );

    return interviews.map((interview) => ({
        ...interview,
        questionCount: questionCountMap.get(String(interview._id)) || 0,
        responseCount: responseCountMap.get(String(interview._id)) || 0,
    }));
};

export const completeInterviewSession = async ({ interviewId, userId }) => {
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        throw createHttpError(400, "Invalid interview id");
    }

    const interview = await Interview.findOne({
        _id: interviewId,
        user: userId,
    });

    if (!interview) {
        throw createHttpError(404, "Interview not found");
    }

    const responses = await Response.find({ interview: interview._id })
        .populate("question")
        .sort({ submittedAt: 1 });

    if (!responses.length) {
        throw createHttpError(
            400,
            "Submit at least one response before completing the interview"
        );
    }

    const evaluation = await generateSessionEvaluation({
        role: interview.role,
        experience: interview.experience,
        difficulty: interview.difficulty,
        responses: responses.map((response) => ({
            question: response.question?.text || "Interview question",
            overallScore: response.overallScore,
            feedback: response.feedback,
        })),
    });

    interview.status = "completed";
    interview.overallScore = evaluation.overallScore;
    interview.summary = evaluation.summary;
    interview.strengths = evaluation.strengths;
    interview.weaknesses = evaluation.weaknesses;
    interview.recommendations = evaluation.recommendations;
    interview.improvementPlan = evaluation.improvementPlan;
    interview.suggestedTopics = evaluation.suggestedTopics;
    interview.learningResources = evaluation.learningResources;
    interview.roleReadiness = evaluation.roleReadiness;
    interview.completedAt = new Date();

    await interview.save();

    return interview;
};

export const deleteInterviewSession = async ({ interviewId, userId }) => {
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        throw createHttpError(400, "Invalid interview id");
    }

    const interview = await Interview.findOne({
        _id: interviewId,
        user: userId,
    });

    if (!interview) {
        throw createHttpError(404, "Interview not found");
    }

    await Promise.all([
        Response.deleteMany({ interview: interview._id }),
        Question.deleteMany({ interview: interview._id }),
        interview.deleteOne(),
    ]);
};
