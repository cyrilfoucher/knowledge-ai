import { Request, Response } from "express";
import { getPublicProfile } from "../services/userService.js";

export async function getPublicProfileController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const profile = await getPublicProfile(req.params.id);
  return res.status(200).json({ user: profile });
}
