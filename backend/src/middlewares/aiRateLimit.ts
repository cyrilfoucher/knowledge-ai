import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { isDemoUser } from "../utils/demo.js";

export const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  keyGenerator: async (req) => {
    const userId = req.user?.userId;
    const ip = ipKeyGenerator(req.ip ?? "");

    if (!userId) {
      return `ip:${ip}`;
    }
    if (await isDemoUser(userId)) {
      return `demo:${ip}`;
    }
    return `user:${userId}`;
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Tu as atteint la limite de 10 utilisations de l'IA par heure. Réessaie plus tard.",
  },
});
