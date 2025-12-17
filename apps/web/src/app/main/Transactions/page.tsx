"use client";

import {
  Card,
  CardContent,
  Badge,
  Separator,
  Button,
} from "payit-ui";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export type Transaction = {
  id: string;
  type: "DEBIT" | "CREDIT";
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: string;
};

interface Props {
  transactions: Transaction[];
}

export default function UserTransactions() {
    const [ transactions,setTransaction]=useState<Transaction[]>([{
    id: "TXN_9F2A3K81",
    type: "CREDIT",
    amount: 2500,
    status: "SUCCESS",
    createdAt: "2025-03-14T10:30:00Z",
  },
  {
    id: "TXN_7D4P8L21",
    type: "DEBIT",
    amount: 1200,
    status: "SUCCESS",
    createdAt: "2025-03-13T18:45:00Z",
  },
  {
    id: "TXN_5Q9M2X77",
    type: "DEBIT",
    amount: 499,
    status: "PENDING",
    createdAt: "2025-03-13T14:10:00Z",
  },
  {
    id: "TXN_1Z8A6R44",
    type: "CREDIT",
    amount: 10000,
    status: "SUCCESS",
    createdAt: "2025-03-12T09:05:00Z",
  },
  {
    id: "TXN_4B7C9N10",
    type: "DEBIT",
    amount: 799,
    status: "FAILED",
    createdAt: "2025-03-11T20:55:00Z",
  },])
  return (
    <div className="w-full space-y-4 p-8 text-black border border-black/15 rounded-2xl">
      <h3 className="text-lg font-semibold">Recent Transactions</h3>

      <Separator />

      <div className="flex flex-col gap-3">
        {transactions.map((tx) => {
          const isDebit = tx.type === "DEBIT";

          return (
            <Card
              key={tx.id}
              className="rounded-2xl border border-black/15 shadow-sm  hover:shadow-md transition"
            >
              <CardContent className="p-1 flex items-center justify-between">
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isDebit
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {isDebit ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {isDebit ? "Debited" : "Credited"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Transaction ID: {tx.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-1">
                  <p
                    className={`font-semibold ${
                      isDebit ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {isDebit ? "-" : "+"}₹{tx.amount}
                  </p>

                  <Badge
                    className={`text-xs px-2 py-0.5 ${
                      tx.status === "SUCCESS"
                        ? "bg-green-600 text-white"
                        : tx.status === "PENDING"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {tx.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {transactions.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-8">
            No transactions found
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" size="sm">
          View All Transactions
        </Button>
      </div>
    </div>
  );
}
