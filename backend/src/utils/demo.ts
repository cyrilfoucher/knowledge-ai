import { prisma } from "../lib/prisma.js";

export function isDemoEmail(email: string) {
  return (
    email === process.env.DEMO_EMAIL || email === process.env.DEMO_ADMIN_EMAIL
  );
}

export async function isDemoUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user) {
    return false;
  }
  return isDemoEmail(user.email);
}
