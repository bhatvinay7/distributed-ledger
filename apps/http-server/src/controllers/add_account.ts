import { prisma, BankAccountType } from "prisma"
import { Response, Request } from "express"
import { AuthRequest } from "types"
import { v4 as uuid } from "uuid"
import { z } from "zod";
export const BankAccountSchema = z.object({
    bankName: z
        .string()
        .min(2, "Bank name must be at least 2 characters")
        .max(50, "Bank name is too long"),

    branch: z
        .string()
        .min(2, "Branch name must be at least 2 characters")
        .max(50, "Branch name is too long"),

    ifsc: z
        .string()
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),

    accountNumber: z
        .string()
        .regex(/^[0-9]{9,18}$/, "Account number must be 9–18 digits"),

    address: z
        .string()
        .min(5, "Address is too short")
        .max(150, "Address is too long").optional(),

    pin: z
        .string()
        .regex(/^[1-9][0-9]{5}$/, "Invalid PIN code").optional(),
});

const add_account = async (req: AuthRequest, res: Response) => {
    try {
        const parsed = BankAccountSchema.safeParse(req.body);
        const user = req.user
        if (!parsed.success) {
            const errorMessages = parsed.error
            return res.status(400).json({
                errors: errorMessages,
            });
        }
        const account = await prisma.account.create({
            data: {
                userId: user.userId,
                accountType: BankAccountType.SAVINGS,
                balance: 100,
                version: 0,
                details: {
                    create: {
                        bankName: parsed.data.bankName,
                        branch: parsed.data.branch,
                        ifsc: parsed.data.ifsc,
                        accountNumber: `${user.userId}-${uuid()}`,
                        address: parsed.data.address ?? "" ,
                        pin: parsed.data.pin ?? "",
                    },
                },
            },
            include: {
                details: true,
            },
        });

    }
    catch (error: any) {
        return res.status(500).json({ message: "server error" })
    }
}

export default add_account