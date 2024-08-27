import Image from "next/image"
import solanaPng from "@/public/solana-sol-logo.png"

export default function SolanaCard({amount,to,signature,message,time,date}:{amount:number,to:string,signature:string,message:string,time:string,date?:string}){

    return (
        <div className="bg-gradient-to-r from-blue-200 to-gray-200 rounded-lg shadow-md p-4 w-60 mx-auto">
            <div className="flex items-start">
                <div className="flex items-start">
                <Image  src={solanaPng} alt="Solana" className="w-6 h-6 mt-1 mr-3"/>
                <div>
                    <p className="text-2xl text-black font-semibold">◎ {amount} SOL</p>
                    <p className="text-sm text-gray-500">Sent</p>
                    <p className="text-base text-gray-700">To: @{to}</p>
                    <a href={`https://solscan.io/tx/${signature}`} target="_blank" className="text-sm text-blue-500 underline">View Transaction</a>
                    <p className="font-bold text-slate-800">message</p>
                    <p className="text-black">{message}</p>
                </div>
                </div>
                <div>
                    {date}
                </div>
                <div className="text-neutral-400 font-bold">
                    {time}
                </div>
            </div>
        </div>

    )
}