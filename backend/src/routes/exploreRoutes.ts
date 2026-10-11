import { Router } from "express";
import {
  getPublicKnowledgeByIdController,
  getPublicKnowledgesController,
} from "../controllers/exploreController.js";

const router = Router();
router.get("/", getPublicKnowledgesController);
router.get("/:id", getPublicKnowledgeByIdController);
export default router;
