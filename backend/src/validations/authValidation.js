import { z } from "zod";

export const registerSchema = z.object({
    firstName: z
        .string()
        .min(1, "First name is required")
        .max(50, "First name cannot exceed 50 characters")
        .regex(/^[a-zA-Z]+$/, "First name can only contain letters"),
    lastName: z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name cannot exceed 50 characters")
        .regex(/^[a-zA-Z]+$/, "Last name can only contain letters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password is too long"),
});

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});
