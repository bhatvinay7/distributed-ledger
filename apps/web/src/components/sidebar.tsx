"use client"
import React from "react"
import Link from "next/link"
import SidebarToggleComponent from "./sidebarToggleComponent"
import usesubSlideBar from "../lib/hooks/usesubSidebar"
import useSlideBar from '../lib/hooks/useSlideBar'
import {
  Coins,
  History,
  UserRound,
  Wallet,
  Building2,
  Settings,
  LogOut,
  HandCoins,
  PanelRight
} from "lucide-react"

import { Button } from "payit-ui"

export default function Sidebar() {
  const { value, call_subSlideBar_Dispatch } = usesubSlideBar()
  const { value :isSidebar,call_SlideBar_Dispatch}=useSlideBar()
  // Navigation links
  const links = [
    {
      label: "Pay",
      href: "/main/pay",
      icon: <Coins size={18} className="mr-2" />,
    },
    {
      label: "Transactions",
      href: "/transactions",
      icon: <History size={18} className="mr-2" />,
    },
     {
   label: "Wallet",
   href: "/main/wallet",
   icon: <Wallet size={18} className="mr-2" />,
 },
  ]

  const menuItems = [
    {
      label: "Profile",
      href: "/profile",
      icon: <UserRound size={18} className="mr-2" />,
    },
    {
      label: "Account",
      href: "/account",
      icon: <Building2 size={18} className="mr-2" />,
    },
     {
   label: "Balance",
   href: "/balance",
   icon: <HandCoins size={18} className="mr-2" />,
 },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings size={18} className="mr-2" />,
    },
  ]

  const dangerItems = [
    {
      label: "Logout",
      href: "/logout",
      icon: <LogOut size={18} className="mr-2" />,
      isDanger: true,
    },
  ]

  return (
    <div className={`${isSidebar ?" w-full sm:min-w-[300px] border border-r-black/15":"w-fit"}   h-fit sticky top-23  bg-white `}>
      <div onClick={()=> call_SlideBar_Dispatch(!isSidebar)} className={`${ isSidebar ? "left-[90%]" :" left-[30%] "} relative  `}>
      <SidebarToggleComponent/>
      </div>

      <div className="w-full h-fit sticky top-24 bg-white p-0">
      {isSidebar ? 
        <nav className="p-4 space-y-3">
          
          {/* Regular links */}
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => call_subSlideBar_Dispatch(item.label)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 transition"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {/* Button-type menu items */}
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => call_subSlideBar_Dispatch(item.label)}
              className="flex hover:cursor-pointer items-center w-full justify-start px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 transition"
            >
              {item.icon}
              {item.label}
            </Button>
          ))}

          {/* Danger section */}
          <div className="pt-6">
            {dangerItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center hover:cursor-pointer px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

        </nav> :
        <nav className={`p-4 space-y-3 `}>
  {links.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => call_subSlideBar_Dispatch(item.label)}
      className="flex items-center hover:cursor-pointer gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 transition"
    >
      <span className="icon">{item.icon}</span>
    </Link>
  ))}

  {/* Button-type menu items */}
  {menuItems.map((item) => (
    <Button
      key={item.label}
      variant="ghost"
      onClick={() => call_subSlideBar_Dispatch(item.label)}
      className="flex items-center hover:cursor-pointer gap-3 w-full justify-start px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition"
    >
      <span className="icon">{item.icon}</span>
    </Button>
  ))}

  {/* Danger section */}
  <div className="pt-6">
    {dangerItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="flex items-center hover:cursor-pointer gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
      >
        <span className="icon">{item.icon}</span>
      </Link>
    ))}
  </div>
</nav> }
      </div>
    </div>
  )
}
