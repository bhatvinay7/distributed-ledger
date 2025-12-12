"use client";
import React, { useState } from "react";
import {Input, SelectTrigger,SelectValue,SelectContent,SelectItem, Button,Label,Select} from "payit-ui"
type SendMoneyFormProps = {
  onSend: (receiverId: string, amount: number) => void;
  usersList?: { id: string; name: string }[];
};

export default function SendMoneyForm({ onSend, usersList }: SendMoneyFormProps) {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amt = parseFloat(amount);

    if (!receiverId) {
      alert("Please select a receiver");
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    onSend(receiverId, amt);
    setAmount("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg relative top-[2%] border border-black/15 h-[80%]  text-black shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Send Money</h2>

      {/* Receiver selection when list exists */}
      {usersList && (
        <div className="space-y-1">
          <Label>Select Receiver</Label>

          <Select onValueChange={setReceiverId}>
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
          <Label>Receiver ID</Label>
          <Input
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            placeholder="Enter receiver ID"
          />
        </div>
      )}

      {/* Amount input */}
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



