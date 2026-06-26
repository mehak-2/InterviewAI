import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
    {
        interview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
            required: true,
        },
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        answerText: {
            type: String,
            required: true,
        },
        technicalScore: { type: Number, min: 0, max: 10, default: null },
        communicationScore: { type: Number, min: 0, max: 10, default: null },
        confidenceScore: { type: Number, min: 0, max: 10, default: null },
        clarityScore: { type: Number, min: 0, max: 10, default: null },
        overallScore: { type: Number, min: 0, max: 10, default: null },
        feedback: { type: String, default: "" },
        improvedAnswer: { type: String, default: "" },
        audioUrl: { type: String, default: null },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

responseSchema.index({ interview: 1, question: 1 }, { unique: true });

const Response = mongoose.model("Response", responseSchema);
export default Response;
