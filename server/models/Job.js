import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"]
    },
    description: {
        type: String,
        required: [true, "Job description is required"]
    },
    requirements: [{ type: String }],
    skills: [{ type: String }],
    location: {
        type: String,
        default: "Remote"
    },
    type: {
        type: String,
        enum: ["remote", "onsite", "hybrid"],
        default: "remote"
    },
    salary: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        currency: { type: String, default: "INR" }
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organisations",
        required: true
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    }
}, { timestamps: true });

const jobModel = mongoose.model("jobs", jobSchema);
export default jobModel;
