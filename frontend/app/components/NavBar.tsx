import { backend, index, open } from "@/store/atom"
import { useRecoilState, useRecoilValue } from "recoil"
import Image from "next/image"

export function NavBar(){

    const room = useRecoilValue(backend)
    const selectedIndex = useRecoilValue(index)
    const [isOpen,setIsOpen] = useRecoilState(open)

    if (!room) {
        return <div>loading</div>
    }

    return(
        <div className="bg-slate-600 text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
            <Image width={40} height={40} src={`https://avatar.iran.liara.run/public/${room[selectedIndex]?.friend.length}`} alt="icon" />
            <div className="ml-2">
                <div>
                   {room[selectedIndex]?.friend}
                </div>
                {room[selectedIndex]?.status&&<div className="text-sm text-slate-400 font-semibold">
                    online
                </div>}
            </div>
        </div>
        <div className="">
            <button onClick={()=>setIsOpen(!isOpen)} className="bg-white bg-opacity-25 p-3 rounded-full hover:bg-opacity-75">Transactions</button>
        </div>
    </div>
    )
}