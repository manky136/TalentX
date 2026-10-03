import courseModel from "../models/Course.js";

// GET /api/courses  (public)
export async function getCourses(req, res) {
    try {
        const { search, level, skill, page = 1, limit = 12 } = req.query;
        const query = {};

        if (search) query.title = { $regex: search, $options: "i" };
        if (level) query.level = level;
        if (skill) query.skills = { $in: [new RegExp(skill, "i")] };

        const skip = (Number(page) - 1) * Number(limit);
        const [courses, total] = await Promise.all([
            courseModel.find(query).skip(skip).limit(Number(limit))
                .populate("organisation", "name logoUrl")
                .sort({ createdAt: -1 }),
            courseModel.countDocuments(query)
        ]);

        return res.status(200).json({ courses, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/courses/:id  (public)
export async function getCourseById(req, res) {
    try {
        const course = await courseModel.findById(req.params.id)
            .populate("organisation", "name logoUrl website description");
        if (!course) return res.status(404).json({ message: "Course not found" });
        return res.status(200).json({ course });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/courses  (org only)
export async function createCourse(req, res) {
    try {
        const { title, description, skills, level, duration, price, isFree } = req.body;

        const courseData = {
            title,
            description,
            skills: Array.isArray(skills) ? skills : (skills || "").split(",").map(s => s.trim()).filter(Boolean),
            level: level || "beginner",
            duration: duration || "",
            price: Number(price) || 0,
            isFree: isFree === "true" || isFree === true || Number(price) === 0,
            organisation: req.user.id
        };

        // Handle uploaded files
        if (req.files) {
            if (req.files.thumbnail) courseData.thumbnailUrl = req.files.thumbnail[0].path;
            if (req.files.video) courseData.videoUrl = req.files.video[0].path;
        }

        const course = await courseModel.create(courseData);
        return res.status(201).json({ message: "Course created", course });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/courses/:id  (org only)
export async function updateCourse(req, res) {
    try {
        const course = await courseModel.findOne({ _id: req.params.id, organisation: req.user.id });
        if (!course) return res.status(404).json({ message: "Course not found or unauthorized" });

        const { title, description, skills, level, duration, price, isFree } = req.body;
        if (title) course.title = title;
        if (description) course.description = description;
        if (skills) course.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim()).filter(Boolean);
        if (level) course.level = level;
        if (duration) course.duration = duration;
        if (price !== undefined) course.price = Number(price);
        if (isFree !== undefined) course.isFree = isFree === "true" || isFree === true;
        if (req.files?.thumbnail) course.thumbnailUrl = req.files.thumbnail[0].path;
        if (req.files?.video) course.videoUrl = req.files.video[0].path;

        await course.save();
        return res.status(200).json({ message: "Course updated", course });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/courses/:id  (org only)
export async function deleteCourse(req, res) {
    try {
        const course = await courseModel.findOneAndDelete({ _id: req.params.id, organisation: req.user.id });
        if (!course) return res.status(404).json({ message: "Course not found or unauthorized" });
        return res.status(200).json({ message: "Course deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/courses/org/mine  (org's own courses)
export async function getMyCourses(req, res) {
    try {
        const courses = await courseModel.find({ organisation: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ courses });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
