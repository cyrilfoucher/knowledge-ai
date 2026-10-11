import { prisma } from "../lib/prisma.js";
import AppError from "../errors/AppError.js";

export async function getPublicKnowledges(page: number, limit: number) {
  const [knowledges, total] = await Promise.all([
    prisma.knowledge.findMany({
      where: {
        visibility: "PUBLIC",
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: { name: true } } },
    }),
    prisma.knowledge.count({
      where: {
        visibility: "PUBLIC",
      },
    }),
  ]);
  return { knowledges, total };
}

export async function getPublicKnowledgeById(id: string) {
  const knowledge = await prisma.knowledge.findFirst({
    where: { visibility: "PUBLIC", id: id },
    include: { author: { select: { name: true } } },
  });
  if (!knowledge) {
    throw new AppError("Fiche de connaissance introuvable", 404);
  }
  return knowledge;
}
