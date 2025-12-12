"use client";
import { SheetContent, SheetHeader, SheetTitle,Badge, Label,Separator,Card, CardContent,Button, Input  } from "payit-ui"
export default function UserBankAccounts() {
  const accounts = [
    {
      id: 1,
      bank: "HDFC Bank",
      accountNumber: "**** 3245",
      primary: true,
    },
    {
      id: 2,
      bank: "SBI Bank",
      accountNumber: "**** 9981",
      primary: false,
    },
  ];

  return (

    <div className="w-full text-black/75 p-6">
      <SheetHeader>
        <SheetTitle>Your Bank Accounts</SheetTitle>
      </SheetHeader>

      <p className="text-sm text-muted-foreground mt-3">
        Manage your linked bank accounts for adding money and withdrawals.
      </p>

      <Separator className="my-6" />

      {/* Add New Bank Account */}
      <h3 className="text-lg font-medium mb-3">Add New Account</h3>

      <div className="flex flex-col gap-4">
        <div>
          <Label>Bank Name</Label>
          <Input placeholder="Example: HDFC Bank" className="mt-1" />
        </div>

        <div>
          <Label>Account Number</Label>
          <Input type="number" placeholder="Enter account number" className="mt-1" />
        </div>

        <div>
          <Label>IFSC Code</Label>
          <Input placeholder="Example: HDFC0000123" className="mt-1" />
        </div>

        <Button className="w-full border border-black/15 ">Add Bank Account</Button>
      </div>

      <Separator className="my-6" />

      {/* Linked Bank Accounts */}
      <h3 className="text-lg font-medium mb-3">Linked Accounts</h3>

      <div className="flex flex-col gap-3">
        {accounts.map((acc) => (
          <Card key={acc.id} className="border p-0">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{acc.bank}</p>
                <p className="text-xs text-muted-foreground">
                  {acc.accountNumber}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {acc.primary && (
                  <Badge className="bg-green-600 text-gray-200 p-0.5">Primary</Badge>
                )}

                {!acc.primary && (
                  <Button variant="default" size="sm">
                    Set Primary
                  </Button>
                )}

                <Button variant="default" className="border border-black/15 " size="sm">
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
        </div>
  );
}
