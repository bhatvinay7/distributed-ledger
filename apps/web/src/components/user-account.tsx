"use client";
import {
  SheetHeader,
  SheetTitle,
  Badge,
  Label,
  Separator,
  Card,
  CardContent,
  Button,
  Input,
} from "payit-ui";
import { fetch_user_accounts, accountDetail } from "../utils/fetch_user_accounts";
import { add_account } from "../utils/add_account"
import   {update_primary_acount} from "../utils/set_primary_account"
import { useEffect, useState } from "react";

export default function UserBankAccounts() {
  const [accounts, setAccounts] = useState<accountDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
    branch: ""
  });

  // Fetch accounts
  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const data = await fetch_user_accounts();
      setAccounts(data);
    } catch (err) {
      console.error(err);
    }
  }

  // Add account
  async function handleAddAccount() {
    try {
      setLoading(true);
      setError(null);
      const response = await add_account(form)

      setForm({ bankName: "", accountNumber: "", ifsc: "", branch: "" });

      fetchAccounts();
    } catch (err: any) {
      setError(err.message || "Failed to add account");
    } finally {
      setLoading(false);
    }
  }
  async function handleSetPrimaryAccount(accountId:string){
    try{
      setLoading(true);
      setError(null);
      const response = await update_primary_acount(accountId)
      fetchAccounts();
    }
    catch(error:any){
      setError(error.message || "Failed to set primary account");
    }
  }
  return (
    <div className="w-full max-h-[98%] sticky  top-0  text-black/75 p-6">
      <SheetHeader>
        <SheetTitle>Your Bank Accounts</SheetTitle>
      </SheetHeader>

      <p className="text-sm text-muted-foreground mt-3">
        Manage your linked bank accounts for adding money and withdrawals.
      </p>

      <Separator className="my-6" />

      {/* Add New Bank Account */}
      <h3 className="text-lg font-medium mb-3">Add New Account</h3>

      <div className="flex flex-col gap-4 max-w-md">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <Label>Bank Name</Label>
          <Input
            value={form.bankName}
            onChange={(e) =>
              setForm({ ...form, bankName: e.target.value })
            }
            placeholder="HDFC Bank"
          />
        </div>

        {/* <div> */}
          {/* <Label>Account Number</Label> */}
          {/* <Input */}
            {/* // value={form.accountNumber} */}
            {/* // onChange={(e) => */}
              {/* // setForm({ ...form, accountNumber: e.target.value }) */}
            {/* // } */}
            {/* // placeholder="XXXXXXXXXX" */}
          {/* // /> */}
        {/* </div> */}

        <div>
          <Label>IFSC Code</Label>
          <Input
            value={form.ifsc}
            onChange={(e) =>
              setForm({ ...form, ifsc: e.target.value.toUpperCase() })
            }
            placeholder="HDFC0000123"
          />
        </div>
        <div>
          <Label>Branch</Label>
          <Input
            value={form.branch}
            onChange={(e) =>
              setForm({ ...form, branch: e.target.value.toUpperCase() })
            }
            placeholder="Branch"
          />
        </div>

        <Button onClick={handleAddAccount} disabled={loading}>
          {loading ? "Adding..." : "Add Bank Account"}
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Linked Accounts */}
      <h3 className="text-lg font-medium mb-3">Linked Accounts</h3>

      <div className="flex flex-col gap-3">
        {accounts.map((acc) => (
          <Card key={acc.details.accountId}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{acc.details.bankName}</p>
                 <p className="font-medium">{acc.details.branch}</p>
                <p className="text-xs text-muted-foreground">
                  {acc.details.accountNumber.slice(0,-4)} <span className="font-bold text-base">xxxxxx</span>
                </p>
              </div>

              <div className="flex gap-2">
                {acc.details.isPrimary && (
                  <Badge className="bg-green-600 p-1 text-center text-gray-100">primary</Badge>
                )}

                {!acc.details.isPrimary && (
                  <Button onClick={()=>{handleSetPrimaryAccount(acc.details.accountId)}} size="sm">Set Primary</Button>
                )}

                <Button size="sm" variant="destructive">
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
