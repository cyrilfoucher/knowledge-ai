import { Router } from "express";
import {
  addLikeController,
  removeLikeController,
  hasLikedController,
} from "../controllers/likeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/:knowledgeId", addLikeController);
router.get("/:knowledgeId", hasLikedController);
router.delete("/:knowledgeId", removeLikeController);

export default router;
