import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { saveKnowledgeEmbedding } from "../services/embeddingService.js";

const knowledges = await prisma.$queryRaw<
  { id: string; title: string; content: string }[]
>`
    SELECT "id","title","content" FROM "Knowledge" WHERE "embedding" IS NULL `;
console.log(`${knowledges.length} fiches à traiter`);
for (const knowledge of knowledges) {
  await saveKnowledgeEmbedding(
    knowledge.id,
    knowledge.title,
    knowledge.content,
  );
  console.log(knowledge.title);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
await prisma.$disconnect();
