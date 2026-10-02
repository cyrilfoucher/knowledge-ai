import AppError from "../errors/AppError.js";
import type { RegisterInput } from "../schemas/authSchema.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export async function registerUser(data: RegisterInput) {
  const userExiste = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (userExiste) {
    throw new AppError("Cette adresse email est déjà utilisée", 409);
  }
  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: passwordHash,
      name: data.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      role: true,
    },
  });
  return user;
}
