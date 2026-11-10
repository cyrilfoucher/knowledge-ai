import type { Request, Response } from "express";
import { AskAssistantSchema } from "../schemas/assistantSchema.js";
import { askAssistant } from "../services/assistantService.js";

export async function askAssistantController(req: Request, res: Response) {
  const data = AskAssistantSchema.parse(req.body);
  const result = await askAssistant(data.question, req.user?.userId);
  return res.status(200).json(result);
}
