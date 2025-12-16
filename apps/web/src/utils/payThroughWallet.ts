import axiosPublic from '../lib/axios'
interface paymentStatus{
    transactionId:string,
    status:string,
    debit:number,
    receiverId:string
}
export async function payThroughWallet():Promise<paymentStatus>{
    const response=await axiosPublic.post(`/api/pay_through_wallet`)
    return response.data
}