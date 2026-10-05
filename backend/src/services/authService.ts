import AppError from "../errors/AppError.js";
import type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  UpdatePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../schemas/authSchema.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "node:crypto";
import { sendEmail } from "../utils/email.js";
import { welcomeEmail, resetPasswordEmail } from "../utils/emailTemplates.js";

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
  try {
    await sendEmail({
      to: user.email,
      subject: "Bienvenue sur DevKnowledge",
      html: welcomeEmail(user.name, process.env.CLIENT_URL ?? ""),
    });
  } catch (error) {
    console.error("Échec de l'envoi de l'email de bienvenue :", error);
  }
  return user;
}

export async function loginUser(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }
  const verifPassword = await bcrypt.compare(data.password, user.passwordHash);
  if (!verifPassword) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }
  const {
    passwordHash,
    resetTokenHash,
    resetTokenExpiresAt,
    ...userWithoutPassword
  } = user;
  return userWithoutPassword;
}
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      role: true,
    },
  });
  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }
  return user;
}

export async function updateCurrentUser(
  userId: string,
  data: UpdateProfileInput,
) {
  if (data.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new AppError("Cette adresse email est déjà utilisée", 409);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      email: data.email,
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

  return updatedUser;
}

export async function updatePassword(
  userId: string,
  data: UpdatePasswordInput,
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new AppError("Aucun utilisateur trouvé", 404);
  }
  const passwordVerif = await bcrypt.compare(
    data.currentPassword,
    user.passwordHash,
  );
  if (!passwordVerif) {
    throw new AppError("Mot de passe actuel incorrect", 401);
  }
  const hashNewPassword = await bcrypt.hash(data.newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: hashNewPassword,
    },
  });
}

export async function forgotPassword(data: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    return;
  }
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
    },
  });
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "Réinitialisation de votre mot de passe",
    html: resetPasswordEmail(resetLink),
  });
}

export async function resetPassword(data: ResetPasswordInput) {
  const tokenHash = createHash("sha256").update(data.token).digest("hex");
  const user = await prisma.user.findUnique({
    where: {
      resetTokenHash: tokenHash,
    },
  });
  if (
    !user ||
    !user.resetTokenExpiresAt ||
    user.resetTokenExpiresAt < new Date()
  ) {
    throw new AppError("Ce lien est invalide ou a expiré", 400);
  }
  const passwordHash = await bcrypt.hash(data.newPassword, 12);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash: passwordHash,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    },
  });
}
