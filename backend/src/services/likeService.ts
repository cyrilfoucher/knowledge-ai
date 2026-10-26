import AppError from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

export async function countLikes(knowledgeId: string) {
  return prisma.like.count({ where: { knowledgeId } });
}

export async function addLike(userId: string, knowledgeId: string) {
  const knowledge = await prisma.knowledge.findFirst({
    where: { id: knowledgeId, visibility: "PUBLIC" },
  });
  if (!knowledge) {
    throw new AppError("Fiche publique introuvable", 404);
  }
  if (knowledge.authorId === userId) {
    throw new AppError("Tu ne peux pas liker ta propre fiche", 403);
  }
  await prisma.like.upsert({
    where: { userId_knowledgeId: { userId, knowledgeId } },
    update: {},
    create: { userId, knowledgeId },
  });
  return countLikes(knowledgeId);
}

export async function removeLike(userId: string, knowledgeId: string) {
  await prisma.like.deleteMany({ where: { userId, knowledgeId } });
  return countLikes(knowledgeId);
}

export async function hasLiked(userId: string, knowledgeId: string) {
  const like = await prisma.like.findUnique({
    where: { userId_knowledgeId: { userId, knowledgeId } },
  });
  return like !== null;
}
