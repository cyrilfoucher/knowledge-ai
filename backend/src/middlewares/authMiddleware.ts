import { verifyToken } from "../utils/jwt.js";
import AppError from "../errors/AppError.js";
import type { Request, Response, NextFunction } from "express";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    throw new AppError("Vous devez être connecté", 401);
  }
  try {
    req.user = verifyToken(token);
  } catch {
    throw new AppError("Session invalide ou expirée", 401);
  }
  next();
}

export default authMiddleware;
