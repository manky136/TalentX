import organisationModel from "../models/Organisation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/Session.js";

const REFRESH_TOKEN_EXPIRES_IN = "7d";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function setRefreshCookie(res, refreshToken) {
    res.cookie("refreshToken_org", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: REFRESH_TOKEN_MAX_AGE
    });
}

export async function orgRegister(req, res) {
    try {
        const { name, email, password, industry, website, description, location } = req.body;

        const existing = await organisationModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const org = await organisationModel.create({
            name, email, password: hashedPassword,
            industry: industry || "",
            website: website || "",
            description: description || "",
            location: location || ""
        });

        const refreshToken = jwt.sign(
            { id: org._id, role: "org" },
            config.JWT_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
        );

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        const session = await sessionModel.create({
            user: org._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        const accessToken = jwt.sign(
            { id: org._id, sessionId: session._id, role: "org" },
            config.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
        );

        setRefreshCookie(res, refreshToken);

        return res.status(201).json({
            message: "Organisation registered successfully",
            org: { id: org._id, name: org.name, email: org.email },
            accessToken
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function orgLogin(req, res) {
    try {
        const { email, password } = req.body;

        const org = await organisationModel.findOne({ email });
        if (!org) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, org.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const refreshToken = jwt.sign(
            { id: org._id, role: "org" },
            config.JWT_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
        );

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        const session = await sessionModel.create({
            user: org._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        const accessToken = jwt.sign(
            { id: org._id, sessionId: session._id, role: "org" },
            config.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
        );

        setRefreshCookie(res, refreshToken);

        return res.status(200).json({
            message: "Logged in successfully",
            org: { id: org._id, name: org.name, email: org.email },
            accessToken
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOrgMe(req, res) {
    try {
        const org = await organisationModel.findById(req.user.id).select("-password");
        if (!org) return res.status(404).json({ message: "Organisation not found" });
        return res.status(200).json({ org });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateOrgProfile(req, res) {
    try {
        const { name, description, website, industry, location } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (description) updates.description = description;
        if (website) updates.website = website;
        if (industry) updates.industry = industry;
        if (location) updates.location = location;
        if (req.file) updates.logoUrl = req.file.path;

        const org = await organisationModel.findByIdAndUpdate(
            req.user.id, updates, { new: true }
        ).select("-password");

        return res.status(200).json({ message: "Profile updated", org });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function orgLogout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken_org;
        if (!refreshToken) return res.status(400).json({ message: "Not logged in" });

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        const sessions = await sessionModel.find({ user: decoded.id, revoked: false });

        for (const s of sessions) {
            const valid = await bcrypt.compare(refreshToken, s.refreshTokenHash);
            if (valid) { s.revoked = true; await s.save(); break; }
        }

        res.clearCookie("refreshToken_org");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
