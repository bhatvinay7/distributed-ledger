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
            if(!userPaymentHistory){
                  return res.status(404).json({message:"trasaction history is not avalable"})
            }
            return res.status(200).json({paymentHistory:userPaymentHistory})
      }
      catch (error: unknown) {
       return res.status(500).json({message:"server error"})
      }
}
export default fetchUserPaymentHistory
