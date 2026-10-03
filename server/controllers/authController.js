import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/Session.js";

const REFRESH_TOKEN_EXPIRES_IN = "7d";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function setRefreshCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: REFRESH_TOKEN_MAX_AGE
    });
}

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        const isAlreadyRegistered = await userModel.findOne({ email });

        if (isAlreadyRegistered) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const refreshToken = jwt.sign(
            {
                id: user._id,
                role: "user"
            },
            config.JWT_SECRET,
            {
                expiresIn: REFRESH_TOKEN_EXPIRES_IN
            }
        );

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        const accessToken = jwt.sign(
            {
                id: user._id,
                sessionId: session._id,
                role: "user"
            },
            config.JWT_SECRET,
            {
                expiresIn: ACCESS_TOKEN_EXPIRES_IN
            }
        );

        setRefreshCookie(res, refreshToken);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                name: user.name,
                email: user.email
            },
            accessToken
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare the plain password with the stored hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create refresh token
        const refreshToken = jwt.sign(
            {
                id: user._id,
                role: "user"
            },
            config.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Hash refresh token before storing it
        const refreshTokenHash = await bcrypt.hash(
            refreshToken,
            10
        );

        // Create session
        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        // Create access token
        const accessToken = jwt.sign(
            {
                id: user._id,
                sessionId: session._id,
                role: "user"
            },
            config.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        // Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Logged in successfully",
            user: {
                name: user.name,
                email: user.email
            },
            accessToken
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


export async function getMe(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user: {
                username: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        });
    }
}

export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET
        );

        // Find sessions belonging to this user.
        const sessions = await sessionModel.find({
            user: decoded.id,
            revoked: false
        });

        let session = null;

        for (const currentSession of sessions) {
            const isValid = await bcrypt.compare(
                refreshToken,
                currentSession.refreshTokenHash
            );

            if (isValid) {
                session = currentSession;
                break;
            }
        }

        if (!session) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        // Rotate refresh token
        const newRefreshToken = jwt.sign(
            {
                id: decoded.id
            },
            config.JWT_SECRET,
            {
                expiresIn: REFRESH_TOKEN_EXPIRES_IN
            }
        );

        const newRefreshTokenHash = await bcrypt.hash(
            newRefreshToken,
            10
        );

        session.refreshTokenHash = newRefreshTokenHash;
        await session.save();

        const accessToken = jwt.sign(
            {
                id: decoded.id,
                sessionId: session._id,
                role: "user"
            },
            config.JWT_SECRET,
            {
                expiresIn: ACCESS_TOKEN_EXPIRES_IN
            }
        );

        setRefreshCookie(res, newRefreshToken);

        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}

export async function logout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET
        );

        const sessions = await sessionModel.find({
            user: decoded.id,
            revoked: false
        });

        let session = null;

        for (const currentSession of sessions) {
            const isValid = await bcrypt.compare(
                refreshToken,
                currentSession.refreshTokenHash
            );

            if (isValid) {
                session = currentSession;
                break;
            }
        }

        if (!session) {
            return res.status(400).json({
                message: "Invalid refresh token"
            });
        }

        session.revoked = true;
        await session.save();

        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}

export async function logoutAll(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET
        );

        await sessionModel.updateMany(
            {
                user: decoded.id,
                revoked: false
            },
            {
                $set: {
                    revoked: true
                }
            }
        );

        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Logged out from all devices successfully"
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}
