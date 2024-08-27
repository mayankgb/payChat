/*
  Warnings:

  - A unique constraint covering the columns `[conversationId,userId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Group_conversationId_userId_key" ON "Group"("conversationId", "userId");
