import { Router } from "express";
import {
  loginController,
  registerController,
  meController,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, meController);
export default router;
