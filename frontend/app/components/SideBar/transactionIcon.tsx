import Image from "next/image";
import transaction from "@/public/icons8-transaction-50.png"
import { useRecoilState, useSetRecoilState } from "recoil";
import { component, searchUser } from "@/store/atom";
import { useState } from "react";
import {AnimatePresence, motion} from "framer-motion"

export function TransactionIcon(){

    const [renderComponent,setRenderComponent] = useRecoilState(component)
    const setUser = useSetRecoilState(searchUser)
    const [isVisible,setIsVisible] = useState(false)

    const changeComponent = (change:number)=>{
        if (change===renderComponent) {
            return
        }
        setUser("")
        setRenderComponent(change)
    }

    return(
        <div onMouseEnter={()=>setIsVisible(true)} onMouseLeave={()=>setIsVisible(false)} onClick={()=>changeComponent(2)} className={`relative cursor-pointer w-11 rounded-full h-11 p-2 ${(renderComponent===2)&&'bg-white bg-opacity-25'} bg-opacity-25`}>
            <Image src={transaction} alt="transaction"/>
            <AnimatePresence mode="popLayout">
            {isVisible&&
            <motion.div
            initial={{scale:0, transformOrigin:"left"}}
            animate={{scale:1 , transition:{duration:0.2}}}
            exit={{scale:0}}
             className="absolute bg-white rounded-3xl w-fit left-[110%] top-0 p-2 font-semibold">transactions</motion.div>}
             </AnimatePresence>
        </div>   
    )
}