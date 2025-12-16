import axiosPublic from '../lib/axios'
interface paymentStatus{
    transactionId:string,
    status:string,
    debit:number,
    receiverId:string
}
export async function pay(receiverAccountId:string,amount:string,idempotencyKey:string):Promise<paymentStatus>{
    const response=await axiosPublic.post(`/api/pay`,{receiverAccountId,amount,idempotencyKey})
    return response.data
}