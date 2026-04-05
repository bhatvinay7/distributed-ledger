import axiosPublic from '../lib/axios'
interface response{
    message:string
}
export async function update_primary_account(accountId:string):Promise<response>{
    const response=await axiosPublic.patch(`/api/update_primary_account`,{accountId})
    return response.data
}
