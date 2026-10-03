import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadResume, uploadImage } from "../middleware/uploadMiddleware.js";

const userRouter = Router();

userRouter.get("/profile", protect(["user"]), userController.getProfile);
userRouter.put("/profile", protect(["user"]), uploadImage.single("profilePic"), userController.updateProfile);
userRouter.post("/resume", protect(["user"]), uploadResume.single("resume"), userController.uploadResume);
userRouter.get("/roadmap", protect(["user"]), userController.getRoadmap);

export default userRouter;
