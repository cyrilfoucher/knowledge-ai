import { Router } from "express";
import {
  getPublicKnowledgeByIdController,
  getPublicKnowledgesController,
  searchPublicKnowledgesController,
  getSimilarPublicKnowledgesController,
} from "../controllers/exploreController.js";
import optionalAuthMiddleware from "../middlewares/optionalAuthMiddleware.js";
import { aiRateLimit } from "../middlewares/aiRateLimit.js";

const router = Router();
router.get("/", optionalAuthMiddleware, getPublicKnowledgesController);
router.get(
  "/search",
  optionalAuthMiddleware,
  aiRateLimit,
  searchPublicKnowledgesController,
);
router.get("/:id", optionalAuthMiddleware, getPublicKnowledgeByIdController);
router.get(
  "/:id/similar",
  optionalAuthMiddleware,
  getSimilarPublicKnowledgesController,
);

export default router;
