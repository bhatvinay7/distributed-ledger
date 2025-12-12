"use client"
import React from 'react'
import Pay from "../../../components/send-money-form"
type SendMoneyFormProps = {
  onSend: (receiverId: string, amount: number) => void;
  usersList?: { id: string; name: string }[];
}
export default function Page() {
  async function pay(receiverId: string, amount: number){

  }
  return (
    <div className='flex justify-center  w-full bg-white  h-screen'>
      <Pay
      onSend={pay}
      usersList= {[{id:"0",name:""}]}
      />
    </div>
  )
}
