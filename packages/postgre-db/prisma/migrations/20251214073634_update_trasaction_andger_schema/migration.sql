/*
  Warnings:

  - You are about to drop the column `accountId` on the `LedgerEntry` table. All the data in the column will be lost.
  - Added the required column `receiverPrimaryAccountId` to the `LedgerEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderPrimaryAccountId` to the `LedgerEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LedgerEntry" DROP CONSTRAINT "LedgerEntry_accountId_fkey";

-- AlterTable
ALTER TABLE "LedgerEntry" DROP COLUMN "accountId",
ADD COLUMN     "receiverPrimaryAccountId" TEXT NOT NULL,
ADD COLUMN     "senderPrimaryAccountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_senderPrimaryAccountId_fkey" FOREIGN KEY ("senderPrimaryAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
