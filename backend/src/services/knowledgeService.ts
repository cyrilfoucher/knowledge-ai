import { prisma } from "../lib/prisma.js";
import type { CreateKnowledgeInput } from "../schemas/knowledgeSchema.js";
import { TokenPayload } from "../utils/jwt.js";
import AppError from "../errors/AppError.js";

export async function createKnowledge(
  authorId: string,
  data: CreateKnowledgeInput,
) {
  const publication = await prisma.knowledge.create({
    data: {
      title: data.title,
      content: data.content,
      visibility: data.visibility,
      authorId,
    },
  });
  return publication;
}

export async function getMyKnowledges(authorId: string) {
  const authorKnowledges = await prisma.knowledge.findMany({
    where: { authorId: authorId },
    orderBy: { updatedAt: "desc" },
  });
  return authorKnowledges;
}

export async function getKnowledgeById(id: string, user: TokenPayload) {
  const knowledge = await prisma.knowledge.findUnique({
    where: { id },
  });
  if (!knowledge) {
    throw new AppError("Connaissance introuvable", 404);
  }
  const canRead =
    knowledge.visibility === "PUBLIC" ||
    knowledge.authorId === user.userId ||
    user.role === "ADMIN";
  if (!canRead) {
    throw new AppError("Connaissance introuvable", 404);
  }
  return knowledge;
}
