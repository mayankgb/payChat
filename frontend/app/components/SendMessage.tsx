import { KeyboardEvent, useState } from "react"
import { useRecoilValue } from "recoil"
import { backend, index, wss } from "@/store/atom";
import Image from "next/image";
import sendSvg from "@/public/send.svg"
import toast from "react-hot-toast";

export function SendMessage(){

    const [message,setMessage] = useState("")
    const user = useRecoilValue(wss)
    const rooms  = useRecoilValue(backend)
    const selectedIndex = useRecoilValue(index)

    async function createOut(op:number){
        setTimeout(()=>{
            console.log(`${op} ${rooms[op].friend}`)
        },5000)
    }

    const sendMessage = (sendIndex:number)=>{
        if (message.trim().length<=0) {
            toast.error("enter a valid message")
            return
        }
        user?.send(JSON.stringify({
            request:"sendMessage",
            token:JSON.parse(localStorage.getItem("token")||""),
            to:rooms[sendIndex].friend,
            value:message
        }))
        setMessage("")

        // // const sendIndex = selectedIndex
        // await createOut(sendIndex)
    }

    const handleKeyDown = (e:KeyboardEvent<HTMLInputElement>,indices:number)=>{
        if (e.key==="Enter") {
            sendMessage(indices)
            console.log("mayank")
        }

    }

    return(
        <div className="flex w-full">
            <div className="w-full">
            <input onKeyDown={(e)=>handleKeyDown(e,selectedIndex)} placeholder="Type a message"  type="text" value={message} onChange={(e)=>setMessage(e.target.value)} className="p-2 w-full bg-slate-600 text-white rounded-xl" />
            </div>
            <button className="ml-4" onClick={()=>sendMessage(selectedIndex)}><Image src={sendSvg} alt="icon"/></button>
        </div>
    )
}