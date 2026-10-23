import type { Request, Response } from "express";
import AppError from "../errors/AppError.js";
import { PaginationQuerySchema } from "../schemas/paginationSchema.js";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavorites,
} from "../services/favoriteService.js";

export async function addFavoriteController(
  req: Request<{ knowledgeId: string }>,
  res: Response,
) {
  if (!req.user) {
    throw new AppError("Aucun utilisateur", 401);
  }
  await addFavorite(req.user.userId, req.params.knowledgeId);
  return res.status(201).json({ isFavorite: true });
}

export async function removeFavoriteController(
  req: Request<{ knowledgeId: string }>,
  res: Response,
) {
  if (!req.user) {
    throw new AppError("Aucun utilisateur", 401);
  }
  await removeFavorite(req.user.userId, req.params.knowledgeId);
  return res.status(204).send();
}

export async function isFavoriteController(
  req: Request<{ knowledgeId: string }>,
  res: Response,
) {
  if (!req.user) {
    throw new AppError("Aucun utilisateur", 401);
  }
  const favorite = await isFavorite(req.user.userId, req.params.knowledgeId);
  return res.status(200).json({ isFavorite: favorite });
}

export async function getFavoritesController(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Aucun utilisateur", 401);
  }
  const { page, limit } = PaginationQuerySchema.parse(req.query);
  const { knowledges, total } = await getFavorites(
    req.user.userId,
    page,
    limit,
  );
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({ knowledges, total, totalPages, page, limit });
}
