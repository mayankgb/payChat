import PlusIcon from "./MoreOptions";
import { useRecoilValue } from "recoil";
import { sol } from "@/store/atom";

import { SolInputBox } from "./SolInputBox";
import { SendMessage } from "./SendMessage";

export function InputBox(){

   
    const sendsol = useRecoilValue(sol)

    return(
        <div className="p-2 bg-slate-700 flex justify-around items-center ">
                <PlusIcon/>
                <div className="w-[90%] ">
                    {sendsol?<SolInputBox/>:<SendMessage/>}
                </div>
                
        </div>
    )
}