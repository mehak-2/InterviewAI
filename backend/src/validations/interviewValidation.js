import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createInterviewSchema = z.object({
    role: z
        .string()
        .min(2, "Role is required")
        .max(100, "Role cannot exceed 100 characters"),
    experience: z
        .string()
        .min(1, "Experience is required")
        .max(100, "Experience cannot exceed 100 characters"),
    difficulty: z
        .string()
        .min(1, "Difficulty is required")
        .max(50, "Difficulty cannot exceed 50 characters"),
    interviewType: z.enum(["technical", "behavioural", "mixed"]).optional().default("technical"),
    totalQuestions: z.coerce.number().int().min(3).max(15).optional().default(5),
    resumeId: z
        .string()
        .regex(objectIdRegex, "Invalid resume id")
        .optional(),
});
