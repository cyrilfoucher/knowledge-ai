import { prisma } from "../lib/prisma.js";
import type {
  CreateKnowledgeInput,
  UpdateKnowledgeInput,
} from "../schemas/knowledgeSchema.js";
import type { TokenPayload } from "../utils/jwt.js";
import AppError from "../errors/AppError.js";
import { isDemoUser } from "../utils/demo.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { KnowledgeQueryInput } from "../schemas/knowledgeQuerySchema.js";
import {
  buildKnowledgeFilters,
  buildKnowledgeOrderBy,
} from "../utils/knowledgeFilters.js";
import { summarizeText } from "./aiService.js";

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
  query: KnowledgeQueryInput,
) {
  const where: Prisma.KnowledgeWhereInput = {
    ...buildKnowledgeFilters(query),
    authorId,
  };
  const [knowledges, total] = await Promise.all([
    prisma.knowledge.findMany({
      where: where,
      orderBy: buildKnowledgeOrderBy(query.sort),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        category: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
        _count: { select: { likes: true } },
      },
    }),
    prisma.knowledge.count({
      where: where,
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
      _count: { select: { likes: true } },
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
      summary:
        data.content !== undefined && data.content !== knowledge.content
          ? null
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

export async function generateKnowledgeSummary(id: string, user: TokenPayload) {
  const knowledge = await getKnowledgeById(id, user);
  const canEdit = canManageKnowledge(knowledge.authorId, user);
  if (!canEdit) {
    throw new AppError("Vous n'avez pas le droit de résumer cette fiche", 403);
  }
  const summary = await summarizeText(knowledge.title, knowledge.content);
  const knowledgeSummary = await prisma.knowledge.update({
    where: { id: id },
    data: { summary: summary },
    include: {
      category: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
    },
  });
  return knowledgeSummary;
}
