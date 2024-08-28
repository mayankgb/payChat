import { component, searchUser } from "@/store/atom";
import Image from "next/image";
import { useRecoilState, useSetRecoilState } from "recoil";
import search from "@/public/new-search.svg"
import { useState } from "react";
import {AnimatePresence, motion} from "framer-motion"

export function SearchIcon(){

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
        <div onMouseEnter={()=>setIsVisible(true)} onMouseLeave={()=>setIsVisible(false)} onClick={()=>changeComponent(1)} className={`relative mb-10 cursor-pointer w-10 rounded-full h-10 flex items-center justify-center  ${(renderComponent==1)&&'bg-white bg-opacity-25'}`}>
            <Image className="font-bold"  src={search} alt="search" />
            <AnimatePresence mode="popLayout">
            {isVisible&&
            <motion.div
             initial={{scale:0, transformOrigin:"left"}}
             animate={{scale:1 , transition:{duration:0.2}}}
             exit={{scale:0}}
             className="absolute bg-white rounded-2xl  left-full w-20 text-center top-0 p-1 font-semibold">search</motion.div>}
             </AnimatePresence>
        </div>
    )
}