"use client";
import React from "react";
import { Sheet } from "payit-ui";
import { motion, AnimatePresence } from "framer-motion"
import UserProfile from "./user-profile";
import Account from "../components/user-account";
import usesubSlideBar from "../lib/hooks/usesubSidebar";
import Balance from "../components/account-balance"
import useSlideBar from '../lib/hooks/useSlideBar'
export default function Subsidebar() {
  const {value}=usesubSlideBar()
   const { value :isSidebar,call_SlideBar_Dispatch}=useSlideBar()
  const renderContent = (value:string|null) => {
    switch (value) {
      case "Profile":
        return <UserProfile />
      case "Account":
        return <Account />
      case "Balance":
        return <Balance />  
      default:
        return null;
    }
  };
  
  return (
    <AnimatePresence>
      {value  && (
        <Sheet open={true} onOpenChange={()=>{}}>
          {/* BACKDROP ANIMATION */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="flex-1  h-screen   bg-black/10"
            />
          </div>

          {/* SLIDING SIDEBAR */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className={`${isSidebar ?"left-[300px]":"left-[80px]"} inseet-0 absolute z-30 h-screen min-w-95 border-r border-r-black/20 bg-white sm:w-105 shadow-xl`}
          >
            <div className="sticky top-24 h-fit">
            {value ? renderContent(value):<></>}

            </div>
          </motion.div>
        </Sheet>
      )}
    </AnimatePresence>
  );
}
