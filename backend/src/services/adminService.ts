import AppError from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import { sendEmail } from "../utils/email.js";
import {
  deletedKnowledgeEmail,
  unpublishedKnowledgeEmail,
} from "../utils/emailTemplates.js";

export async function unpublishKnowledge(id: string, reason: string) {
  const knowledge = await prisma.knowledge.findFirst({
    where: {
      id: id,
      visibility: "PUBLIC",
    },
  });
  if (!knowledge) {
    throw new AppError("Fiche publique introuvable", 404);
  }
  const unpublishedKnowledge = await prisma.knowledge.update({
    where: { id: id },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    data: { visibility: "PRIVATE" },
  });
  try {
    await sendEmail({
      to: unpublishedKnowledge.author.email,
      subject: "Une de tes fiches a été retirée par la modération",
      html: unpublishedKnowledgeEmail(
        unpublishedKnowledge.author.name,
        unpublishedKnowledge.title,
        reason,
      ),
    });
  } catch (error) {
    console.error("Échec de l'envoi de l'email", error);
  }
  return unpublishedKnowledge;
}
export async function deleteKnowledgeByAdmin(id: string, reason: string) {
  const deleteKnowledge = await prisma.knowledge.findFirst({
    where: { id: id, visibility: "PUBLIC" },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  if (!deleteKnowledge) {
    throw new AppError("Fiche publique introuvable", 404);
  }
  await prisma.knowledge.delete({
    where: { id: id },
  });
  try {
    await sendEmail({
      to: deleteKnowledge.author.email,
      subject: "Une de tes fiches a été supprimée par la modération",
      html: deletedKnowledgeEmail(
        deleteKnowledge.author.name,
        deleteKnowledge.title,
        reason,
      ),
    });
  } catch (error) {
    console.error("Impossible d'envoyer l'email", error);
  }
}
