import axiosPublic from '../lib/axios'
interface paymentStatus{
    transactionId:string,
    status:string,
    debit:number,
    receiverId:string
}
export async function transferMoneyToWallet():Promise<paymentStatus>{
    const response=await axiosPublic.post(`/api/transferToWallet`)
    return response.data
}