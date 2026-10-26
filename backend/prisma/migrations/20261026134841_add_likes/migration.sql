-- CreateTable
CREATE TABLE "Like" (
    "userId" TEXT NOT NULL,
    "knowledgeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("userId","knowledgeId")
);

-- CreateIndex
CREATE INDEX "Like_knowledgeId_idx" ON "Like"("knowledgeId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_knowledgeId_fkey" FOREIGN KEY ("knowledgeId") REFERENCES "Knowledge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
