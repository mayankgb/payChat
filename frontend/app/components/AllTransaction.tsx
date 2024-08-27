"use client"

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios"
import {motion} from "framer-motion"
import { useEffect, useState } from "react"

interface Transaction{
    sendingTransaction:{
        date: Date;
        receiverId: string;
        amount: number;
        signature: string;
    }[],
    receiverTransaction: {
        date: Date;
        senderId: string;
        amount: number;
        signature: string;
    }[]
}




export  function AllTransaction(){

    const [isCredited , setIsCredited] = useState(0)
    const [transactions,setTransactions] = useState<Transaction>()

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    useEffect(()=>{
        async function getAllTransaction(){
    
            try{
                const result = await axios.get("http://localhost:8080/api/user/transaction",{
                    headers:{
                        Authorization:JSON.parse(localStorage.getItem("token")||"")
                    }
                })

                console.log(result.data.transaction)
                setTransactions(result.data.transaction)
                // setTransactions(result.data.transaction)
                return result.data
            }
            catch(error){
                if (axios.isAxiosError(error)) {
                    // Handle Axios-specific errors
                    if (error.response?.status === 400) {
                      console.log("Bad Request:", error.response.data.message,error.response.data);
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
        
        getAllTransaction()
    },[])


    // const data = await getAllTransaction()

    const handleClick = (tab:number)=>{
        if (tab===isCredited) {
           return 
        }
        else{
            setIsCredited(tab)
        }
    }

    return (
         
        <div className="bg-customDark w-3/12 px-2 overflow-auto">
            <div className=" p-2 font-semibold text-white text-2xl">
                ALL TRANSACTION
            </div>
            <motion.div className="flex mt-2 w-full  justify-around p-1 items-center">
                <motion.div onClick={()=>handleClick(0)} className={`grow-1 hover:bg-white hover:bg-opacity-25 cursor-pointer ${(isCredited)?"":"bg-slate-500"} w-24 p-2 rounded-full text-center text-green-400`}>
                    credited
                </motion.div>
                <motion.div onClick={()=>handleClick(1)} className={`grow-1  text-center cursor-pointer w-24 p-2 hover:bg-white hover:bg-opacity-25 ${(isCredited)?"bg-slate-500":""} rounded-full mr-1 text-red-500`}>
                    Debited
                </motion.div>
            </motion.div>
            {isCredited?(
                transactions?.sendingTransaction.length?
                (transactions.sendingTransaction.map((value)=>(
                    <div className="flex bg-slate-400  mb-3 rounded p-2  items-end">
                            <div className="w-[80%]">
                                <div className="bg-red-500 w-fit py-1 px-2 rounded-2xl  font-bold">
                                    {value.amount/LAMPORTS_PER_SOL}
                                </div>
                                <div className="text-neutral-700 font-bold">
                                    <span className="font-semibold">to:</span> {value.receiverId}
                                </div>
                                <div className="">
                                <a href={`https://solscan.io/tx/${value.signature}`} target="_blank" className="text-normal font-semibold text-blue-500 underline">View Transaction</a>
                                </div>
                            </div>
                            <div className="text-slate-700 font-bold">
                                  {formatDate(value.date)}
                            </div>
                        </div>)
                )):(
                    <div className="text-center text-center text-slate-400 font-semibold">
                        No transaction found
                    </div>
                )
                
            ):(
                transactions?.receiverTransaction.length?(
                    transactions.receiverTransaction.map((value)=>(
                        <div className="flex bg-slate-400  mb-3 rounded p-2  items-end">
                            <div className="w-[80%]">
                                <div className="bg-green-500 w-fit py-1 px-2 rounded-2xl  font-bold">
                                    {value.amount/LAMPORTS_PER_SOL}
                                </div>
                                <div className="text-neutral-700 font-bold">
                                    <span className="">from:</span> {value.senderId}
                                </div>
                                <div className="">
                                <a href={`https://solscan.io/tx/${value.signature}`} target="_blank" className="text-normal font-semibold text-blue-500 underline">View Transaction</a>
                                </div>
                            </div>
                            <div className="text-slate-700 font-bold">
                                  {formatDate(value.date)}
                            </div>
                        </div>
                    ))
                ):(
                    <div className="text-center text-slate-400 font-semibold">
                        No transaction found
                    </div>
                )
            )}
            
        </div>
    )

}