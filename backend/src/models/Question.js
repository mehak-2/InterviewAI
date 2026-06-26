import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        interview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
            required: true,
        },
        questionNumber: {
            type: Number,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["opening", "follow_up"],
            default: "opening",
        },
        category: {
            type: String,
            enum: ["technical", "behavioural", "situational"],
            default: "behavioural",
        },
    },
    { timestamps: true }
);

questionSchema.index({ interview: 1, questionNumber: 1 }, { unique: true });

const Question = mongoose.model("Question", questionSchema);
export default Question;
