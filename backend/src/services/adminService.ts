import AppError from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import { sendEmail } from "../utils/email.js";
import {
  deletedKnowledgeEmail,
  unpublishedKnowledgeEmail,
} from "../utils/emailTemplates.js";

export async function unpublishKnowledge(id: string, reason: string) {
  const knowledge = await prisma.knowledge.findFirst({
    where: { id, visibility: "PUBLIC" },
  });
  if (!knowledge) {
    throw new AppError("Fiche publique introuvable", 404);
  }

  const unpublishedKnowledge = await prisma.knowledge.update({
    where: { id },
    data: { visibility: "PRIVATE" },
    include: {
      author: { select: { name: true, email: true } },
    },
  });

  sendEmail({
    to: unpublishedKnowledge.author.email,
    subject: "Une de tes fiches a été retirée par la modération",
    html: unpublishedKnowledgeEmail(
      unpublishedKnowledge.author.name,
      unpublishedKnowledge.title,
      reason,
    ),
  }).catch((error) => {
    console.error("Échec de l'envoi de l'email de dépublication", error);
  });

  return unpublishedKnowledge;
}

export async function deleteKnowledgeByAdmin(id: string, reason: string) {
  const knowledge = await prisma.knowledge.findFirst({
    where: { id, visibility: "PUBLIC" },
    include: {
      author: { select: { name: true, email: true } },
    },
  });
  if (!knowledge) {
    throw new AppError("Fiche publique introuvable", 404);
  }

  await prisma.knowledge.delete({ where: { id } });

  sendEmail({
    to: knowledge.author.email,
    subject: "Une de tes fiches a été supprimée par la modération",
    html: deletedKnowledgeEmail(knowledge.author.name, knowledge.title, reason),
  }).catch((error) => {
    console.error("Échec de l'envoi de l'email de suppression", error);
  });
}

export async function getAdminStats() {
  const [users, knowledges, publicKnowledges] = await Promise.all([
    prisma.user.count(),
    prisma.knowledge.count(),
    prisma.knowledge.count({ where: { visibility: "PUBLIC" } }),
  ]);
  return { users, knowledges, publicKnowledges };
}

export async function getUsers(page: number, limit: number) {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { knowledges: true } },
      },
    }),
    prisma.user.count(),
  ]);
  return { users, total };
}
