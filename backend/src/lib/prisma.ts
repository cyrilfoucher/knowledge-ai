import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const url = new URL(process.env.DATABASE_URL!);
url.searchParams.delete("sslmode");

const adapter = new PrismaPg({
  connectionString: url.toString(),
  ssl: { ca: readFileSync("certs/ca.pem", "utf8") },
});

export const prisma = new PrismaClient({ adapter });
