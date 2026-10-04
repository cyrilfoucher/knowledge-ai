import { Router } from "express";
import {
  loginController,
  registerController,
  meController,
  logoutController,
  updateMeController,
  updatePasswordController,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, meController);
router.post("/logout", logoutController);
router.patch("/me", authMiddleware, updateMeController);
router.patch("/me/password", authMiddleware, updatePasswordController);
export default router;
