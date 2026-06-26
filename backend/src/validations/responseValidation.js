import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const submitResponseSchema = z.object({
    questionId: z.string().regex(objectIdRegex, "Invalid question id"),
    answer: z
        .string()
        .min(10, "Answer must be at least 10 characters")
        .max(5000, "Answer cannot exceed 5000 characters"),
});
