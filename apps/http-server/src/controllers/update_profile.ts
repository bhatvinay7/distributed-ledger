import { prisma} from "prisma"
import { Response} from "express"
import { AuthRequest } from "types"
import { z} from "zod";

export const UpdateUserPartialSchema = z.object({
    username: z.string().min(3).max(30),
    picture: z.string().url(),
});
const update_user_profile = async (req: AuthRequest, res: Response) => {
    try {
        const parsed = UpdateUserPartialSchema.safeParse(req.body);
        const user = req.user
        if (!parsed.success) {
            return res.status(400).json({
                errors:parsed.error,
            });
        }

        if (Object.keys(parsed.data).length === 0) {
            return res.status(400).json({
                message: "Nothing to update",
            });
        }

        const updateData = Object.fromEntries(
            Object.entries(parsed.data).filter(([_, v]) => v !== undefined)
        );

        const updatedUser = await prisma.user.update({
            where: { id: user.userId },
            data: updateData,
        });

    }
    catch (error: any) {
        return res.status(500).json({ message: "server error" })
    }
}

export default update_user_profile