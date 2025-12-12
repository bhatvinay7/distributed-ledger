import { prisma } from "prisma"
import { Response } from "express"
import { AuthRequest } from "types"
const fetchUserPaymentHistory = async (req: AuthRequest, res: Response) => {
      try {
            const user = req.user
            const userPaymentHistory = await prisma.transaction.findMany({
                  where: { id: user.userId },
                  orderBy: {
                        createdAt: 'desc',
                  },
            })
            return res.status(200).json({paymentHistory:userPaymentHistory})
      }
      catch (error: any) {
       return res.status(500).json({message:"server error"})
      }
}

export default fetchUserPaymentHistory
