import { Router } from "express";
import * as courseController from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../middleware/uploadMiddleware.js";

const courseRouter = Router();

// Multi-file upload for courses (thumbnail + video)
const courseStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        if (file.fieldname === "thumbnail") {
            return { folder: "talentx/images", allowed_formats: ["jpg", "jpeg", "png", "webp"], resource_type: "image" };
        }
        return { folder: "talentx/videos", allowed_formats: ["mp4", "mov", "avi"], resource_type: "video" };
    }
});

const courseUpload = multer({ storage: courseStorage });
const courseFields = courseUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }
]);

// Public
courseRouter.get("/", courseController.getCourses);
courseRouter.get("/org/mine", protect(["org"]), courseController.getMyCourses);
courseRouter.get("/:id", courseController.getCourseById);

// Org protected
courseRouter.post("/", protect(["org"]), courseFields, courseController.createCourse);
courseRouter.put("/:id", protect(["org"]), courseFields, courseController.updateCourse);
courseRouter.delete("/:id", protect(["org"]), courseController.deleteCourse);

export default courseRouter;
