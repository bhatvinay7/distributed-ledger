import axiosPublic from '../lib/axios'
interface response{
    message:string
}
export async function update_primary_acount(accountId:string):Promise<response>{
    const response=await axiosPublic.patch(`/api/update_primary_acount`,{accountId})
    return response.data
}
