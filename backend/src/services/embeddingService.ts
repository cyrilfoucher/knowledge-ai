import { prisma } from "../lib/prisma.js";
import { createEmbedding } from "./aiService.js";

export async function saveKnowledgeEmbedding(
  id: string,
  title: string,
  content: string,
) {
  try {
    const vector = await createEmbedding(`${title}\n\n${content}`);
    await prisma.$executeRaw`UPDATE "Knowledge" SET "embedding" = ${JSON.stringify(vector)}::vector WHERE "id" = ${id}`;
  } catch (error) {
    console.error("Embedding impossible pour la fiche", id, error);
  }
}
