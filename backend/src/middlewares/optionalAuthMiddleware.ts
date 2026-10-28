import { verifyToken } from "../utils/jwt.js";
import type { Request, Response, NextFunction } from "express";

function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.cookies.token;
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // Token invalide ou expiré : on continue comme un visiteur non connecté
    }
  }
  next();
}

export default optionalAuthMiddleware;
