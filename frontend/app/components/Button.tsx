"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export function Button(){

    const {publicKey} = useWallet()

    return(
        <div className="">
            {publicKey?<WalletDisconnectButton/>:<WalletMultiButton/>}
        </div>
    )
}