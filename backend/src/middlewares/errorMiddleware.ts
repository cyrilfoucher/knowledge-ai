import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError.js";

function ErrorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ success: false, message: error.message });
  }
  return res
    .status(500)
    .json({ success: false, message: "Une erreur interne est survenue." });
}

export default ErrorMiddleware;
