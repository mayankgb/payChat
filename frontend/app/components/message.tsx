"use client"

import { backend, index } from "@/store/atom";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import SolanaCard from "./SolanaCard";

export function Message() {
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const selectedIndex = useRecoilValue(index);
    const room = useRecoilValue(backend);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [selectedIndex, room]);

    if (!room || !room[selectedIndex]) {
        return <div className="flex-1 h-[90%] py-4 overflow-auto"></div>;
    }

    return (
        <div className="flex-1 h-[90%] py-4 overflow-auto scrollbar-custom" ref={messageContainerRef}>
            {room[selectedIndex].message?.map((mes, index) => (
                <div key={index} className={`text-white p-2 w-full ${(mes.from !== room[selectedIndex]?.friend) ? "flex justify-end" : " flex"}`}>
                    {(mes.messageType==="MESSAGE")?(
                            <div key={index} className={`relative ${mes.value.length>=46?"w-96":"w-fit"} h-fit bg-customDark flex justify-between p-3 rounded-xl`}>
                                <div className="mr-2">
                                    {typeof mes.value === 'object' ? JSON.stringify(mes.value) : mes.value}
                                </div>
                                <div className="text-slate-500 flex items-end">
                                    <div className="text-sm">
                                       {mes.Time}
                                    </div>
                                </div>
                            </div>
                    ):((mes.messageType==="SOLANA"&&<div><SolanaCard isSentByme={mes.from === room[selectedIndex]?.friend} time={mes.Time} message={mes.value} amount={mes.amount||0} to={mes.to} signature={mes.signature||""} /></div>)
                    )}
                </div>
                
            ))}
        </div>
    );
}