"use client"

import { Signika } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import github from "@/public/icons8-github-24.png"

const signika = Signika({
    subsets: ['latin'], 
    weight: ['400', '600', '700', '500'], 
    style: 'normal' 
})

export function AppBar() {
    return (
        <div className="h-20  flex justify-center items-center">
        <div className="md:w-2/3 px-2 w-full h-[100%] flex justify-between items-center">
            <div className={`text-white cursor-pointer ${signika.className} text-2xl font-semibold`}>
                SolChat
            </div>
            <div className=" md:w-60 w-48 flex md:justify-between  justify-around items-center ">
                <Link href={'https://github.com/mayankgb/payChat'} className={`p-2 cursor-pointer hover:text-white/70 transiton ease-in-out duration-200 flex items-center md:justify-around justify-center w-44 text-white ${signika.className}`}>
                    <div className="md:block hidden">Star us on Github</div>
                    <Image className="bg-white ml-2 hover:text-red-400 rounded-full" src={github} alt="icon" />
                </Link>
                <Link href={"/login"} className={`cursor-pointer hover:text-white/70 transition ease-in-out duration-200 text-white ${signika.className}`}>
                    Login
                </Link>
            </div>

        </div>
    </div>
    );
}
