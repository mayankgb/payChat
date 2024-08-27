"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"

export function Verify(){

    const {publicKey,signMessage} = useWallet()
    const [signature, setSignature] = useState<Uint8Array>()

    const verify = async ()=>{
        const message = "hat madarchod"

        const encoded =  new TextEncoder().encode(message)
        
        const sign = await signMessage?.(encoded)
        console.log(sign)
        setSignature(sign)
        console.log(publicKey)
    }


    return (
        <div>
            <button onClick={()=>{signature?console.log("already verified"):verify()}}>{signature?"Verified":"Verify wallet"}</button>
        </div>
    )
}