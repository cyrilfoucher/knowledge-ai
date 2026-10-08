import { prisma } from "../lib/prisma.js";
import type { CreateKnowledgeInput } from "../schemas/knowledgeSchema.js";

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
