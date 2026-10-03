import userModel from "../models/User.js";
import jobModel from "../models/Job.js";
import courseModel from "../models/Course.js";

// GET /api/user/profile
export async function getProfile(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/user/profile
export async function updateProfile(req, res) {
    try {
        const { name, bio, skills, jobPreferences } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (bio !== undefined) updates.bio = bio;
        if (skills) updates.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
        if (jobPreferences) {
            updates.jobPreferences = typeof jobPreferences === "string" 
                ? JSON.parse(jobPreferences) 
                : jobPreferences;
        }
        if (req.file) updates.profilePicUrl = req.file.path;

        const user = await userModel.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
        return res.status(200).json({ message: "Profile updated", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/user/resume  (multipart)
export async function uploadResume(req, res) {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { resumeUrl: req.file.path },
            { new: true }
        ).select("-password");
        return res.status(200).json({ message: "Resume uploaded", resumeUrl: user.resumeUrl, user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/user/roadmap
export async function getRoadmap(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const userSkills = user.skills.map(s => s.toLowerCase());
        const targetTitle = user.jobPreferences?.title || "";

        // Build job query
        const jobQuery = { status: "open" };
        if (targetTitle) {
            jobQuery.title = { $regex: targetTitle, $options: "i" };
        }

        const matchingJobs = await jobModel.find(jobQuery).limit(10).populate("organisation", "name logoUrl");

        // Collect all required skills from matching jobs
        const requiredSkillsSet = new Set();
        matchingJobs.forEach(job => {
            (job.skills || []).forEach(s => requiredSkillsSet.add(s.toLowerCase()));
        });

        // Skill gap
        const missingSkills = [...requiredSkillsSet].filter(s => !userSkills.includes(s));

        // Find courses for missing skills
        let recommendedCourses = [];
        if (missingSkills.length > 0) {
            recommendedCourses = await courseModel.find({
                skills: { $in: missingSkills.map(s => new RegExp(s, "i")) }
            }).limit(8).populate("organisation", "name logoUrl");
        }

        return res.status(200).json({
            userSkills: user.skills,
            targetTitle,
            missingSkills,
            matchingJobs,
            recommendedCourses
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
