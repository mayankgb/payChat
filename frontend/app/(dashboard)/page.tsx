"use client"

import { useEffect, useState } from "react";
import { AppBar } from "../components/AppBar";
import { Chat } from "../components/Chats";
import { Sol } from "../components/Sol";
import { Verify } from "../components/Verify";
import { useRecoilState, useSetRecoilState } from "recoil";
import { backend, searchUser, wss } from "@/store/atom";
import { Data ,MESSAGETYPE, rooms} from "../lib/types";

export default function Home(){

    const setSocket = useSetRecoilState(wss)
    const [rooms,setRooms] = useRecoilState(backend)
    const findUser = useSetRecoilState(searchUser)

    
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080")

        socket.onopen = ()=>{
            console.log("connected")
            socket.send(JSON.stringify({
                    request:"online",
                    token:JSON.parse(localStorage.getItem("token")||"")
            }))
            setSocket(socket)
        } 

        socket.onmessage = (message)=>{
            // console.log(message.data)

            const newRooms = JSON.parse(message.data)

            console.log(newRooms)
            if (newRooms.type==="newMessage") {
                console.log("jubaan kesri")
                setRooms((prevRooms) => {
                    // Find the room that corresponds to this message
                    const updatedRooms = prevRooms.map(room => {
                        if (room.roomID === newRooms.roomId) {
                            // Append the new message to the messages array
                            const newMessage:Data={
                                from:newRooms.from,
                                to:newRooms.to,
                                value:newRooms.value,
                                messageType:newRooms.messageType,
                                amount:newRooms.amount,
                                signature:newRooms.signature,
                                Date:newRooms.Date,
                                Time:newRooms.Time
                            }
                            const updatedMessages = room.message ? [...room.message, newMessage] : [newMessage];
                            return {
                                ...room,
                                lastMessage: newMessage,
                                message: updatedMessages
                            };
                        }
                        return room;
                    });
                    
                    return updatedRooms;
                });
                console.log(rooms)

            }
            if (newRooms.type==='firstOnline') {
                const createdRoom:rooms = {
                    friend:newRooms.friend,
                    friendPubKey:newRooms.friendPubKey,
                    lastMessage:newRooms.lastMessage,
                    roomID:newRooms.roomID,
                    message:newRooms.message ? newRooms.message : [],
                    status:newRooms.status
                } 
                setRooms((prev)=>[...prev,createdRoom])    
            }
            if (newRooms.type==="newRoom") {

                setRooms((prev)=>[...prev,newRooms])

            }if(newRooms.type==="searchUser"){
                console.log(newRooms)
                findUser(newRooms.userName)
            }else{
                console.log(message.data)
            }
            
        }
    },[])

    return (
        <div className="h-screen ">
            {/* <AppBar/> */}
            {/* <Sol/> */}
            {/* <Verify/> */}
            <Chat/>
        </div>
    )
}