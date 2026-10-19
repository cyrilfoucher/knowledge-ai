import type { Request, Response } from "express";
import { getCategories } from "../services/categoryService.js";

export async function getCategoriesController(req: Request, res: Response) {
  const categories = await getCategories();
  return res.status(200).json({ categories });
}
