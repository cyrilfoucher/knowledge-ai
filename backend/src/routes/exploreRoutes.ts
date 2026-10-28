import { Router } from "express";
import {
  getPublicKnowledgeByIdController,
  getPublicKnowledgesController,
} from "../controllers/exploreController.js";
import optionalAuthMiddleware from "../middlewares/optionalAuthMiddleware.js";

const router = Router();
router.get("/", optionalAuthMiddleware, getPublicKnowledgesController);
router.get("/:id", optionalAuthMiddleware, getPublicKnowledgeByIdController);
export default router;
