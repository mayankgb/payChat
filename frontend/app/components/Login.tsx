" use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import axios from "axios"
import { useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useState } from "react"
import toast from "react-hot-toast"

export function Login(){

    const [userInput,setUserInput] = useState({
        userName:"",
        password:""
    })

    const router = useRouter()

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        setUserInput((prev)=>({...prev,[e.target.name]:e.target.value}))
    } 

    async function handleSubmit(){

        try{
            const result = await axios.post("http://localhost:8080/api/user/login",{
                userInput
            })
            if (result.status===200) {
                console.log(result.data)
                const token = JSON.stringify(result.data.jwt)
                localStorage.setItem("token",token)
                router.push("/")
            }
        }
        catch(error){
            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                if (error.response?.status === 400) {
                  console.log("Bad Request:", error.response.data.message,error.response.data);
                  toast.error(error.response.data.message,{style:{
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  }},
                  )
                } else if (error.response?.status === 404) {
                  console.log("Not Found:", error.response.data);
                } else {
                  console.log("Unexpected error:", error.response?.data || error.message);
                }
              } else {
                // Handle non-Axios errors
                console.log("An unexpected error occurred:", error);
              }
        }
    
        }

    return (
        
        <div className="bg-gradient-to-b from-zinc-900/25 from-50% via-zinc-800/25 to-zinc-700/25  backdrop-blur-sm shadow-xl z-10 shadow-gray-500/25 py-3 px-4 w-96 h-[80%] flex flex-col justify-around rounded-3xl">
            <div>
                <div className="mb-1">
                   <label className="text-white " htmlFor="userName">UserName</label>
                </div> 
                <Input className="placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 bg-neutral-900 focus:border-white focus:border-2 text-white " type="text" name="userName" value={userInput.userName} onChange={(e)=>handleChange(e)} min={3} required placeholder="jhon9090" />
            </div>
            <div className="mb-2 ">
                <div className="mb-2">
                <label className="text-white " htmlFor="password">Password</label>
                </div>
                <Input type="password" className="placeholder:text-slate-500  focus-visible:ring-0 focus-visible:ring-offset-0 text-white bg-neutral-900 focus:border-white focus:border-2" name="password" value={userInput.password} onChange={(e)=>handleChange(e)} min={6} placeholder="type your password" required minLength={6}/>
            </div>
            <div className="">
                <Button onClick={handleSubmit} variant="secondary" className="w-full text-center">Login</Button>
            </div>
        </div>
    )
}