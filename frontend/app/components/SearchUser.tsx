import { Input } from "@/components/ui/input"
import { backend, component, index, searchUser, wss } from "@/store/atom"
import { ChangeEvent, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {motion} from "framer-motion"
import Image from "next/image"

export function SearchUser(){

    const userSocket = useRecoilValue(wss)
    const room =  useRecoilValue(backend)
    const [op,setOp] = useState<number[]>([])
    const user = useRecoilValue(searchUser)
    const renderComponent = useSetRecoilState(component)
    const [selectedIndex,setSelectedIndex] = useRecoilState(index)


     function search(userName:string){
        const existingUser  = room.map((user,index)=>user.friend.startsWith(userName)?index:-1).filter((index)=>index!==-1)
        console.log("searching function")
        console.log(existingUser)
        
        setOp(existingUser)

        if (!existingUser.length) {
            userSocket?.send(JSON.stringify({
                request:"searchUser",
                searchUserName:userName,
                token:JSON.parse(localStorage.getItem("token")||"")
            }))   
        }

    }

    function debounce(func: (id:string)=>void) {
        let timer: NodeJS.Timeout | null = null;
    
        return function(id:string) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => func(id), 300);
        };
    }

    const getUser = debounce(search)

    const handleChange= (e:ChangeEvent<HTMLInputElement>)=>{
         getUser(e.target.value)
    }

    const createRoom = ()=>{
        userSocket?.send(JSON.stringify({
            request:"createRoom",
            token:JSON.parse(localStorage.getItem("token")||""),
            to:user
        }))

        renderComponent(0)
    }

    const existingRoom=(indices:number)=>{
        if (selectedIndex!==indices) {
            setSelectedIndex(indices)   
        }
        renderComponent(0)
    }


    return (
        <motion.div
         initial={{x:"-100%"}}
         animate={{x:0 ,transition:{duration:0.5}}}
         exit={{x:"100%"}}
         transition={{type:"just",stiffness:300}}
         className="bg-customDark w-3/12 px-2 overflow-auto">
            <div className="font-bold text-3xl text-white py-3  px-2">
                New Chat
            </div>

            <div>
               <Input className="bg-slate-400 text-gray-800 font-bold placeholder:text-gray-700" type="text" placeholder="search by username" onChange={(e)=>handleChange(e)} />
            </div>
            <div>
               {op.length?op.map((value,index)=>
                    <motion.div
                     initial={{y:20}}
                     animate={{y:0}}
                     exit={{y:-10}}
                     onClick={()=>existingRoom(value)}
                     className="text-slate-700 text-lg font-bold cursor-pointer bg-slate-400 mt-4 p-3 rounded flex items-center"
                     key={index}>
                     <Image width={40} height={40} src={`https://avatar.iran.liara.run/public/${room[value].friend.length}`} alt="icon"/>
                     <div className="ml-3">
                         {room[value].friend}
                     </div>
                    </motion.div>
                    ):

                (user?(

               <motion.div
                 initial={{y:20}}
                 animate={{y:0}}
                 exit={{y:-10}}
                 onClick={createRoom}
                 className="text-slate-700 text-lg font-bold cursor-pointer bg-slate-400 mt-4 p-3 rounded flex items-center">
                    <Image width={40} height={40} src={`https://avatar.iran.liara.run/public/${user.length}`} alt="icon"/>
                    <div className="ml-3">
                        {user}
                    </div>
                </motion.div>

                ):(

               <div  className="text-center p-2 text-slate-400">search by full username if the user is not in your chat</div>
               ))}

            </div>
            
        </motion.div>
    )

}