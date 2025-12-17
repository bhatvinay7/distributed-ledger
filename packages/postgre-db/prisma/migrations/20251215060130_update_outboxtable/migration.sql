/*
  Warnings:

  - Added the required column `causationId` to the `Outbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correlationId` to the `Outbox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Outbox" ADD COLUMN     "causationId" TEXT NOT NULL,
ADD COLUMN     "correlationId" TEXT NOT NULL;
