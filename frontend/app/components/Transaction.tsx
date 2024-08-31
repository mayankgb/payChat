import { backend, index } from "@/store/atom";
import { useRecoilValue } from "recoil";
import SolanaCard from "./SolanaCard";
import { motion } from "framer-motion";

export function Transaction() {
    const selectedIndex = useRecoilValue(index);
    const room = useRecoilValue(backend);

    return (
        <motion.div 
            layout 
            className="bg-[#181824] text-gray-200 h-full overflow-auto w-full sm:w-1/3 p-4 border-l border-[#2a2a37] shadow-lg scrollbar-custom"
        >
            <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-4">
                {(room[selectedIndex]?.message?.filter((y) => y.messageType === "SOLANA")?.length || 0) > 0 ? (
                    room[selectedIndex].message?.slice().reverse().map((x, index) => (
                        x.messageType === "SOLANA" && (
                            <motion.div 
                                key={index} 
                                className="rounded-lg overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <SolanaCard
                                    to={x.to}
                                    amount={x.amount || 0}
                                    message={x.value}
                                    signature={x.signature || ""}
                                    time={x.Time}
                                    date={x.Date}
                                />
                            </motion.div>
                        )
                    ))
                ) : (
                    <p className="text-center text-gray-500">No transactions available</p>
                )}
            </div>
        </motion.div>
    );
}
