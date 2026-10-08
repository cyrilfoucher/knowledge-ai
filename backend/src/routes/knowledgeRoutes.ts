import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createKnowledgeController,
  getMyKnowledgesController,
  getKnowledgeByIdController,
} from "../controllers/knowledgeController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createKnowledgeController);
router.get("/", getMyKnowledgesController);
router.get("/:id", getKnowledgeByIdController);

export default router;
