import type { Request, Response } from "express";
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
} from "../schemas/authSchema.js";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
} from "../services/authService.js";
import { signToken } from "../utils/jwt.js";
import AppError from "../errors/AppError.js";

export async function registerController(req: Request, res: Response) {
  const data = RegisterSchema.parse(req.body);
  const user = await registerUser(data);
  res.status(201).json({ user });
}

export async function loginController(req: Request, res: Response) {
  const data = LoginSchema.parse(req.body);
  const user = await loginUser(data);
  const token = signToken({ userId: user.id, role: user.role });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ user });
}

export async function meController(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Vous devez être connecté", 401);
  }
  const user = await getCurrentUser(req.user.userId);
  res.status(200).json({ user });
}

export function logoutController(req: Request, res: Response) {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .status(200)
    .json({ message: "Déconnexion réussie" });
}

export async function updateMeController(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Vous devez être connecté", 401);
  }
  const data = UpdateProfileSchema.parse(req.body);
  const user = await updateCurrentUser(req.user.userId, data);
  return res
    .status(200)
    .json({ message: "Modification(s) effectuée(s) avec succès", user });
}
