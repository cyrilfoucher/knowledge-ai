import { prisma } from "../lib/prisma.js";

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true, id: true },
  });
  return categories;
}
