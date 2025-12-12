"use client"

import { Card, CardContent } from "payit-ui"
import { Button } from "payit-ui"
import { Wallet, Eye, EyeOff, TrendingDown } from "lucide-react"
import { useState } from "react"

export default function AccountBalance() {
  const [hidden, setHidden] = useState(false)

  return (
    <Card className="w-full max-w-md mx-auto mt-6 shadow-none  border-0 p-0 rounded-2xl">
      <CardContent className="p-6 shadow-none">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="text-blue-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-800">
              Account Balance
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setHidden(!hidden)}
            className="hover:bg-gray-100 text-black/75 rounded-full"
          >
            {hidden ? <EyeOff size={20}  /> : <Eye size={20} />}
          </Button>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-3xl font-bold text-gray-900 mt-1 tracking-wide">
            {hidden ? "••••••" : "₹ 52,840.20"}
          </p>
        </div>

        {/* Total Spent */}
        <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between border">
          <div className="flex items-center gap-3">
            <TrendingDown className="text-red-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-xl font-semibold text-gray-900">
                {hidden ? "•••••" : "₹ 12,430.00"}
              </p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
