import type { Request, Response } from "express";
import { ExploreQuerySchema } from "../schemas/exploreSchema.js";
import {
  getPublicKnowledges,
  getPublicKnowledgeById,
} from "../services/exploreService.js";

export async function getPublicKnowledgesController(
  req: Request,
  res: Response,
) {
  const { page, limit } = ExploreQuerySchema.parse(req.query);
  const { knowledges, total } = await getPublicKnowledges(page, limit);
  const totalPages = Math.ceil(total / limit);
  return res.json({ page, limit, totalPages, knowledges, total });
}

export async function getPublicKnowledgeByIdController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const knowledge = await getPublicKnowledgeById(req.params.id);
  res.json({ knowledge });
}
