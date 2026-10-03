import { Router } from "express";
import * as orgAuthController from "../controllers/orgAuthController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadImage } from "../middleware/uploadMiddleware.js";

const orgRouter = Router();

orgRouter.post("/register", orgAuthController.orgRegister);
orgRouter.post("/login", orgAuthController.orgLogin);
orgRouter.get("/get-me", protect(["org"]), orgAuthController.getOrgMe);
orgRouter.put("/profile", protect(["org"]), uploadImage.single("logo"), orgAuthController.updateOrgProfile);
orgRouter.post("/logout", protect(["org"]), orgAuthController.orgLogout);

export default orgRouter;
