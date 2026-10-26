import type { KnowledgeQueryInput } from "../schemas/knowledgeQuerySchema.js";
import type { Prisma } from "../generated/prisma/client.js";

export function buildKnowledgeFilters({
  q,
  category,
  tag,
}: KnowledgeQueryInput): Prisma.KnowledgeWhereInput {
  const where: Prisma.KnowledgeWhereInput = {};
  if (category) {
    where.categoryId = category;
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }
  if (tag) {
    where.tags = { some: { name: tag } };
  }
  return where;
}

export function buildKnowledgeOrderBy(
  sort: KnowledgeQueryInput["sort"],
):
  | Prisma.KnowledgeOrderByWithRelationInput
  | Prisma.KnowledgeOrderByWithRelationInput[] {
  if (sort === "oldest") {
    return { updatedAt: "asc" };
  }
  if (sort === "title") {
    return { title: "asc" };
  }
  if (sort === "popular") {
    return [{ likes: { _count: "desc" } }, { updatedAt: "desc" }];
  }
  return { updatedAt: "desc" };
}
