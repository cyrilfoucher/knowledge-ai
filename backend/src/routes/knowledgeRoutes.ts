import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createKnowledgeController,
  getMyKnowledgesController,
} from "../controllers/knowledgeController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createKnowledgeController);
router.get("/", getMyKnowledgesController);

export default router;
