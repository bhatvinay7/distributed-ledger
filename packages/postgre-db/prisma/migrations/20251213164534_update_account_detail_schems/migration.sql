/*
  Warnings:

  - You are about to drop the column `accountNo` on the `AccountDetail` table. All the data in the column will be lost.
  - Added the required column `accountNumber` to the `AccountDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountDetail" DROP COLUMN "accountNo",
ADD COLUMN     "accountNumber" TEXT NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "pin" DROP NOT NULL;
