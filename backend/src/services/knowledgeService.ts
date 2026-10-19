import { prisma } from "../lib/prisma.js";
import type {
  CreateKnowledgeInput,
  UpdateKnowledgeInput,
} from "../schemas/knowledgeSchema.js";
import type { TokenPayload } from "../utils/jwt.js";
import AppError from "../errors/AppError.js";
import { isDemoUser } from "../utils/demo.js";

export async function createKnowledge(
  authorId: string,
  data: CreateKnowledgeInput,
) {
  if (data.visibility === "PUBLIC" && (await isDemoUser(authorId))) {
    throw new AppError(
      "Le compte de démonstration ne peut pas publier de fiche publique",
      403,
    );
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new AppError("Catégorie introuvable", 400);
    }
  }

  const tagNames = [...new Set(data.tags ?? [])];

  const publication = await prisma.knowledge.create({
    data: {
      title: data.title,
      content: data.content,
      visibility: data.visibility,
      authorId,
      categoryId: data.categoryId,
      tags: {
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: {
      category: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
    },
  });
  return publication;
}

export async function getMyKnowledges(
  authorId: string,
  page: number,
  limit: number,
) {
  const [knowledges, total] = await Promise.all([
    prisma.knowledge.findMany({
      where: {
        authorId,
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
      },
    }),
    prisma.knowledge.count({
      where: {
        authorId,
      },
    }),
  ]);
  return { knowledges, total };
}

export async function getKnowledgeById(id: string, user: TokenPayload) {
  const knowledge = await prisma.knowledge.findUnique({
    where: { id: id },
    include: {
      category: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
    },
  });
  if (!knowledge) {
    throw new AppError("Connaissance introuvable", 404);
  }
  const canRead =
    knowledge.visibility === "PUBLIC" || knowledge.authorId === user.userId;
  if (!canRead) {
    throw new AppError("Connaissance introuvable", 404);
  }
  return knowledge;
}

function canManageKnowledge(authorId: string, user: TokenPayload) {
  return authorId === user.userId;
}

export async function updateKnowledgeById(
  id: string,
  user: TokenPayload,
  data: UpdateKnowledgeInput,
) {
  const knowledge = await getKnowledgeById(id, user);
  const canEdit = canManageKnowledge(knowledge.authorId, user);
  if (!canEdit) {
    throw new AppError(
      "Vous n'avez pas le droit de modifier cette connaissance",
      403,
    );
  }

  const touchesPublic =
    knowledge.visibility === "PUBLIC" || data.visibility === "PUBLIC";
  if (touchesPublic && (await isDemoUser(user.userId))) {
    throw new AppError(
      "Le compte de démonstration ne peut pas modifier une fiche publique",
      403,
    );
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new AppError("Catégorie introuvable", 400);
    }
  }

  const { tags, ...fields } = data;

  const updateKnowledge = await prisma.knowledge.update({
    where: { id: id },
    data: {
      ...fields,
      tags: tags
        ? {
            set: [],
            connectOrCreate: [...new Set(tags)].map((name) => ({
              where: { name },
              create: { name },
            })),
          }
        : undefined,
    },
    include: {
      category: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
    },
  });
  return updateKnowledge;
}

export async function deleteKnowledgeById(id: string, user: TokenPayload) {
  const knowledge = await getKnowledgeById(id, user);
  const canDelete = canManageKnowledge(knowledge.authorId, user);
  if (!canDelete) {
    throw new AppError(
      "Vous n'avez pas le droit de supprimer cette connaissance",
      403,
    );
  }
  if (knowledge.visibility === "PUBLIC" && (await isDemoUser(user.userId))) {
    throw new AppError(
      "Le compte de démonstration ne peut pas supprimer une fiche publique",
      403,
    );
  }
  await prisma.knowledge.delete({
    where: { id: id },
  });
}
