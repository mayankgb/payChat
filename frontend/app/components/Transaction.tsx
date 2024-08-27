import { backend, index } from "@/store/atom";
import { useRecoilValue } from "recoil";
import SolanaCard from "./SolanaCard";
import {motion} from "framer-motion"

export function Transaction() {
    const selectedIndex = useRecoilValue(index);
    const room = useRecoilValue(backend);

    return (
        <motion.div layout className="bg-gray-900 text-gray-100 h-full overflow-auto w-full sm:w-3/12 p-4 border-l border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-4">
                 
                {
                (room[selectedIndex]?.message?.length)||0 > 0 ? (
                    room[selectedIndex].message?.slice().reverse().map((x, index) => (
                        x.messageType === "SOLANA" && (
                            <div key={index} className="  rounded-lg shadow-md hover:shadow-lg w-full transition-shadow duration-300">
                                <SolanaCard
                                    to={x.to}
                                    amount={x.amount || 0}
                                    message={x.value}
                                    signature={x.signature || ""}
                                />
                            </div>
                        )
                    ))
                ) : (
                    <p className="text-center text-gray-500">No transactions available</p>
                )}
            </div>
        </motion.div>
    );
}