"use client"

import chat from "@/public/recent.png"
import Image from "next/image"
import { motion } from "framer-motion"
import message from "@/public/message.png"
import solana from "@/public/solana.png"
import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation"
export function HeroSection() {

    const router = useRouter()

    const handleClick = () => {
        console.log("done")
        router.push("/login")
    }

    return (
        <div>
            <div className="h-[56%]  text-white flex flex-col justify-around items-center ">
                <div className="text-center tracking-tight md:text-6xl text-2xl font-bold" style={{ textShadow: "0px 0px 10px  rgba(255, 255, 255, 0.3)" }}>
                    <span className="">Your everyday chat app,</span>
                    <br /> Now with easy <span style={{ textShadow: "0 0 0 rgba(0, 0 , 0, 0 )" }} className="bg-gradient-to-r bg-gradient-to-r from-[#503dff] via-[#27c0fa] to-[#99f3d2] bg-clip-text text-transparent ">Solana</span> transfers
                </div>
                <div className="text-slate-400 mt-4 text-center">
                    Chat, send money, and track Solana transactions seamlessly with unique usernames.
                </div>
            </div>
            <div onClick={handleClick} className="flex cursor-pointer justify-center items-center mt-10">
                <Button 
                    style={{
                        boxShadow: `
                -7px 0 15px 0.5px rgba(80, 61, 255, 0.4), 
                0px 0 15px 0.5px rgba(39, 192, 250, 0.4), 
                7px 0 15px 0.5px rgba(153, 243, 210, 0.4) 
            `
                    }}
                    className="w-52 py-3 px-8 rounded-full text-white font-semibold bg-gradient-to-r from-[#503dff] via-[#27c0fa] to-[#99f3d2] transition-all duration-300 hover:scale-105"
                >
                    Get Started
                </Button>
            </div>
            <div className=" mt-4 mb-2 flex h-28 justify-center">
                <div className="flex justify-between p-2 h-full  w-2/3">
                    <motion.div className="relative " style={{ transform: "rotateY(-9deg)" }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { opacity: { duration: 2 }, ease: "easeInOut", } }}>
                        <motion.div initial={{ y: 0 }} animate={{ y: [-10, 0, -10], transition: { duration: 2, ease: "easeInOut", repeat: Infinity } }} className="absolute h-20 w-20 rounded-full bg-white/10 blur-lg z-0">

                        </motion.div>
                        <motion.div initial={{ y: 0 }} animate={{ y: [-10, 0, -10], transition: { duration: 2, ease: "easeInOut", repeat: Infinity } }} className="relative z-10">
                            <Image src={solana} alt="icon" className="w-20" />
                        </motion.div>
                    </motion.div>
                    <motion.div className="relative " initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { opacity: { duration: 2 }, ease: "easeInOut", delayChildren: 1 } }}>
                        <motion.div initial={{ y: 0 }} animate={{ y: [0, -10, 0], transition: { duration: 2, ease: "easeInOut", repeat: Infinity } }} className="absolute h-20 w-20 rounded-full bg-white/10 blur-lg z-0">

                        </motion.div>
                        <motion.div initial={{ y: 0 }} animate={{ y: [0, -10, 0], transition: { duration: 2, ease: "easeInOut", repeat: Infinity } }} className="relative z-10">
                            <Image src={message} alt="icon" className="w-20" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeInOut" } }} className="w-full p-4 pb-0 relative flex justify-center items-center ">
                <div className="absolute bg-[#453BD0] w-[500px]  h-[500px] rounded-full bottom-0  " style={{ filter: "blur(400px)" }}>

                </div>
                <div className="absolute w-[78%] h-[96%] bg-gradient-to-b from-transparent  to-[#0c0f14] to-[90%]  rounded-2xl  z-20">
                </div>
                <Image className="z-0 opacity-75 w-[80%] border border-2 border-b-0 border-neutral-600 rounded-2xl z-10" src={chat} alt="icon" />
            </motion.div>
        </div>


    )
}