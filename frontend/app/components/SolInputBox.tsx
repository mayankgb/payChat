"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { backend, index, sol, wss } from "@/store/atom"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { ChangeEvent, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import Image from "next/image"
import cross from "@/public/icons8-cross (1).svg"
import solana from "@/public/solana-sol-logo.png"
import toast from "react-hot-toast"

export function SolInputBox(){


    
    const rooms = useRecoilValue(backend)
    const selectedIndex = useRecoilValue(index)

    const {publicKey,sendTransaction} = useWallet()
    const {connection} = useConnection()
    const setSol = useSetRecoilState(sol)

    const userSocket  = useRecoilValue(wss)
    const [isDisable,setDisable] = useState(false)

    
    const [details, setDetails] = useState({
        amount:0,
        publicKey:rooms[selectedIndex].friendPubKey,
        message:""
    })

    const handleChange = async (e:ChangeEvent<HTMLInputElement>)=>{
        setDetails((prev)=>({...prev,[e.target.name]:e.target.value}))
    }

    const makePayment = async (sendIndex:number)=>{
        setDisable(true)
        try{
            if (!publicKey) {
                return
            }
            
            const friendKey = rooms[sendIndex].friendPubKey
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey:publicKey,
                    toPubkey:new PublicKey(friendKey),
                    lamports:details.amount*LAMPORTS_PER_SOL
    
                })
            )
            const {
                context: { slot: minContextSlot },
                value: { blockhash, lastValidBlockHeight }
            } = await connection.getLatestBlockhashAndContext();
    
            const signature = await sendTransaction(transaction,connection,{minContextSlot})
            
            await connection.confirmTransaction({blockhash, lastValidBlockHeight,signature})
    
            console.log(signature)

            userSocket?.send(JSON.stringify({
                request:"sendSolana",
                from:publicKey.toBase58(),
                to:friendKey,
                token:JSON.parse(localStorage.getItem("token")||""),
                toUserId:rooms[sendIndex].friend,
                value:details.message,
                amount:details.amount*LAMPORTS_PER_SOL,
                signature:signature,
                roomId:rooms[sendIndex].roomID
            }))
            toast.success("Transaction successful")

            setDisable(false)


        }
        catch(e){
            toast.error("transaction rejected or failed")
            setDisable(false)
            console.log("something went wrong")
        }
        
        

    }

    return(
        <div className="flex  items-center justify-between w-[90%] ">
            <div className="flex flex-col">
                <label className="text-slate-400 ml-2 font-semibold" htmlFor="amount">Amount</label>
                <Input className="bg-gray-400 text-slate-500 rounded-full"  type="number" name="amount" value={details.amount} min="0.1" onChange={(e)=>handleChange(e)}/>
            </div>
            <div>
                <div>
                    <div>
                    <label className="text-slate-400 font-semibold" htmlFor="publicKey">your friend's public key</label>
                    </div>
                    <Input type="text" className="w-96 placeholder:text-slate-400 text-slate-200 rounded-xl" name="publicKey" value={rooms[selectedIndex].friendPubKey} disabled={true}></Input>
                </div>
                <div>
                <div>
                    <label className="text-slate-400 font-semibold" htmlFor="Message">message</label>
                    </div>
                    <Input className="bg-white placeholder:text-slate-700" type="text" name="message" placeholder="message" value={details.message} onChange={(e)=>handleChange(e)}/>
                </div>
            </div>
            <div className="">
                <Button className="p-2 w-32 flex items-center text-center text-md" variant={"secondary"} disabled={isDisable} onClick={()=>makePayment(selectedIndex)}>
                    <Image  className="mr-2 w-5" src={solana} alt="solana"/>
                    <div>
                     {isDisable?"Sending...":"Send"}
                    </div>
                </Button>
            </div>
            <div onClick={()=>setSol((prev)=>!prev)} className="bg-white/25 cursor-pointer w-10 h-10 flex items-center justify-center rounded-full ">
                <Image className="h-8 w-8" src={cross} alt="cross" />
            </div>
        </div>
    )

}