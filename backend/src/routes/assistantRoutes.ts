import { Router } from "express";
import optionalAuthMiddleware from "../middlewares/optionalAuthMiddleware.js";
import { askAssistantController } from "../controllers/assistantController.js";
import { aiRateLimit } from "../middlewares/aiRateLimit.js";

const router = Router();

router.post("/", optionalAuthMiddleware, aiRateLimit, askAssistantController);

export default router;
