"use client"
import Sidebar  from "../components/sidebar";
import Subsidebar from "../components/subsidebar";
import useSlideBar from '../lib/hooks/useSlideBar'
export default function SidebarController(){
    const { value :isSidebar,call_SlideBar_Dispatch}=useSlideBar()
   return(
 <div className={`w-full  h-screen relative grid grid-cols-1 ${isSidebar ? "sm:w-[260px] md:w-[300px]":"w-[40px]"}`}>
 <div className="flex w-auto h-screen relative border-r border-black/15 ">
 < Sidebar/>    
 <Subsidebar/>
 </div>  
 </div>
    )
}

