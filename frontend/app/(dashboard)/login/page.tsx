"use client"

import {  useEffect, useState } from "react"
import { SignUp } from "@/app/components/signUp"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import { Login } from "@/app/components/Login"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"


export default function User(){
    
    const router = useRouter()  

    const [isLogin,setIsLogin] = useState(true)

    return(
        <div className="h-screen flex flex-col items-center justify-center bg-gray-900 items-center dark overflow-hidden">
            <BackgroundBeamsWithCollision >
            <div>
                <div className="text-white font-bold ">{`${isLogin?"New user?":"Already have an Account?"}`} <span onClick={()=>setIsLogin((prev)=>!prev)} className="underline cursor-pointer underline-offset-1 text-slate-500">{`${isLogin?"SignUp":"Login"}`}</span></div>
                    
               {isLogin?<Login/>:<SignUp/>}
            </div>
            </BackgroundBeamsWithCollision>
        </div>
        
    )
}