import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import config from "../config/config.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
});

// Resume storage (PDF only)
const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "talentx/resumes",
        allowed_formats: ["pdf"],
        resource_type: "raw",
    },
});

// Image storage (thumbnails, logos, profile pics)
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "talentx/images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        resource_type: "image",
    },
});

// Video storage (course videos)
const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "talentx/videos",
        allowed_formats: ["mp4", "mov", "avi", "mkv"],
        resource_type: "video",
    },
});

export const uploadResume = multer({ storage: resumeStorage });
export const uploadImage = multer({ storage: imageStorage });
export const uploadVideo = multer({ storage: videoStorage });
export { cloudinary };
