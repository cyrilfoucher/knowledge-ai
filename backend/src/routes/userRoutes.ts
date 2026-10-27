import { Router } from "express";
import { getPublicProfileController } from "../controllers/userController.js";

const router = Router();
router.get("/:id", getPublicProfileController);

export default router;
