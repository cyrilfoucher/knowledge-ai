import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addFavoriteController,
  getFavoritesController,
  isFavoriteController,
  removeFavoriteController,
} from "../controllers/favoriteController.js";

const router = Router();

router.use(authMiddleware);
router.get("/", getFavoritesController);
router.get("/:knowledgeId", isFavoriteController);
router.post("/:knowledgeId", addFavoriteController);
router.delete("/:knowledgeId", removeFavoriteController);

export default router;
