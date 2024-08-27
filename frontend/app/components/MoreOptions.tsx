"use Client"

import { useState } from "react"
import solanaPng from "@/public/solana-sol-logo.png"
import Image from "next/image"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useRecoilState, useSetRecoilState } from "recoil"
import { sol } from "@/store/atom"
import {animate, AnimatePresence, motion} from "framer-motion"
import plus from "@/public/172525_plus_icon.svg"

export default function PlusIcon(){

    const [options,setOptions] = useState(false)
    const setSol = useSetRecoilState(sol)
    const {publicKey} = useWallet()

    return(
        <div  className="relative rounded-full cursor-pointer text-4xl bg-white/25 flex text-gray-700 justify-center items-center  text-center ">
            <AnimatePresence mode="wait">
                {options&& 
                <motion.div
                 initial={{ scale: 0,  transformOrigin: 'bottom left' }}
                 animate={{scale:1 , transition:{duration:0.2, delayChildren:0.3, staggerChildren:0.05}}}
                 exit={{scale:0, transition:{duration:0.2}}}
                 className="absolute bottom-14 bg-slate-700 rounded-xl  w-40 h-fit  left-7 text-xl">
                    {publicKey?(
                        <motion.div
                        onClick={()=>{
                            setSol((prev)=>!prev)
                            setOptions((prev)=>!prev)
                            }}
                         initial={{y:-10,opacity:0}}
                         animate={{y:0,opacity:1,transition:{duration: 0.4}}}
                         exit={{y:-10,opacity:0, transition:{duration:0.3}}}
                         className=" p-2 rounded text-white flex items-center">
                            <div className="w-5">
                                <Image src={solanaPng} alt="icon"/>
                            </div>
                            <div  className="text-base font-semibold text-[#d1d7db]  ml-3">
                                Sendsol
                            </div>
                        </motion.div>
                    ):(
                        <WalletMultiButton className="!flex !items-center !justify-between !bg-red-400">
                            <div className="w-12">
                                <Image width={20} src={solanaPng} alt="icon"></Image>
                            </div>
                            <div className="">
                                connect
                            </div>
                        </WalletMultiButton>
                    )}
                    <div className="w-40">
                        {/* <WalletDisconnectButton className="w-40"></WalletDisconnectButton> */}
                    </div>
                </motion.div>
                }
            </AnimatePresence>
                    <motion.div
                     initial={false}
                     animate={options?{rotate:135}:{rotate:0}}
                     transition={{duration:0.4}}
                     onClick={()=>setOptions(!options)} className="rounded-full text-white p-2 h-10 flex items-center justify-center w-10 bg-white/25 font-semibold text-center">
                       <Image className="text-white" src={plus} alt="icon"/>
                    </motion.div>
            </div>   
    )
}