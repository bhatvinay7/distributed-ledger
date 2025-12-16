// AccountDetail.tsx
import React from "react";

type AccountDetailProps = {
  username: string;
  bankName: string;
  totalAmount: number; // or string if you show currency formatted string
  
};

export function AccountDetail({ username, bankName, totalAmount }: AccountDetailProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-2">Account Details</h2>
      <div className="space-y-1">
        <p>
          <span className="font-medium">User:</span> {username}
        </p>
        <p>
          <span className="font-medium">Bank:</span> {bankName}
        </p>
        <p className="mt-2 text-xl font-bold">
          Total Balance: ₹ {totalAmount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
