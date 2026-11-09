import type { Request, Response } from "express";
import {
  KnowledgeQuerySchema,
  SemanticSearchQuerySchema,
} from "../schemas/knowledgeQuerySchema.js";
import {
  getPublicKnowledges,
  getPublicKnowledgeById,
  searchPublicKnowledges,
  getSimilarPublicKnowledges,
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

export async function searchPublicKnowledgesController(
  req: Request,
  res: Response,
) {
  const query = SemanticSearchQuerySchema.parse(req.query);
  const knowledges = await searchPublicKnowledges(query.q, req.user?.userId);
  return res.status(200).json({ knowledges });
}

export async function getSimilarPublicKnowledgesController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const knowledges = await getSimilarPublicKnowledges(
    req.params.id,
    req.user?.userId,
  );
  return res.status(200).json({ knowledges });
}
