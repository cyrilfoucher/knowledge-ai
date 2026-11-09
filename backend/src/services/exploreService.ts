import { prisma } from "../lib/prisma.js";
import AppError from "../errors/AppError.js";
import {
  buildKnowledgeFilters,
  buildKnowledgeOrderBy,
} from "../utils/knowledgeFilters.js";
import type { KnowledgeQueryInput } from "../schemas/knowledgeQuerySchema.js";
import type { Prisma } from "../generated/prisma/client.js";
import { addUserState } from "./userStateService.js";
import {
  findSimilarKnowledgeIds,
  findSimilarToKnowledgeIds,
} from "./embeddingService.js";

export async function getPublicKnowledges(
  query: KnowledgeQueryInput,
  userId?: string,
) {
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
  return { knowledges: await addUserState(knowledges, userId), total };
}

async function getPublicKnowledgeByIds(id: string[], userId?: string) {
  const knowledges = await prisma.knowledge.findMany({
    where: { id: { in: id } },
    include: {
      author: { select: { name: true } },
      category: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
      _count: { select: { likes: true } },
    },
  });
  knowledges.sort((a, b) => id.indexOf(a.id) - id.indexOf(b.id));
  return await addUserState(knowledges, userId);
}

export async function searchPublicKnowledges(q: string, userId?: string) {
  const ids = await findSimilarKnowledgeIds(q, 10);
  return getPublicKnowledgeByIds(ids, userId);
}

export async function getSimilarPublicKnowledges(id: string, userId?: string) {
  const ids = await findSimilarToKnowledgeIds(id, 3);
  return getPublicKnowledgeByIds(ids, userId);
}

export async function getPublicKnowledgeById(id: string, userId?: string) {
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
  const [knowledgeWithState] = await addUserState([knowledge], userId);
  return knowledgeWithState;
}
