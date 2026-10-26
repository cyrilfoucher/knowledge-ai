import { prisma } from "../lib/prisma.js";
import AppError from "../errors/AppError.js";
import {
  buildKnowledgeFilters,
  buildKnowledgeOrderBy,
} from "../utils/knowledgeFilters.js";
import type { KnowledgeQueryInput } from "../schemas/knowledgeQuerySchema.js";
import type { Prisma } from "../generated/prisma/client.js";

export async function getPublicKnowledges(query: KnowledgeQueryInput) {
  const where: Prisma.KnowledgeWhereInput = {
    ...buildKnowledgeFilters(query),
    visibility: "PUBLIC",
  };
  const [knowledges, total] = await Promise.all([
    prisma.knowledge.findMany({
      where: where,
      orderBy: buildKnowledgeOrderBy(query.sort),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        author: { select: { name: true } },
        category: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
        _count: { select: { likes: true } },
      },
    }),
    prisma.knowledge.count({
      where: where,
    }),
  ]);
  return { knowledges, total };
}

export async function getPublicKnowledgeById(id: string) {
  const knowledge = await prisma.knowledge.findFirst({
    where: { visibility: "PUBLIC", id: id },
    include: {
      author: { select: { name: true } },
      category: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
      _count: { select: { likes: true } },
    },
  });
  if (!knowledge) {
    throw new AppError("Fiche de connaissance introuvable", 404);
  }
  return knowledge;
}
