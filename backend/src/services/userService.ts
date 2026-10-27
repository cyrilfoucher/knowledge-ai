import AppError from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

export async function getPublicProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: { select: { knowledges: { where: { visibility: "PUBLIC" } } } },
    },
  });
  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }
  const totalLikes = await prisma.like.count({
    where: { knowledge: { authorId: userId, visibility: "PUBLIC" } },
  });
  return {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt,
    publicKnowledges: user._count.knowledges,
    totalLikes,
  };
}
