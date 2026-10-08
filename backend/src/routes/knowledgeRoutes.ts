import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createKnowledgeController } from "../controllers/knowledgeController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createKnowledgeController);

export default router;
