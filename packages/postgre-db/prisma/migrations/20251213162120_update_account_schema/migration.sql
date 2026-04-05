-- AlterTable
ALTER TABLE "AccountDetail" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "primaryAccountId" TEXT;
