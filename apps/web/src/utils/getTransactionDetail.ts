import axiosPublic from '../lib/axios'
interface paymentStatus{
    transactionId:string,
    status:string,
    debit:number,
    receiverId:string
}
export async function fetchTransactionDetail():Promise<paymentStatus[]>{
    const response=await axiosPublic.get(`/api/transaction_detail`)
    return response.data
}
