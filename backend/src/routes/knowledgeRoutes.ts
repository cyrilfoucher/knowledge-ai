import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createKnowledgeController,
  getMyKnowledgesController,
  getKnowledgeByIdController,
  updateKnowledgeByIdController,
  deleteKnowledgeByIdController,
  generateKnowledgeSummaryController,
} from "../controllers/knowledgeController.js";
import { aiRateLimit } from "../middlewares/aiRateLimit.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createKnowledgeController);
router.get("/", getMyKnowledgesController);
router.get("/:id", getKnowledgeByIdController);
router.patch("/:id", updateKnowledgeByIdController);
router.delete("/:id", deleteKnowledgeByIdController);
router.post("/:id/summary", aiRateLimit, generateKnowledgeSummaryController);
export default router;
