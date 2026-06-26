import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import compression from "compression";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import swaggerDocument from "./config/swagger.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use("/api", limiter);

// Gzip Compression
app.use(compression());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Security headers
app.use(helmet());

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://localhost:5173",
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true, // allow cookies to be sent cross-origin
    })
);

// HTTP request logger (dev only)
app.use(morgan("dev"));

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Interview Coach API Running",
    });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/resumes", resumeRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    if (err.message) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.statusCode ? err.message : "Internal server error",
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

export default app;
