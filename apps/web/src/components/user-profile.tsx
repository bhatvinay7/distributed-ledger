"use client"
import { SheetContent, SheetHeader, SheetTitle, Label,Input,Button, Avatar, AvatarFallback, AvatarImage, Separator  } from "payit-ui";

export default function UserProfile() {
  return (
    <div className="w-full p-6 text-black/75">
      <SheetHeader>
        <SheetTitle >Your Profile</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col items-center gap-4 mt-6">
        <Avatar className="h-24 w-24">
          {/* <AvatarImage src="/avatar.png" /> */}
          <AvatarFallback>VN</AvatarFallback>
        </Avatar>

        <Button variant="outline" size="sm">
          Change Avatar
        </Button>
      </div>

      <Separator className="my-6" />
      <form className="flex flex-col gap-5">
        <div className="flex flex-col space-y-1">
          <Label>Name</Label>
          <Input placeholder="Your name" defaultValue="Vinay Bhat" />
        </div>

        <div className="flex flex-col space-y-1">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Email address"
            defaultValue="you@example.com"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Label>Phone</Label>
          <Input disabled={true} className="outline-0 border-0" type="tel" placeholder="+91-XXXXXXXXXX" />
        </div>

        <Button  className="hover:bg-blue-400/25">Save Changes</Button>
      </form>

      <Separator className="my-6" />
      <div className="flex flex-col justify-between items-center">
        <span className="text-sm self-start text-muted-foreground">Want to logout?</span>
        <Button variant="destructive" className=" bg-red-400/75 w-full ">Logout</Button>
      </div>
    </div>
  );
}
