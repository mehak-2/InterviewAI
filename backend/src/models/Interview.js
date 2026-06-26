import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            default: null,
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            trim: true,
        },
        experience: {
            type: String,
            required: [true, "Experience is required"],
            trim: true,
        },
        difficulty: {
            type: String,
            required: [true, "Difficulty is required"],
            trim: true,
        },
        interviewType: {
            type: String,
            enum: ["technical", "behavioural", "mixed"],
            default: "technical",
        },
        totalQuestions: {
            type: Number,
            default: 5,
            min: 3,
            max: 15,
        },
        status: {
            type: String,
            enum: ["in_progress", "completed", "abandoned"],
            default: "in_progress",
        },
        overallScore: {
            type: Number,
            min: 0,
            max: 100,
            default: null,
        },
        summary: {
            type: String,
            default: "",
        },
        strengths: {
            type: [String],
            default: [],
        },
        weaknesses: {
            type: [String],
            default: [],
        },
        recommendations: {
            type: [String],
            default: [],
        },
        improvementPlan: {
            type: [String],
            default: [],
        },
        suggestedTopics: {
            type: [String],
            default: [],
        },
        learningResources: [
            {
                title: { type: String, required: true },
                url: { type: String, required: true },
            }
        ],
        roleReadiness: {
            type: String,
            enum: ["not_ready", "almost", "ready", null],
            default: null,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

interviewSchema.index({ user: 1, createdAt: -1 });

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
