import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {motion} from "framer-motion"

export function TransactionCard ({
    amount,
    userId,
    date,
    transactionLink,
    isSent,
  }: {
    amount: number;
    userId: string;
    date: Date;
    transactionLink: string;
    isSent: boolean;
  }) {

    
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
        className="flex items-center justify-between bg-gray-800 shadow-lg rounded-lg p-4 mb-3 transition-all hover:bg-gray-700"
      >
        <div className="flex flex-col">
          <div
            className={`text-xl font-bold ${
              isSent ? "text-red-400" : "text-green-400"
            }`}
          >
            {isSent ? "-" : "+"}
            {amount / LAMPORTS_PER_SOL} SOL
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {isSent ? "To: " : "From: "}
            <span className="text-white font-medium">{userId}</span>
          </div>
          <div className="text-sm text-blue-400 mt-2">
            <a
              href={transactionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              View Transaction
            </a>
          </div>
        </div>
        <div className="text-sm text-gray-500 font-semibold">
          {formatDate(date)}
        </div>
      </motion.div>
    );
  };
