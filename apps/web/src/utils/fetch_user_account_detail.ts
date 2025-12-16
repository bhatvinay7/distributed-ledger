import axiosPublic from '../lib/axios'
export interface accountDetail{
    user_account_detail:{
        accountId:string,
        balance:number,
        spent?:number,
    }

}
export async function fetch_account_detail():Promise<accountDetail>{
    const response=await axiosPublic.get(`/api/fetch_user_account_detail`)
    return response.data as accountDetail
}
