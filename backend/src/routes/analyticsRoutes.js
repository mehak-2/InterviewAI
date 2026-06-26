import express from "express";

import {
    getDashboardStats,
    getInterviewHistory,
    getPerformanceTrends,
    getScoreBreakdown,
} from "../controllers/analyticsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboardStats);
router.get("/trends", getPerformanceTrends);
router.get("/history", getInterviewHistory);
router.get("/scores", getScoreBreakdown);

export default router;
