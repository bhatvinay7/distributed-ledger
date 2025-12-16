import axiosPublic from '../lib/axios'
interface response{
    message:string
}
interface profile{
    username:string,
    picture:string,
    email?:string
}
export async function update_profile(profile:profile):Promise<response>{
    const response=await axiosPublic.patch(`/api/update_profile`,profile)
    return response.data
}
