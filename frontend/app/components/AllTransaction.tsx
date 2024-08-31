"use client";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TransactionCard } from "./TransactionCard";


interface Transaction {
  sendingTransaction: {
    date: Date;
    receiverId: string;
    amount: number;
    signature: string;
  }[];
  receiverTransaction: {
    date: Date;
    senderId: string;
    amount: number;
    signature: string;
  }[];
}

export function AllTransaction() {
  const [isCredited, setIsCredited] = useState(0);
  const [transactions, setTransactions] = useState<Transaction>();


  useEffect(() => {
    async function getAllTransaction() {
      try {
        const result = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/transaction`,
          {
            headers: {
              Authorization: JSON.parse(localStorage.getItem("token") || ""),
            },
          }
        );
        setTransactions(result.data.transaction);
        return result.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            console.log(
              "Bad Request:",
              error.response.data.message,
              error.response.data
            );
          } else if (error.response?.status === 404) {
            console.log("Not Found:", error.response.data);
          } else {
            console.log("Unexpected error:", error.response?.data || error.message);
          }
        } else {
          console.log("An unexpected error occurred:", error);
        }
      }
    }

    getAllTransaction();
  }, []);

  const handleClick = (tab: number) => {
    if (tab !== isCredited) {
      setIsCredited(tab);
    }
  };

  
  return (
    <div className="bg-gray-900 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 py-6 shadow-lg overflow-auto scrollbar-custom">
      <div className="p-2 font-semibold text-white text-2xl">All Transactions</div>
      <motion.div className="flex mt-4 w-full justify-around p-2 items-center">
        <motion.div
          onClick={() => handleClick(0)}
          className={`grow-1 hover:bg-white hover:bg-opacity-25 cursor-pointer ${
            isCredited === 0 ? "bg-green-500" : "bg-gray-700"
          } w-24 p-2 rounded-full text-center text-white font-semibold`}
        >
          Credited
        </motion.div>
        <motion.div
          onClick={() => handleClick(1)}
          className={`grow-1 text-center cursor-pointer w-24 p-2 hover:bg-white hover:bg-opacity-25 ${
            isCredited === 1 ? "bg-red-500" : "bg-gray-700"
          } rounded-full mr-1 text-white font-semibold`}
        >
          Debited
        </motion.div>
      </motion.div>
      <AnimatePresence mode="popLayout">
        {isCredited === 0 ? (
          transactions?.receiverTransaction.length ? (
            transactions.receiverTransaction.map((value, index) => (
              <TransactionCard
                key={index}
                amount={value.amount}
                userId={value.senderId}
                date={value.date}
                transactionLink={`https://solscan.io/tx/${value.signature}`}
                isSent={false}
              />
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 font-semibold">
              No transactions found
            </div>
          )
        ) : transactions?.sendingTransaction.length ? (
          transactions.sendingTransaction.map((value, index) => (
            <TransactionCard
              key={index}
              amount={value.amount}
              userId={value.receiverId}
              date={value.date}
              transactionLink={`https://solscan.io/tx/${value.signature}`}
              isSent={true}
            />
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 font-semibold">
            No transactions found
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
