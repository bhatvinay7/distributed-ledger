"use client";
import { SheetContent, SheetHeader, SheetTitle,Button,Input, Label,Separator,Card, CardContent,Avatar,AvatarFallback, AvatarImage  } from "payit-ui"
export default function Wallet() {
  return (
    <div className=" w-full text-black/75 p-6">
      <SheetHeader>
        <SheetTitle>Your Wallet</SheetTitle>
      </SheetHeader>

      {/* Balance Section */}
      <div className="mt-6 text-center">
        <h2 className="text-3xl font-bold">₹ 12,500</h2>
        <p className="text-sm text-muted-foreground">Available Balance</p>
      </div>

      {/* <div className="flex justify-center gap-3 mt-4"> */}
        {/* <Button>Add Money</Button> */}
        {/* <Button variant="outline">Send Money</Button> */}
      {/* </div> */}

      {/* <Separator className="my-6" /> */}

      {/* Add Money Form */}
      {/* <div className="flex flex-col gap-4"> */}
        {/* <div> */}
          {/* <Label>Amount</Label> */}
          {/* <Input type="number" placeholder="Enter amount" className="mt-1" /> */}
        {/* </div> */}
        {/* <Button className="w-full">Add to Wallet</Button> */}
      {/* </div> */}

      {/* <Separator className="my-6" /> */}

      {/* Send Money Form */}
      {/* <div className="flex flex-col gap-4"> */}
        {/* <div> */}
          {/* <Label>Receiver Account ID</Label> */}
          {/* <Input placeholder="Enter account ID" className="mt-1" /> */}
        {/* </div> */}
        {/* <div> */}
          {/* <Label>Amount</Label> */}
          {/* <Input type="number" placeholder="Enter amount" className="mt-1" /> */}
        {/* </div> */}
        {/* <Button className="w-full">Send Money</Button> */}
      {/* </div> */}

      {/* <Separator className="my-6" /> */}


    </div>
  );
}

