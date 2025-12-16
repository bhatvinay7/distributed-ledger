import axiosPublic from '../lib/axios'
interface paymentStatus{
    transactionId:string,
    status:string,
    debit:number,
    receiverId:string
}
export async function fetchTransactionHistory():Promise<paymentStatus[]>{
    const response=await axiosPublic.get(`/api/fetch_transaction_history`)
    return response.data
}