import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const modelsToTest = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-pro",
];

const run = async () => {
    const key = process.env.GEMINI_API_KEY?.trim();
    const genAI = new GoogleGenerativeAI(key);

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, respond with 'Success' if you can read this.");
            console.log(`  -> SUCCESS! Response:`, result.response.text().trim());
        } catch (err) {
            console.error(`  -> FAILED: ${err.message || err}`);
        }
    }
};

run();
