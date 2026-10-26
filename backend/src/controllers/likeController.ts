import type { Request, Response } from "express";
import { addLike, removeLike, hasLiked } from "../services/likeService.js";
import AppError from "../errors/AppError.js";

export async function addLikeController(
  req: Request<{ knowledgeId: string }>,
  res: Response,
) {
  if (!req.user) {
    throw new AppError("Aucun utilisateur", 401);
  }
  const count = await addLike(req.user.userId, req.params.knowledgeId);
  return res.status(201).json({ liked: true, count });
}

export async function removeLikeController(
  req: Request<{ knowledgeId: string }>,
  res: Response,
) {
  if (!req.user) {
    throw new AppError("Aucun utilisateur", 401);
  }
  const count = await removeLike(req.user.userId, req.params.knowledgeId);
  return res.status(200).json({ liked: false, count });
}

export async function hasLikedController(
  req: Request<{ knowledgeId: string }>,
  res: Response,
) {
  if (!req.user) {
    throw new AppError("Aucun utilisateur", 401);
  }
  const liked = await hasLiked(req.user.userId, req.params.knowledgeId);
  return res.status(200).json({ liked });
}
