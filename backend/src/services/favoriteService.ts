import AppError from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

export async function addFavorite(userId: string, knowledgeId: string) {
  const existsKnowledge = await prisma.knowledge.findFirst({
    where: {
      id: knowledgeId,
      OR: [{ visibility: "PUBLIC" }, { authorId: userId }],
    },
  });
  if (!existsKnowledge) {
    throw new AppError("Fiche introuvable", 404);
  }
  const favori = await prisma.favorite.upsert({
    where: { userId_knowledgeId: { userId, knowledgeId } },
    update: {},
    create: { userId, knowledgeId },
  });
  return favori;
}

export async function removeFavorite(userId: string, knowledgeId: string) {
  await prisma.favorite.deleteMany({
    where: { userId, knowledgeId },
  });
}

export async function isFavorite(userId: string, knowledgeId: string) {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_knowledgeId: { userId, knowledgeId } },
  });
  return favorite !== null;
}

export async function getFavorites(
  userId: string,
  page: number,
  limit: number,
) {
  const where = {
    userId,
    knowledge: {
      OR: [{ visibility: "PUBLIC" as const }, { authorId: userId }],
    },
  };

  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        knowledge: {
          include: {
            author: { select: { name: true } },
            category: { select: { id: true, name: true } },
            tags: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.favorite.count({ where }),
  ]);

  return {
    knowledges: favorites.map((favorite) => favorite.knowledge),
    total,
  };
}
