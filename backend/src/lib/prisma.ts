import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const url = new URL(process.env.DATABASE_URL!);
url.searchParams.delete("sslmode");
const caPath = process.env.DATABASE_SSL_CA_PATH;
const adapter = new PrismaPg({
  connectionString: url.toString(),
  ssl: caPath ? { ca: readFileSync(caPath, "utf8") } : undefined,
});

export const prisma = new PrismaClient({ adapter });
