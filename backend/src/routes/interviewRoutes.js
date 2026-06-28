import express from "express";

import {
    completeInterview,
    createInterview,
    deleteInterview,
    getInterview,
    getInterviews,
} from "../controllers/interviewController.js";
import {
    getDashboardStats,
    getInterviewHistory,
} from "../controllers/analyticsController.js";
import { protect } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import { createInterviewSchema } from "../validations/interviewValidation.js";

const router = express.Router();

router.use(protect);

router.route("/").post(validate(createInterviewSchema), createInterview).get(getInterviews);

// Specific named routes MUST come before /:id to avoid being treated as an id param
router.get("/history", getInterviewHistory);
router.get("/stats", getDashboardStats);

router.route("/:id").get(getInterview).delete(deleteInterview);
router.post("/:id/complete", completeInterview);

export default router;
