import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  role: string;
}
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET manquant dans le .env");
  }
  return secret;
}
export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload {
  const verifToken = jwt.verify(token, getJwtSecret()) as TokenPayload;
  return verifToken;
}
