import type { Request, Response } from "express";
import { registerSchema } from "../schemas/authSchema.js";
import { registerUser } from "../services/authService.js";

export async function registerController(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const user = await registerUser(data);
  res.status(201).json({ user });
}
