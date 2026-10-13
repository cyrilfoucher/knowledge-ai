import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError.js";

function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    throw new AppError("Non authentifié", 401);
  }
  if (req.user.role !== "ADMIN") {
    throw new AppError("Accès réservé aux administrateurs", 403);
  }
  next();
}

export default adminMiddleware;
