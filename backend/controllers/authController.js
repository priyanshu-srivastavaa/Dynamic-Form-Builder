const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");



// ==========================================
// REGISTER USER
// ==========================================

async function forgotPassword(req, res) {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Email is required"
            });

        }


        const user =
            await User.findOne({
                email: email.toLowerCase().trim()
            });


        /*
        Same response even if email doesn't exist.
        Security ke liye account existence reveal nahi karenge.
        */

        if (!user) {

            return res.status(200).json({
                success: true,
                message:
                    "If an account exists with this email, a reset link has been sent."
            });

        }


        /* CREATE RESET TOKEN */

        const resetToken =
            crypto
                .randomBytes(32)
                .toString("hex");


        const hashedToken =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");


        user.resetPasswordToken =
            hashedToken;


        user.resetPasswordExpires =
            Date.now() +
            15 * 60 * 1000;


        await user.save();



        /* RESET LINK */

        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;



        /* EMAIL TRANSPORT */

        const transporter =
            nodemailer.createTransport({

                service: "gmail",

                auth: {

                    user:
                        process.env.EMAIL_USER,

                    pass:
                        process.env.EMAIL_PASS

                }

            });



        /* SEND EMAIL */

        await transporter.sendMail({

            from:
                `"Formify" <${process.env.EMAIL_USER}>`,

            to:
                user.email,

            subject:
                "Reset your Formify password",

            html: `
                <div style="
                    font-family:Arial,sans-serif;
                    max-width:520px;
                    margin:auto;
                    padding:30px;
                    background:#0f172a;
                    color:#ffffff;
                    border-radius:16px;
                ">

                    <h2 style="
                        color:#8b5cf6;
                    ">
                        Formify
                    </h2>

                    <h3>
                        Reset your password
                    </h3>

                    <p style="
                        color:#cbd5e1;
                        line-height:1.6;
                    ">
                        We received a request to reset
                        your Formify password.
                    </p>

                    <p style="
                        color:#cbd5e1;
                    ">
                        This link will expire in
                        <strong>15 minutes</strong>.
                    </p>

                    <a
                        href="${resetLink}"
                        style="
                            display:inline-block;
                            margin-top:15px;
                            padding:13px 22px;
                            background:#7c3aed;
                            color:white;
                            text-decoration:none;
                            border-radius:8px;
                            font-weight:bold;
                        "
                    >
                        Reset Password
                    </a>

                    <p style="
                        margin-top:25px;
                        color:#94a3b8;
                        font-size:12px;
                    ">
                        If you didn't request this,
                        you can safely ignore this email.
                    </p>

                </div>
            `

        });



        return res.status(200).json({

            success: true,

            message:
                "If an account exists with this email, a reset link has been sent."

        });

    }

    catch (error) {

        console.error(
            "Forgot password error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to send password reset email"

        });

    }

}
async function resetPassword(req, res) {

    try {

        const { token } =
            req.params;

        const { password } =
            req.body;


        if (!password) {

            return res.status(400).json({
                success: false,
                message:
                    "New password is required"
            });

        }


        if (password.length < 8) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters"
            });

        }


        const hashedToken =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


        const user =
            await User.findOne({

                resetPasswordToken:
                    hashedToken,

                resetPasswordExpires: {
                    $gt: Date.now()
                }

            });


        if (!user) {

            return res.status(400).json({
                success: false,
                message:
                    "Reset link is invalid or expired"
            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        user.password =
            hashedPassword;


        user.resetPasswordToken =
            null;


        user.resetPasswordExpires =
            null;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Password reset successfully"

        });

    }

    catch (error) {

        console.error(
            "Reset password error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to reset password"
        });

    }

}

async function registerUser(req, res) {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });

        }


        const existingUser =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message:
                    "User already exists"
            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const user =
            await User.create({
                name: name,
                email: email,
                password: hashedPassword
            });


        res.status(201).json({
            success: true,
            message:
                "User registered successfully",

            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }

    catch (error) {

        console.error(
            "Register error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to register user"
        });

    }

}


async function loginUser(req, res) {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });

        }


        const user =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (!user) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid email or password"
            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid email or password"
            });

            }

           const token =
            jwt.sign(
                {
                    userId: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

                 res.status(200).json({
                success: true,
                message:
                    "Login successful",

                token: token,

                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

    }

    catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to login"
        });

    }

}

async function getProfile(req, res) {

    try {

        const user =
            await User.findById(
                req.user.userId
            ).select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });

        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }

    catch (error) {

        console.error(
            "Profile error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to load profile"
        });

    }

}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    forgotPassword,
    resetPassword
};