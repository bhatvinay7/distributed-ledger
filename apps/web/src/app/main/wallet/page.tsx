"use client"
import { Tabs, TabsList, TabsTrigger, TabsContent,Avatar, AvatarImage, AvatarFallback ,ScrollArea, Button,Card, CardHeader, CardTitle, CardContent, Progress} from "payit-ui";
import { Wallet, ArrowDownCircle, ArrowUpCircle, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Walletui() {
  return (
    <div className=" w-full h-screen border border-black/15 rounded-2xl text-black/75  p-6 bg-white space-y-6">
      {/* Header */}
      <div className="flex mx-auto w-full items-center space-x-1.5 justify-start">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Wallet className="h-7 w-7 text-indigo-600" /> Wallet
        </h1>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-xl"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Current Balance</p>
            <p className="text-4xl font-semibold mt-1">₹ 12,450.00</p>
          </div>
          {/* <Avatar className="h-14 w-14 border border-white/30 shadow-md"> */}
            {/* <AvatarImage src="" /> */}
            {/* <AvatarFallback>U</AvatarFallback> */}
          {/* </Avatar> */}
        </div>

        <div className="mt-6">
          <p className="text-sm mb-1 opacity-80">Monthly Spend</p>
          {/* <Progress value={65} className="h-2 bg-white/30" /> */}
          <div className="text-xs mt-1 opacity-80">65% of your monthly limit used</div>
        </div>
      </motion.div>
       <Button className="flex items-center p-1 gap-2">
       <PlusCircle className="h-4 w-4" /> Add money to wallet
       </Button>
      {/* Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger className="border border-black/15" value="transactions">Transactions</TabsTrigger>
          <TabsTrigger className="border border-black/15" value="received">Received</TabsTrigger>
          <TabsTrigger className="border border-black/15" value="sent">Sent</TabsTrigger>
        </TabsList>

        {/* Transactions */}
        <TabsContent value="transactions" className="rounded-md">
          <Card className="rounded-md border border-black/10">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent >
              <ScrollArea className="h-64  overflow-y-auto custom-scrollbar  pr-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b last:border-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-slate-100">
                        <ArrowUpCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium">Payment to Merchant</p>
                        <p className="text-xs text-slate-500">Today • 4:20 PM</p>
                      </div>
                    </div>
                    <p className="text-red-500  font-medium">- ₹350</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Received */}
        <TabsContent value="received">
          <Card className="border border-black/10">
            <CardHeader>
              <CardTitle>Received Money</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 overflow-y-auto custom-scrollbar  pr-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b last:border-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <ArrowDownCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Received from User</p>
                        <p className="text-xs text-slate-500">Yesterday</p>
                      </div>
                    </div>
                    <p className="text-green-600 font-medium">+ ₹950</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sent */}
        <TabsContent value="sent">
          <Card className="border border-black/15">
            <CardHeader>
              <CardTitle>Sent Money</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 overflow-y-auto custom-scrollbar pr-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b last:border-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-red-100">
                        <ArrowUpCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Sent to Friend</p>
                        <p className="text-xs text-slate-500">2 days ago</p>
                      </div>
                    </div>
                    <p className="text-red-500 font-medium">- ₹1200</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
