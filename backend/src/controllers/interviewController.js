import {
    completeInterviewSession,
    createInterviewSession,
    deleteInterviewSession,
    getInterviewDetails,
    getUserInterviews,
} from "../services/interviewService.js";

const sendError = (res, error, fallbackMessage) => {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: statusCode >= 500 ? fallbackMessage : error.message,
    });
};

export const createInterview = async (req, res) => {
    try {
        const interviewPayload = await createInterviewSession({
            userId: req.user.id,
            ...req.body,
        });

        res.status(201).json({
            success: true,
            ...interviewPayload,
        });
    } catch (error) {
        console.error("Create interview error:", error);
        sendError(res, error, "Error creating interview");
    }
};

export const getInterview = async (req, res) => {
    try {
        const interviewDetails = await getInterviewDetails({
            interviewId: req.params.id,
            userId: req.user.id,
        });

        res.status(200).json({
            success: true,
            ...interviewDetails,
        });
    } catch (error) {
        console.error("Get interview error:", error);
        sendError(res, error, "Error fetching interview");
    }
};

export const getInterviews = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const interviews = await getUserInterviews({
            userId: req.user.id,
            page,
            limit
        });

        res.status(200).json({
            success: true,
            count: interviews.length,
            interviews,
        });
    } catch (error) {
        console.error("Get interviews error:", error);
        sendError(res, error, "Error fetching interviews");
    }
};

export const completeInterview = async (req, res) => {
    try {
        const interview = await completeInterviewSession({
            interviewId: req.params.id,
            userId: req.user.id,
        });

        res.status(200).json({
            success: true,
            interview,
            overallScore: interview.overallScore,
            summary: interview.summary,
            strengths: interview.strengths,
            weaknesses: interview.weaknesses,
            recommendations: interview.recommendations,
            improvementPlan: interview.improvementPlan,
            suggestedTopics: interview.suggestedTopics,
            learningResources: interview.learningResources,
            roleReadiness: interview.roleReadiness,
        });
    } catch (error) {
        console.error("Complete interview error:", error);
        sendError(res, error, "Error completing interview");
    }
};

export const deleteInterview = async (req, res) => {
    try {
        await deleteInterviewSession({
            interviewId: req.params.id,
            userId: req.user.id,
        });

        res.status(200).json({
            success: true,
            message: "Interview deleted successfully",
        });
    } catch (error) {
        console.error("Delete interview error:", error);
        sendError(res, error, "Error deleting interview");
    }
};
