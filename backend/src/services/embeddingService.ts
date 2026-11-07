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

export async function findSimilarKnowledgeIds(text: string, limit: number) {
  const vector = await createEmbedding(text);
  const rows = await prisma.$queryRaw<{ id: string; distance: number }[]>`
SELECT "id", "embedding" <=> ${JSON.stringify(vector)}::vector AS "distance" FROM "Knowledge" WHERE "visibility" = 'PUBLIC' AND "embedding" IS NOT NULL
ORDER BY "embedding" <=> ${JSON.stringify(vector)}::vector LIMIT ${limit}`;
  if (rows.length === 0) {
    return [];
  }
  const bestDistance = rows[0].distance;
  return rows
    .filter((row) => row.distance <= bestDistance + 0.01)
    .map((row) => row.id);
}
