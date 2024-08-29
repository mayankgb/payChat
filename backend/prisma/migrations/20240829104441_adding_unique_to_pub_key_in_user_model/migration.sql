/*
  Warnings:

  - A unique constraint covering the columns `[pubKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `pubKey` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pubKey" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_pubKey_key" ON "User"("pubKey");
