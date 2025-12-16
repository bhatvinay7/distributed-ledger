import axiosPublic from '../lib/axios'
interface response{
    message:string
}
interface accountDetail{
bankName :string,
branch:string,   
ifsc:string,     
accountNumber:string,
address?:string,  
pin?:string      
}
export async function add_account(accountDetail:accountDetail):Promise<response>{
    const response=await axiosPublic.post(`/api/add_account`,accountDetail)
    return response.data
}
