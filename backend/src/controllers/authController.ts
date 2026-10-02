import type { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "../schemas/authSchema.js";
import { registerUser, loginUser } from "../services/authService.js";

export async function registerController(req: Request, res: Response) {
  const data = RegisterSchema.parse(req.body);
  const user = await registerUser(data);
  res.status(201).json({ user });
}

export async function loginController(req: Request, res: Response) {
  const data = LoginSchema.parse(req.body);
  const user = await loginUser(data);
  res.status(200).json({ user });
}
