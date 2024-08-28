import Image from "next/image"
import { rooms } from "../lib/types"
import {AnimatePresence, motion} from "framer-motion" 



export function Card({data}:{data:rooms}){

    const message = "message are end-to-end encrypted no one even whatsapp can't read"

    return(
        <div className="px-4 h-16 border-b-[1px] border-slate-500 ">
            <div className=" flex  h-full items-center w-full  ">
                <div className="relative h-10 w-10 rounded-full ">
                    <Image  width={40} height={40} src={`https://avatar.iran.liara.run/public/${data.friend.length}`} alt="icon"/>  
                    <AnimatePresence mode="popLayout">
                    {data.status&&
                        <motion.div
                           initial={{scale:0}}
                           animate={{scale:1}}
                           exit={{scale:0}}
                           className="absolute h-3 rounded-full w-3 bg-green-500 border border-black bottom-0 right-0">
                        </motion.div>
                    }
                    </AnimatePresence>
                </div>
                <div className=" flex flex-col ml-4  items-start ">
                    <div className="text-white ">
                        {data.friend}
                    </div>
                    <div className="text-slate-400 ">
                        {(data.lastMessage?.value)?`${data.lastMessage?.value.slice(0,20)}`:`${message.slice(0,25)}....`}
                    </div>
                </div>
            </div>
            
        </div>
    )
}