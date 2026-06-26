import express from "express";

import {
    deleteResume,
    getActiveResume,
    getUserResumes,
    uploadResume,
    setActiveResume,
} from "../controllers/resumeController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", getUserResumes);
router.get("/active", getActiveResume);
router.delete("/:id", deleteResume);
router.put("/:id/active", setActiveResume);

export default router;
