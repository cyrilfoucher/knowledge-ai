import type { Request, Response } from "express";
import { ModerationSchema } from "../schemas/adminSchema.js";
import {
  unpublishKnowledge,
  deleteKnowledgeByAdmin,
  getAdminStats,
  getUsers,
} from "../services/adminService.js";
import { PaginationQuerySchema } from "../schemas/paginationSchema.js";

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
  return res.status(204).send();
}

export async function getAdminStatsController(req: Request, res: Response) {
  const stats = await getAdminStats();
  return res.json({ stats });
}

export async function getUsersController(req: Request, res: Response) {
  const { page, limit } = PaginationQuerySchema.parse(req.query);
  const { users, total } = await getUsers(page, limit);
  const totalPages = Math.ceil(total / limit);
  return res.json({ users, total, page, limit, totalPages });
}
