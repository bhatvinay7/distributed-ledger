import { PrismaClient,Prisma ,User,Account,Transaction,AccountDetail,BankAccountType,paymentStatus,paymentType} from '@prisma/client';
const globalForPrisma = global as unknown as {
  prisma:  PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export type {User,Account,Transaction,AccountDetail}
export { Prisma,BankAccountType,paymentStatus,paymentType }