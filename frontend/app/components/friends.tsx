import { backend, index } from "@/store/atom"
import { useRecoilState, useRecoilValue } from "recoil"
import { Card } from "./Card"
import { motion } from "framer-motion"

export function Friend(){

    const room = useRecoilValue(backend)
    const [selectedIndex,setSelectedIndex] = useRecoilState(index)
    // console.log(room)

    return(
        <motion.div
         className=" bg-customDark w-3/12	overflow-auto">
            <div className="font-bold text-3xl text-white py-3  px-4">
                Chats
            </div>
            {room.length?(room?.map((user,index)=>
            <motion.div
                key={index}
                initial={{y:100}}
                animate={{y:0}}
                exit={{y:-10}}
                whileInView={"onscreen"}
                viewport={{once:true}}
                className={`cursor-pointer z-[-10] ${(selectedIndex===index)?"bg-white bg-opacity-25":""}`} 
                onClick={()=>setSelectedIndex(index)}>
                <Card key={index} data={user} />

            </motion.div>
        )):
        <div className="text-slate-400 text-center">
            Try to search my userName in Search bar &quot;mayank&quot;
        </div>
        }
        </motion.div>
    )
}