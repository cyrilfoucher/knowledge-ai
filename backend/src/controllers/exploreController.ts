import type { Request, Response } from "express";
import { KnowledgeQuerySchema } from "../schemas/knowledgeQuerySchema.js";
import {
  getPublicKnowledges,
  getPublicKnowledgeById,
} from "../services/exploreService.js";

export async function getPublicKnowledgesController(
  req: Request,
  res: Response,
) {
  const query = KnowledgeQuerySchema.parse(req.query);
  const { knowledges, total } = await getPublicKnowledges(
    query,
    req.user?.userId,
  );
  const totalPages = Math.ceil(total / query.limit);
  return res.json({
    page: query.page,
    limit: query.limit,
    totalPages,
    knowledges,
    total,
  });
}

export async function getPublicKnowledgeByIdController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const knowledge = await getPublicKnowledgeById(
    req.params.id,
    req.user?.userId,
  );
  res.json({ knowledge });
}
