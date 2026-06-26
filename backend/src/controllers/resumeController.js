import mongoose from "mongoose";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import fs from "fs";
import path from "path";

import cloudinary from "../config/cloudinary.js";
import Resume from "../models/Resume.js";

const isCloudinaryConfigured = () => {
    return !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    );
};

const sanitiseFileName = (fileName) =>
    fileName
        .replace(/\.pdf$/i, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .slice(0, 80);

const uploadResumeBuffer = (buffer, fileName) =>
    new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "preprep/resumes",
                resource_type: "raw",
                format: "pdf",
                public_id: `${Date.now()}-${sanitiseFileName(fileName)}`,
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

// @desc  Upload resume
// @route POST /api/resumes/upload
// @access Private
export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded" });
        }

        let fileUrl = "";
        let cloudinaryPublicId = null;

        if (isCloudinaryConfigured()) {
            const result = await uploadResumeBuffer(
                req.file.buffer,
                req.file.originalname
            );
            fileUrl = result.secure_url;
            cloudinaryPublicId = result.public_id;
        } else {
            const uploadDir = path.join(process.cwd(), "uploads", "resumes");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const safeName = `${Date.now()}-${sanitiseFileName(req.file.originalname)}.pdf`;
            const filePath = path.join(uploadDir, safeName);
            fs.writeFileSync(filePath, req.file.buffer);

            const protocol = req.secure ? "https" : "http";
            const host = req.get("host") || "localhost:5000";
            fileUrl = `${protocol}://${host}/uploads/resumes/${safeName}`;
            cloudinaryPublicId = `local-${safeName}`;
        }

        let parsedText = "";
        try {
            const parser = new PDFParse({ data: req.file.buffer });
            const parsed = await parser.getText();
            await parser.destroy();
            parsedText = parsed.text || "";
        } catch (parseError) {
            console.error("Error parsing PDF text, saving empty string:", parseError);
        }

        await Resume.updateMany({ user: req.user.id }, { isActive: false });

        const resume = await Resume.create({
            user: req.user.id,
            fileName: req.file.originalname,
            fileUrl,
            cloudinaryPublicId,
            parsedText,
        });

        res.status(201).json({ success: true, resume });
    } catch (error) {
        console.error("Upload resume error:", error);
        res.status(500).json({ success: false, message: "Error uploading resume" });
    }
};

// @desc  Get all resumes for the current user
// @route GET /api/resumes
// @access Private
export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: resumes.length,
            resumes,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching resumes" });
    }
};

// @desc  Get the active resume for the current user
// @route GET /api/resumes/active
// @access Private
export const getActiveResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user.id, isActive: true });
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "No active resume found",
            });
        }

        res.status(200).json({ success: true, resume });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching active resume",
        });
    }
};

// @desc  Delete resume
// @route DELETE /api/resumes/:id
// @access Private
export const deleteResume = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid resume id" });
        }

        const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }

        // Delete from Cloudinary or local storage
        if (resume.cloudinaryPublicId && !resume.cloudinaryPublicId.startsWith("local-")) {
            await cloudinary.uploader.destroy(resume.cloudinaryPublicId, {
                resource_type: "raw",
            });
        } else if (resume.cloudinaryPublicId && resume.cloudinaryPublicId.startsWith("local-")) {
            const fileName = resume.cloudinaryPublicId.replace("local-", "");
            const filePath = path.join(process.cwd(), "uploads", "resumes", fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await resume.deleteOne();

        if (resume.isActive) {
            const latestResume = await Resume.findOne({ user: req.user.id }).sort({
                createdAt: -1,
            });

            if (latestResume) {
                latestResume.isActive = true;
                await latestResume.save();
            }
        }

        res.status(200).json({ success: true, message: "Resume deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting resume" });
    }
};

// @desc  Set active resume
// @route PUT /api/resumes/:id/active
// @access Private
export const setActiveResume = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid resume id" });
        }

        const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }

        await Resume.updateMany({ user: req.user.id }, { isActive: false });
        resume.isActive = true;
        await resume.save();

        res.status(200).json({ success: true, resume });
    } catch (error) {
        console.error("Set active resume error:", error);
        res.status(500).json({ success: false, message: "Error setting active resume" });
    }
};
