import { Router } from "express";
import * as jobController from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const jobRouter = Router();

// Public
jobRouter.get("/", jobController.getJobs);
jobRouter.get("/org/mine", protect(["org"]), jobController.getMyJobs);
jobRouter.get("/:id", jobController.getJobById);

// Org protected
jobRouter.post("/", protect(["org"]), jobController.createJob);
jobRouter.put("/:id", protect(["org"]), jobController.updateJob);
jobRouter.delete("/:id", protect(["org"]), jobController.deleteJob);

// User protected
jobRouter.post("/:id/apply", protect(["user"]), jobController.applyToJob);

export default jobRouter;
