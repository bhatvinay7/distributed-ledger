import { prisma } from "prisma"
import { Response } from "express"
import { AuthRequest } from "types"
const fetch_user_accounts = async (req: AuthRequest, res: Response) => {
    try {

        const user = req.user
        console.log(user)
        const userAccounts = await prisma.account.findMany({
            where: { userId: user.userId },
            select: {
                details: {
                    select: {
                        accountId: true,
                        bankName:true,
                        accountNumber:true,
                        branch:true,
                        isPrimary:true
                    },
                },
            },
        });

        if (!userAccounts) {
            return res.status(404).json({ message: "user not have any account" })
        }
        return res.status(200).json(userAccounts)
    }
    catch (error: any) {
        return res.status(500).json({ message: "server error" })
    }
}
export default fetch_user_accounts
