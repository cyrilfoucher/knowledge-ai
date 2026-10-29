import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError.js";
import { isDemoUser } from "../utils/demo.js";

async function demoReadOnlyMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (req.user && (await isDemoUser(req.user.userId))) {
    throw new AppError(
      "Le compte de démonstration ne peut pas modérer les fiches",
      403,
    );
  }
  next();
}

export default demoReadOnlyMiddleware;
