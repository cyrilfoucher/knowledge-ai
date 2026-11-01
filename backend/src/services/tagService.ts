import { prisma } from "../lib/prisma.js";

export async function getPopularTagNames(limit: number) {
  const tags = await prisma.tag.findMany({
    select: { name: true },
    orderBy: { knowledges: { _count: "desc" } },
    take: limit,
  });
  const names = tags.map((tag) => tag.name);
  return names;
}
