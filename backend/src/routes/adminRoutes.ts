import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {
  deleteKnowledgeByAdminController,
  unpublishKnowledgeController,
} from "../controllers/adminController.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);
router.patch("/knowledges/:id/unpublish", unpublishKnowledgeController);
router.delete("/knowledges/:id", deleteKnowledgeByAdminController);

export default router;
