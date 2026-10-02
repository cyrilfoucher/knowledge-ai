import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError.js";
import { z, ZodError } from "zod";

function errorMiddleware(
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
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Données saisies invalides",
      errors: z.flattenError(error).fieldErrors,
    });
  }
  return res
    .status(500)
    .json({ success: false, message: "Une erreur interne est survenue." });
}

export default errorMiddleware;
