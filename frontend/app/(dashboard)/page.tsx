"use client"

import { useEffect } from "react";
import { Chat } from "../components/Chats";
import { useRecoilState, useSetRecoilState } from "recoil";
import { backend, searchUser, wss } from "@/store/atom";
import { Data , rooms} from "../lib/types";

export default function Home(){

    const setSocket = useSetRecoilState(wss)
    const [rooms,setRooms] = useRecoilState(backend)
    const findUser = useSetRecoilState(searchUser)

    
    useEffect(()=>{
        const socket = new WebSocket("wss://paychat-2.onrender.com")

        socket.onopen = ()=>{
            console.log("connected")
            socket.send(JSON.stringify({
                    request:"online",
                    token:JSON.parse(localStorage.getItem("token")||"")
            }))
            setSocket(socket)
        } 

        socket.onmessage = (message)=>{

            const newRooms = JSON.parse(message.data)

            if (newRooms.type==="newMessage") {
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
                findUser(newRooms.userName)
            }else{
                console.log(message.data)
            }
            
        }
    },[])

    return (
        <div className="h-screen ">
            <Chat/>
        </div>
    )
}