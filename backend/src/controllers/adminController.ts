import type { Request, Response } from "express";
import { ModerationSchema } from "../schemas/adminSchema.js";
import {
  unpublishKnowledge,
  deleteKnowledgeByAdmin,
} from "../services/adminService.js";

export async function unpublishKnowledgeController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const data = ModerationSchema.parse(req.body);
  const { reason } = data;
  await unpublishKnowledge(req.params.id, reason);
  return res.status(200).json({ message: "Fiche hors ligne" });
}

export async function deleteKnowledgeByAdminController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const data = ModerationSchema.parse(req.body);
  const { reason } = data;
  await deleteKnowledgeByAdmin(req.params.id, reason);
  return res.status(204);
}
