import { prisma } from "prisma"
import { Response } from "express"
import { AuthRequest } from "types"
const fetch_user_account_detail = async (req: AuthRequest, res: Response) => {
      try {
            const user = req.user
            const userPrimary_account=await prisma.user.findFirst({where:{id:user.userId},
            select:{
                primaryAccountId:true
            }
            })
            if(!userPrimary_account){
                return res.status(404).json({message:"user not have any account"})
            }
            const user_account_detail = await prisma.account.findFirst({
                  where: { id: userPrimary_account.primaryAccountId! },
            })
            if(!user_account_detail){
                  return res.status(404).json({message:"user not have any account"})
            }
            return res.status(200).json({user_account_detail})
      }
      catch (error: unknown) {
       return res.status(500).json({message:"server error"})
      }
}
export default fetch_user_account_detail
