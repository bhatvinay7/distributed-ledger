import { prisma, Prisma } from "prisma"
import { Response } from "express"
import { AuthRequest } from "types"
const update_primary_account = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user
        const accountId = req.body.accountId as string
    
        const user_account_detail = await prisma.account.findFirst({
            where: { id: accountId },
        })
        if (!user_account_detail) {
            return res.status(404).json({ message: "Account is not avalable" })
        }
        const result = await prisma.$transaction(
            async (tx: Prisma.TransactionClient) => {
                const updatedUser = await tx.user.update({
                    where: { id: user.userId },
                    data: {
                        primaryAccountId: accountId,
                    },
                });

                const updatedAccountDetail = await tx.accountDetail.update({
                    where: {
                        accountId: user_account_detail.id,
                    },
                    data: {
                        isPrimary: true,
                    },
                });
            }
        );
        return res.status(200).json({ message: "Primary account updated successfully" } )
    }
    catch (error: unknown) {
        return res.status(500).json({ message: "server error" })
    }
}
export default update_primary_account
