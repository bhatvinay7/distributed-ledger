"use client";
import React, { useState } from "react";
import {Input, SelectTrigger,SelectValue,SelectContent,SelectItem, Button,Label,Select} from "payit-ui"
import { v4 as uuid } from 'uuid';
type SendMoneyFormProps = {
  onSend: (receiverAccountId: string, amount: string,idempotencyKey:string) => void;
  usersList?: { id: string; name: string }[];
};

export default function SendMoneyForm({ onSend, usersList }: SendMoneyFormProps) {
  const [receiverAccountId, setReceiverAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [idempotencyKey,setidEmpotencyKey]=useState(uuid())
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amt = parseFloat(amount);

    if (!receiverAccountId) {
      alert("Please select a receiver");
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    onSend(receiverAccountId, ""+amt,idempotencyKey);
    setAmount("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-purple-50 rounded-lg relative top-[2%] border border-black/15 h-[80%]  text-indigo-900 shadow-md w-full max-w-xl space-y-4"
    >
      <h2 className="text-xl font-semibold">Send Money</h2>

      {/* Receiver selection when list exists */}
      {usersList && (
        <div className="space-y-1">
          <Label>Receiver AccountId</Label>

          <Select onValueChange={setReceiverAccountId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a user" />
            </SelectTrigger>
            <SelectContent>
              {usersList.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* If no list, fallback to receiver text input */}
      {!usersList && (
        <div className="space-y-1">
          <Label>Receiver Account ID</Label>
          <Input
            value={receiverAccountId}
            onChange={(e) =>{ setReceiverAccountId(e.target.value)}}
            placeholder="Enter receiver ID"
          />
        </div>
      )}

      {/* Amount input */}
       <div className="space-y-1">
   <Label>Receiver AccountId</Label>
   <Input
     type="text"
     value={receiverAccountId}
     onChange={(e) => setReceiverAccountId(e.target.value)}
     placeholder="Manualy Enter receiver ID"
   />
 </div>
      <div className="space-y-1">
        <Label>Amount (₹)</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      <Button type="submit" className="w-full">
        Send
      </Button>
    </form>
  );
}



