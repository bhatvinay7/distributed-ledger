import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input } from "payit-ui";
import React from 'react'
export default function Navbar(){
  return (
    <header className=" w-full sticky top-0 z-40 p-2 sm:px-4 mx-auto py-6 border-b border-b-black/15 bg-white flex items-center justify-start">
      <div className="w-[95%] flex items-center justify-between">

      <div className="flex justify-between items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br
         from-indigo-500 to-pink-500 flex items-center justify-center shadow-md text-white 
         font-semibold">
          PI
        </div>
        <div>
          <div className="text-lg font-semibold text-indigo-900">PayIt</div>
          <div className="text-xs text-slate-500">Payments • Wallets • Ledger</div>
        </div>
      </div>


      <nav className="hidden md:flex items-center gap-4">
        <a className="text-sm hover:underline text-black/75" href="#features">Features</a>
        <a className="text-sm hover:underline text-black/75 " href="#pricing">Pricing</a>
        <a className="text-sm hover:underline text-black/75" href="#docs">Docs</a>
      </nav>
      <div className="md:hidden">
        <Button size="sm">Get Started</Button>
      </div>
    </div>
    </header>
  )
}
