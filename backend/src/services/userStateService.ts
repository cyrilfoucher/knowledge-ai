import { prisma } from "../lib/prisma.js";

export async function addUserState<T extends { id: string }>(
  knowledges: T[],
  userId?: string,
) {
  if (!userId) {
    return knowledges.map((knowledge) => ({
      ...knowledge,
      isFavorite: false,
      liked: false,
    }));
  }

  const ids = knowledges.map((knowledge) => knowledge.id);

  const [favorites, likes] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId, knowledgeId: { in: ids } },
      select: { knowledgeId: true },
    }),
    prisma.like.findMany({
      where: { userId, knowledgeId: { in: ids } },
      select: { knowledgeId: true },
    }),
  ]);

  const favoriteIds = new Set(
    favorites.map((favorite) => favorite.knowledgeId),
  );
  const likedIds = new Set(likes.map((like) => like.knowledgeId));

  return knowledges.map((knowledge) => ({
    ...knowledge,
    isFavorite: favoriteIds.has(knowledge.id),
    liked: likedIds.has(knowledge.id),
  }));
}
