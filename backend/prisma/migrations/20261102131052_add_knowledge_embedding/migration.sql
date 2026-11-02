CREATE EXTENSION IF NOT EXISTS vector;
-- AlterTable
ALTER TABLE "Knowledge" ADD COLUMN     "embedding" vector(1024);
