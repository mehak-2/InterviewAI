import express from "express";
import multer from "multer";

import { submitResponse } from "../controllers/responseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const uploadAudio = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("audio/")) {
            const error = new Error("Only audio files are allowed");
            error.statusCode = 400;
            return cb(error);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for audio recordings
    },
});

router.use(protect);

router.post("/", uploadAudio.single("audio"), submitResponse);

export default router;
