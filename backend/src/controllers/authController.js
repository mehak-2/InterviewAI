import User from "../models/User.js";

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const cookieOptions = {
        expires: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.status(statusCode)
        .cookie("token", token, cookieOptions)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
        });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        // Create user
        const user = await User.create({ firstName, lastName, email, password });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration",
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        // Find user and include password field
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("GetMe error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Update current user details
// @route   PUT /api/auth/update
// @access  Private
export const updateDetails = async (req, res) => {
    try {
        const { firstName, lastName, email, currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "An account with that email already exists",
                });
            }
            user.email = email;
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        // Password change logic
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Please specify your current password to update password",
                });
            }

            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is correct check failed",
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be at least 6 characters long",
                });
            }

            user.password = newPassword;
        }

        await user.save();

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Update details error:", error);
        res.status(500).json({ success: false, message: "Server error updating profile details" });
    }
};
