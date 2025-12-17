"use client"
import React from 'react'
import Pay from "../../../components/send-money-form"
import {pay} from "../../../utils/pay"
type SendMoneyFormProps = {
  onSend: (receiverId: string, amount: number) => void;
  usersList?: { id: string; name: string }[];
}
export default function Page() {
  async function transaction(receiverAccountId: string, amount: string,idempotencyKey:string){
        try{
        const response=await pay(receiverAccountId, amount,idempotencyKey)
        }
        catch(error:any){
          console.log(error)
        }
  }
  return (
    <div className='flex justify-center  w-full bg-white  h-screen'>
      <Pay
      onSend={transaction}
      usersList= {[{id:"0",name:""}]}
      />
    </div>
  )
}
