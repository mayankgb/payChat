import Image from "next/image";
import solanaPng from "@/public/solana-sol-logo.png";

export default function SolanaCard({
  amount,
  to,
  signature,
  message,
  time,
  date,
  isSentByme
}: {
  amount: number;
  to: string;
  signature: string;
  message: string;
  time: string;
  date?: string;
  isSentByme:boolean
}) {
  return (
    <div className="relative bg-[#1e1e2e] rounded-xl shadow-lg p-6 w-80 mx-auto transform transition-transform duration-300 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#1a1a2e] to-[#1e1e2e] opacity-70 rounded-xl pointer-events-none" />
      <div className="relative z-10 flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Image src={solanaPng} alt="Solana" className="w-10 h-10" />
          <div className="flex flex-col">
            <p className={`text-2xl ${isSentByme?"text-[#00ffa3]":"text-red-400"} font-semibold`}>◎ {amount} SOL</p>
            <p className="text-sm text-gray-400">Sent to @{to}</p>
          </div>
        </div>
        <div>
          <a
            href={`https://solscan.io/tx/${signature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#00a3ff] underline hover:text-[#00ffa3] transition-colors duration-300"
          >
            View Transaction
          </a>
        </div>
        <div className="bg-[#2a2a3c] rounded-lg p-4">
          <p className="text-xs text-gray-500">Message:</p>
          <p className="text-sm text-gray-200 mt-1">{message}</p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p>{time}</p>
          {date && <p>{date}</p>}
        </div>
      </div>
    </div>
  );
}
