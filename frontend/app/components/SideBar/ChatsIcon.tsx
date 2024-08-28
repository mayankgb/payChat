import { component, searchUser } from "@/store/atom"
import { useRecoilState, useSetRecoilState } from "recoil"
import Image from "next/image"
import chat from "@/public/chat-svg.svg"
import { useState } from "react"
import {AnimatePresence, motion} from "framer-motion"

export function ChatIcon(){

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
        <div onMouseEnter={()=>setIsVisible(true)} onMouseLeave={()=>setIsVisible(false)} onClick={()=>changeComponent(0)} className={`relative mb-10  w-11 rounded-full h-11 p-2 cursor-pointer ${(!renderComponent)&&'bg-white bg-opacity-25'}`}>
                <Image className="fill-blue-400" src={chat} alt="chat"/>
                <AnimatePresence mode="popLayout">
                {isVisible&&
                <motion.div 
                initial={{scale:0, transformOrigin:"left"}}
                animate={{scale:1 , transition:{duration:0.1}}}
                exit={{scale:0}}
                className="mr-2 absolute bg-white rounded-2xl  left-[110%] top-0 py-1  w-20 text-center font-semibold">chats</motion.div>}
                </AnimatePresence>
         </div>
    )
}