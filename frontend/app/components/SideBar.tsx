import Image from "next/image"
import chat from "@/public/chat-svg.svg"
import search from "@/public/new-search.svg"
import { useRecoilState, useSetRecoilState } from "recoil"
import { component, searchUser } from "@/store/atom"
import transaction from "@/public/icons8-transaction-50.png"

export function SideBar(){

    const [renderComponent,setRenderComponent] = useRecoilState(component)
    const setUser = useSetRecoilState(searchUser)

    const changeComponent = (change:number)=>{
        if (change===renderComponent) {
            return
        }
        setUser("")
        setRenderComponent(change)
    }

    return(

        <div className="z-[10] bg-gray-800 h-screen w-fit pt-3 px-2 flex flex-col items-center ">
            <div onClick={()=>changeComponent(0)} className={`mb-10  w-10 rounded-full h-10 p-2 cursor-pointer ${(!renderComponent)&&'bg-white bg-opacity-25'}`}>
                <Image className="fill-blue-400" src={chat} alt="chat"/>
            </div>
            <div  onClick={()=>changeComponent(1)} className={`mb-10 cursor-pointer w-10 rounded-full h-10 flex items-center justify-center  ${(renderComponent==1)&&'bg-white bg-opacity-25'}`}>
                <Image className="font-bold"  src={search} alt="search" />
            </div>
            <div onClick={()=>changeComponent(2)} className={`cursor-pointer w-11 rounded-full h-11 p-2 ${(renderComponent===2)&&'bg-white bg-opacity-25'} bg-opacity-25`}>
                <Image src={transaction} alt="transaction"/>
            </div>
        </div>
    )
}