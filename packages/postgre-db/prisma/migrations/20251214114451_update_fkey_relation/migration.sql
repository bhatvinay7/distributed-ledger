-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_senderId_fkey";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderPrimaryAccountId_fkey" FOREIGN KEY ("senderPrimaryAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
