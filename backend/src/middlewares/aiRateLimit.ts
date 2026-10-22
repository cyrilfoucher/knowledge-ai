import rateLimit from "express-rate-limit";

export const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => req.user?.userId ?? "anonymous",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Tu as atteint la limite de 10 utilisations de l'IA par heure. Réessaie plus tard.",
  },
});
