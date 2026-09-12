const rateLimit = require("express-rate-limit");
const authMiddleware =
    require(
        "../middleware/authMiddleware"
    );

const express =
    require("express");

const {
    registerUser,
    loginUser,
    getProfile,
    forgotPassword,
    resetPassword
} =
    require(
        "../controllers/authController"
    );

    const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message:
            "Too many login attempts. Please try again after 15 minutes."
    }
});


const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message:
            "Too many password reset requests. Please try again later."
    }
});


const router =
    express.Router();


router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginLimiter,
    loginUser
);

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPassword
);


module.exports =
    router;