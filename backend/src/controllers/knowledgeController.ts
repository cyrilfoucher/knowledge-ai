import type { Request, Response } from "express";
import { CreateKnowledgeSchema } from "../schemas/knowledgeSchema.js";
import AppError from "../errors/AppError.js";
import {
  createKnowledge,
  getMyKnowledges,
} from "../services/KnowledgeService.js";

export async function createKnowledgeController(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Aucun utilisateur trouvé", 401);
  }
  const data = CreateKnowledgeSchema.parse(req.body);
  const knowledge = await createKnowledge(req.user.userId, data);
  return res.status(201).json({ knowledge });
}

export async function getMyKnowledgesController(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Aucun utilisateur trouvé", 401);
  }
  const knowledges = await getMyKnowledges(req.user.userId);
  return res.status(200).json({ knowledges });
}
