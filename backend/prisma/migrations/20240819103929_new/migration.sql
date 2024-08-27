/*
  Warnings:

  - A unique constraint covering the columns `[user2Id,user1Id]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_user2Id_user1Id_key" ON "Conversation"("user2Id", "user1Id");
