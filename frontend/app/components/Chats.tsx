"use client"
import {  useRecoilValue } from "recoil"
import { component, open } from "@/store/atom"
import { InputBox } from "./InputBox"
import { Transaction } from "./Transaction"
import { Message } from "./message"
import { NavBar } from "./NavBar"
import { Friend } from "./friends"
import { SideBar } from "./SideBar"
import { SearchUser } from "./SearchUser"
import {motion,AnimatePresence } from "framer-motion"
import { AllTransaction } from "./AllTransaction"


export function Chat(){
   
    const isOpen  = useRecoilValue(open)
    const renderComponent = useRecoilValue(component)


    return(
        <AnimatePresence mode="popLayout">
        <div className="dark flex h-full">
            <SideBar/>
            {(renderComponent===1)?<SearchUser/>:(renderComponent===0?<Friend/>:<AllTransaction/>)}
            <motion.div layout className={`grow-0 bg-slate-800 ${isOpen?"w-1/2":"w-3/4"} flex  flex-col` }>
            <NavBar/>
            <Message/>
            <InputBox/>
            </motion.div>
            {isOpen&& <Transaction/> }
        </div>
        </AnimatePresence>
    )
}