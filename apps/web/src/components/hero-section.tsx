'use client'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
} from "payit-ui";

import { Wallet, CreditCard, Database, Shield, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    
    <main className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 bg-inherit items-center">

      {/* Left section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* <Badge className="px-3 py-1">New · Ledger-backed</Badge> */}

        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600/80 leading-tight">
          Payments, Wallets, and Auditable Ledger — Made Simple
        </h1>

        <p className="text-slate-600 max-w-xl">
          PayIt is a secure payment platform with built-in wallet support and an immutable ledger for auditability.
        </p>

        <div className="flex items-center gap-3">
          <Button size="lg" className="text-white border hover:cursor-pointer border-black/10 bg-blue-400 p-2 rounded-sm">Create Account</Button>
          {/* <Button variant="ghost" size="lg">Explore Docs</Button> */}
        </div>

        <div className="mt-4 flex gap-6 items-center text-sm text-slate-600">
          {/* <span className="flex items-center gap-2"> */}
            {/* <Check className="h-4 w-4" /> PCI-ready */}
          {/* </span> */}
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" /> Secure Wallets
          </span>
          <span className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Immutable Ledger
          </span>
        </div>
      </motion.div>

      {/* Right mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="rounded-2xl shadow-xl p-6 bg-pink-50">

          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-500">Wallet balance</div>
              <div className="text-3xl font-semibold text-indigo-950">₹ 12,450.00</div>
            </div>

            <div className="flex gap-2">
              <Button size="sm">Top up</Button>
              <Button variant="ghost" size="sm">Withdraw</Button>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4">

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-950 gap-2">
                  <Wallet className="h-4 w-4 text-black/60 " /> Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 ">
                  Multiple currencies, instant transfers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-950 gap-2">
                  <CreditCard className="h-4 w-4 text-black/60" /> Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  Card, UPI and bank transfers
                </p>
              </CardContent>
            </Card>

          </div>

          {/* Input */}
          {/* <div className="mt-6 flex items-center gap-3"> */}
            {/* <Input placeholder="Email or phone" /> */}
            {/* <Button>Notify Me</Button> */}
          {/* </div> */}
        </div>
      </motion.div>
    </main>
  );
}
