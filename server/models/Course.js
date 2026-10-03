import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Course title is required"]
    },
    description: {
        type: String,
        required: [true, "Course description is required"]
    },
    thumbnailUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    duration: {
        type: String,
        default: ""
    },
    skills: [{ type: String }],
    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organisations",
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const courseModel = mongoose.model("courses", courseSchema);
export default courseModel;
