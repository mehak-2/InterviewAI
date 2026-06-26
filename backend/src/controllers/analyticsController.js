import mongoose from "mongoose";

import Interview from "../models/Interview.js";
import Response from "../models/Response.js";
import { getUserInterviews } from "../services/interviewService.js";

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

export const getDashboardStats = async (req, res) => {
    try {
        const userId = toObjectId(req.user.id);

        const [
            totalInterviews,
            completedInterviews,
            activeInterviews,
            totalResponses,
            averageInterviewScore,
            averageResponseScore,
        ] = await Promise.all([
            Interview.countDocuments({ user: userId }),
            Interview.countDocuments({ user: userId, status: "completed" }),
            Interview.countDocuments({ user: userId, status: "in_progress" }),
            Response.aggregate([
                {
                    $lookup: {
                        from: "interviews",
                        localField: "interview",
                        foreignField: "_id",
                        as: "interviewDoc",
                    },
                },
                { $unwind: "$interviewDoc" },
                { $match: { "interviewDoc.user": userId } },
                { $count: "count" },
            ]),
            Interview.aggregate([
                {
                    $match: {
                        user: userId,
                        status: "completed",
                        overallScore: { $ne: null },
                    },
                },
                {
                    $group: {
                        _id: null,
                        averageScore: { $avg: "$overallScore" },
                    },
                },
            ]),
            Response.aggregate([
                {
                    $lookup: {
                        from: "interviews",
                        localField: "interview",
                        foreignField: "_id",
                        as: "interviewDoc",
                    },
                },
                { $unwind: "$interviewDoc" },
                {
                    $match: {
                        "interviewDoc.user": userId,
                        overallScore: { $ne: null },
                    },
                },
                {
                    $group: {
                        _id: null,
                        averageScore: { $avg: "$overallScore" },
                    },
                },
            ]),
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalInterviews,
                completedInterviews,
                activeInterviews,
                totalResponses: totalResponses[0]?.count || 0,
                averageInterviewScore: Number(
                    (averageInterviewScore[0]?.averageScore || 0).toFixed(1)
                ),
                averageResponseScore: Number(
                    (averageResponseScore[0]?.averageScore || 0).toFixed(1)
                ),
            },
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard stats",
        });
    }
};

export const getPerformanceTrends = async (req, res) => {
    try {
        const userId = toObjectId(req.user.id);

        const trends = await Interview.aggregate([
            {
                $match: {
                    user: userId,
                    status: "completed",
                    completedAt: { $ne: null },
                    overallScore: { $ne: null },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$completedAt" },
                        month: { $month: "$completedAt" },
                    },
                    interviewCount: { $sum: 1 },
                    averageScore: { $avg: "$overallScore" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        res.status(200).json({
            success: true,
            trends: trends.map((item) => ({
                year: item._id.year,
                month: item._id.month,
                interviewCount: item.interviewCount,
                averageScore: Number(item.averageScore.toFixed(1)),
            })),
        });
    } catch (error) {
        console.error("Performance trends error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching performance trends",
        });
    }
};

export const getInterviewHistory = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const interviews = await getUserInterviews({
            userId: req.user.id,
            page,
            limit
        });

        res.status(200).json({
            success: true,
            history: interviews,
        });
    } catch (error) {
        console.error("Interview history error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching interview history",
        });
    }
};

export const getScoreBreakdown = async (req, res) => {
    try {
        const userId = toObjectId(req.user.id);

        const scoreBreakdown = await Response.aggregate([
            {
                $lookup: {
                    from: "interviews",
                    localField: "interview",
                    foreignField: "_id",
                    as: "interviewDoc",
                },
            },
            { $unwind: "$interviewDoc" },
            {
                $match: {
                    "interviewDoc.user": userId,
                },
            },
            {
                $group: {
                    _id: null,
                    averageTechnicalScore: { $avg: "$technicalScore" },
                    averageCommunicationScore: { $avg: "$communicationScore" },
                    averageConfidenceScore: { $avg: "$confidenceScore" },
                    averageClarityScore: { $avg: "$clarityScore" },
                    averageOverallScore: { $avg: "$overallScore" },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            scores: {
                averageTechnicalScore: Number(
                    (scoreBreakdown[0]?.averageTechnicalScore || 0).toFixed(1)
                ),
                averageCommunicationScore: Number(
                    (scoreBreakdown[0]?.averageCommunicationScore || 0).toFixed(1)
                ),
                averageConfidenceScore: Number(
                    (scoreBreakdown[0]?.averageConfidenceScore || 0).toFixed(1)
                ),
                averageClarityScore: Number(
                    (scoreBreakdown[0]?.averageClarityScore || 0).toFixed(1)
                ),
                averageOverallScore: Number(
                    (scoreBreakdown[0]?.averageOverallScore || 0).toFixed(1)
                ),
            },
        });
    } catch (error) {
        console.error("Score breakdown error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching score breakdown",
        });
    }
};
