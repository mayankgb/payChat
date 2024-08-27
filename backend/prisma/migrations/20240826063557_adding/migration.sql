-- CreateEnum
CREATE TYPE "transactionType" AS ENUM ('DEBITED', 'CREDITED');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "type";
