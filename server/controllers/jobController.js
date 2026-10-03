import jobModel from "../models/Job.js";

// GET /api/jobs  (public, with search & filter)
export async function getJobs(req, res) {
    try {
        const { search, type, location, page = 1, limit = 12 } = req.query;
        const query = { status: "open" };

        if (search) query.title = { $regex: search, $options: "i" };
        if (type) query.type = type;
        if (location) query.location = { $regex: location, $options: "i" };

        const skip = (Number(page) - 1) * Number(limit);
        const [jobs, total] = await Promise.all([
            jobModel.find(query).skip(skip).limit(Number(limit))
                .populate("organisation", "name logoUrl industry location")
                .sort({ createdAt: -1 }),
            jobModel.countDocuments(query)
        ]);

        return res.status(200).json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/jobs/:id  (public)
export async function getJobById(req, res) {
    try {
        const job = await jobModel.findById(req.params.id)
            .populate("organisation", "name logoUrl industry location website description");
        if (!job) return res.status(404).json({ message: "Job not found" });
        return res.status(200).json({ job });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/jobs  (org only)
export async function createJob(req, res) {
    try {
        const { title, description, requirements, skills, location, type, salary } = req.body;

        const job = await jobModel.create({
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : (requirements || "").split("\n").filter(Boolean),
            skills: Array.isArray(skills) ? skills : (skills || "").split(",").map(s => s.trim()).filter(Boolean),
            location: location || "Remote",
            type: type || "remote",
            salary: salary ? (typeof salary === "string" ? JSON.parse(salary) : salary) : {},
            organisation: req.user.id
        });

        return res.status(201).json({ message: "Job created", job });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/jobs/:id  (org only, must be owner)
export async function updateJob(req, res) {
    try {
        const job = await jobModel.findOne({ _id: req.params.id, organisation: req.user.id });
        if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });

        const { title, description, requirements, skills, location, type, salary, status } = req.body;
        if (title) job.title = title;
        if (description) job.description = description;
        if (requirements) job.requirements = Array.isArray(requirements) ? requirements : requirements.split("\n").filter(Boolean);
        if (skills) job.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim()).filter(Boolean);
        if (location) job.location = location;
        if (type) job.type = type;
        if (salary) job.salary = typeof salary === "string" ? JSON.parse(salary) : salary;
        if (status) job.status = status;

        await job.save();
        return res.status(200).json({ message: "Job updated", job });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/jobs/:id  (org only)
export async function deleteJob(req, res) {
    try {
        const job = await jobModel.findOneAndDelete({ _id: req.params.id, organisation: req.user.id });
        if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });
        return res.status(200).json({ message: "Job deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/jobs/:id/apply  (user only)
export async function applyToJob(req, res) {
    try {
        const job = await jobModel.findById(req.params.id);
        if (!job || job.status !== "open") return res.status(404).json({ message: "Job not found or closed" });

        if (job.applicants.includes(req.user.id)) {
            return res.status(409).json({ message: "Already applied to this job" });
        }

        job.applicants.push(req.user.id);
        await job.save();
        return res.status(200).json({ message: "Applied successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET  /api/jobs/org/mine  (org's own jobs)
export async function getMyJobs(req, res) {
    try {
        const jobs = await jobModel.find({ organisation: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ jobs });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
