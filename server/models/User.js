import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        default: "user"
    },
    bio: {
        type: String,
        default: ""
    },
    profilePicUrl: {
        type: String,
        default: ""
    },
    skills: [{ type: String }],
    jobPreferences: {
        title: { type: String, default: "" },
        location: { type: String, default: "" },
        type: { type: String, enum: ["remote", "onsite", "hybrid", "any"], default: "any" }
    },
    resumeUrl: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);
export default userModel;
