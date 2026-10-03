import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Organisation name is required"]
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
    logoUrl: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    industry: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const organisationModel = mongoose.model("organisations", organisationSchema);
export default organisationModel;
