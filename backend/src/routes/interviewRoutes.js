import express from "express";

import {
    completeInterview,
    createInterview,
    deleteInterview,
    getInterview,
    getInterviews,
} from "../controllers/interviewController.js";
import { protect } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import { createInterviewSchema } from "../validations/interviewValidation.js";

const router = express.Router();

router.use(protect);

router.route("/").post(validate(createInterviewSchema), createInterview).get(getInterviews);
router.route("/:id").get(getInterview).delete(deleteInterview);
router.post("/:id/complete", completeInterview);

export default router;
