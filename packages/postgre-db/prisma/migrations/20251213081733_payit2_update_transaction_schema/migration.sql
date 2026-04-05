/*
  Warnings:

  - The `accountType` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('SAVINGS', 'CURRENT', 'SALARY', 'FIXED_DEPOSIT', 'RECURRING_DEPOSIT');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "accountType",
ADD COLUMN     "accountType" "BankAccountType" NOT NULL DEFAULT 'SAVINGS';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
