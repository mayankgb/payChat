import { AppBar } from "../components/AppBar";
import Image from "next/image";
import chats from "@/public/chat.png";
import recent from "@/public/recent.png";
import all from "@/public/all.png";
import Link from "next/link";

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
            <AppBar />
            <div className="flex flex-col h-96 items-center justify-center mt-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Welcome to PayChat
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-6">
                    Your go-to platform for transaction history that&apos;s both trackable and readable—
                    <span className="block mt-2 text-gray-200">
                        something traditional wallets can&apos;t offer.
                    </span>
                </p>
                <Link href={'/'}>
                    <button className="bg-blue-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
                        Get started
                    </button>
                </Link>
            </div>
            <div className="flex flex-col mt-12 space-y-12">
                <div className="flex items-center justify-between px-4">
                    <div className="text-white text-xl md:text-2xl font-medium w-1/2">
                        💫 Send Solana while chatting and receive real-time confirmations.
                    </div>
                    <div className="w-1/2">
                        <Image className="rounded-xl shadow-lg" src={chats} alt="Send Solana" />
                    </div>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-white text-xl md:text-2xl font-medium w-1/2">
                        💫 You can easily track every transaction with each friend
                    </div>
                    <div className="w-1/2">
                        <Image className="rounded-xl shadow-lg" src={recent} alt="Track Payments" />
                    </div>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-white text-xl md:text-2xl font-medium w-1/2">
                        💫 Monitor every payment in detail, giving you full visibility.
                    </div>
                    <div className="w-1/2">
                        <Image className="rounded-xl shadow-lg" src={all} alt="Payment Details" />
                    </div>
                </div>
            </div>
        </div>
    );
}
