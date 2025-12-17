/*
  Warnings:

  - Added the required column `receiverPrimaryAccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderPrimaryAccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "receiverPrimaryAccountId" TEXT NOT NULL,
ADD COLUMN     "senderPrimaryAccountId" TEXT NOT NULL;
