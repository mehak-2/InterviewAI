import express from "express";
import {
    register,
    login,
    logout,
    getMe,
    updateDetails,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/update", protect, updateDetails);

export default router;
