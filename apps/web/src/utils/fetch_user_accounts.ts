import axiosPublic from '../lib/axios'
interface response{
    message:string
}
export interface accountDetail{
     details: {
        accountId:string
        bankName :string,
        accountNumber:string,
        ifsc:string,
        branch:string,
        isPrimary:boolean,
    },
}
export async function fetch_user_accounts():Promise<accountDetail[]>{
    const response=await axiosPublic.get(`/api/fetch_user_accounts`)
    return response.data as accountDetail[]
}
