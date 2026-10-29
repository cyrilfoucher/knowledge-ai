import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {
  deleteKnowledgeByAdminController,
  getAdminStatsController,
  getUsersController,
  unpublishKnowledgeController,
} from "../controllers/adminController.js";
import demoReadOnlyMiddleware from "../middlewares/demoReadOnlyMiddleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);
router.patch(
  "/knowledges/:id/unpublish",
  demoReadOnlyMiddleware,
  unpublishKnowledgeController,
);
router.delete(
  "/knowledges/:id",
  demoReadOnlyMiddleware,
  deleteKnowledgeByAdminController,
);
router.get("/stats", getAdminStatsController);
router.get("/users", getUsersController);

export default router;
