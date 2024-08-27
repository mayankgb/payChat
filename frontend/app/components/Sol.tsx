"use client"

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"

export function Sol(){

    const {publicKey,sendTransaction} = useWallet()
    const {connection} = useConnection()

    async function makePaymnet() {
        if (!publicKey) {
            return
        }
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey:publicKey,
                toPubkey:new PublicKey("EEFPkB9mNvdmJUn3zVD9u2uCrDKVaDpbAHNPdV2ev4hb"),
                lamports:0.1*LAMPORTS_PER_SOL

            })
        )
        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction,connection,{minContextSlot})
        
        await connection.confirmTransaction({blockhash, lastValidBlockHeight,signature})

        console.log(signature)
        
    }
    return(
        <div>
            <button onClick={makePaymnet}>Pay me sol</button>
        </div>
    )
}