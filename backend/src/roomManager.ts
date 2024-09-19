import { Kafka, Producer } from "kafkajs"
import { Message, Room, User } from "./rooms"
import { WebSocket } from "ws"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { PrismaClient, } from "@prisma/client"
import { Redis } from "ioredis"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()


export class RoomManager{
    private static instance:RoomManager
    private rooms:Room[]
    totalUsers:User[]
    onlineUsers:Map<string,WebSocket>
    private redis:Redis
    private prisma:PrismaClient

    private  constructor(){
        this.rooms = []
        this.totalUsers = []
        this.onlineUsers= new Map()
        this.redis = new Redis({
            host:process.env.BROKERS,
            password:process.env.PASSWORD,
            port:15268,
            db:0
        })
        this.prisma = new PrismaClient()
    }


    static getInstance(){
        if (!this.instance) {
            this.instance = new RoomManager()
        }
        return this.instance
    }


  async initializeDb(){
      const users = await this.prisma.user.findMany({
            where:{},
            select:{
                userName:true,
                pubKey:true
            }
        })

        if (users.length) {
            users.map((t)=>this.totalUsers.push({
                userName:t.userName,
                pubKey:t.pubKey||"",
                status:false
            }))
        }


        const existingRooms = await this.prisma.conversation.findMany({
            where:{},
            select:{
                id:true,
                messages:{
                    orderBy:{
                        date:"asc"
                    },
                    select:{
                        senderId:true,
                        receiverId:true,
                        message:true,
                        type:true,
                        amount:true,
                        signature:true,
                        date:true
                    }
                },
                Group:{
                    select:{
                        user:{
                            select:{
                                userName:true,
                                pubKey:true
                            }
                        }
                    }
                }
            }
        })

        if (existingRooms.length) {
           existingRooms.map((room)=>{
           const users = room.Group.map((x)=>{
                const newUser:User = {
                    userName:x.user.userName,
                    pubKey:x.user.pubKey||"",
                    status:false
                }
                return newUser
            })

            const message = room.messages.map((m)=>{
                const newMessage:Message ={
                    from:m.senderId,
                    to:m.receiverId,
                    value:m.message,
                    messageType:(m.type==="SOLANA")?"SOLANA":"MESSAGE",
                    amount:(m.amount?m.amount/LAMPORTS_PER_SOL:0),
                    signature:m.signature||"",
                    Time:this.formatTime(m.date).split(",")[0],
                    Date:this.formatTime(m.date).split(',')[1]

                } 
                return newMessage
            })

            const newRoom = new Room(users[0],users[1],room.id)
            newRoom.message = message
            this.rooms.push(newRoom)
           })
        }

    }

    Online(userName:string,userWs:WebSocket){
        if (!this.onlineUsers.has(userName)) {
            this.onlineUsers.set(userName,userWs)    
        }
        
        const user = this.totalUsers.find((usr)=>usr.userName===userName)

        if (user) {
            const existingUser = this.rooms.filter((room)=>(room.messenger1.userName===userName)||(room.messenger2.userName===userName))

            if (existingUser) {
                existingUser.map((room)=>{

                    // room.messenger1.userName === userName?room.messenger1.status=true : room.messenger2.status=true

                    userWs.send(JSON.stringify({
                        type:"firstOnline",
                        roomID:room.roomId,
                        friend:(room.messenger1.userName!==userName)?room.messenger1.userName:room.messenger2.userName,
                        friendPubKey:(room.messenger1.userName!==userName)?room.messenger1.pubKey:room.messenger2.pubKey,
                        lastMessage:(room.message.length)?room.message[room.message.length-1]:"",
                        message:room.message,
                        status:(room.messenger1.userName!==userName)?room.messenger1.status:room.messenger2.status,
                    }))

                    if (room.messenger1.userName!=userName) {
                        if (!room.messenger2.status) {
                            room.messenger2.status = true
                            const user  = this.onlineUsers.get(room.messenger1.userName)
                            if (user) {
                                user.send(JSON.stringify({
                                    type:"status",
                                    status:true,
                                    userName:userName,
                                    roomId:room.roomId
                                }))
                            }
                        }
                    }else{
                        if (!room.messenger1.status) {
                            room.messenger1.status = true
                            this.onlineUsers.get(room.messenger2.userName)?.send(JSON.stringify({
                                type:"status",
                                status:true,
                                userName:userName,
                                roomId:room.roomId
                            }))   
                        }
                    }
                })
            }   
        }
    }

    private formatTime(date:Date):string{

        const formattedDate  = new Date(date).toLocaleDateString('en-GB',{
            day:'numeric',
            month:"long",
            year:"numeric",
        })

        const formattedTime = new Date(date).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, 
            timeZone: 'Asia/Kolkata'
          });

          return `${formattedTime}, ${formattedDate}`
    }

    async sendMessage(from:string,to:string,message:string){
        if (from===to) {
            this.onlineUsers.get(from)?.send(JSON.stringify({
                message:"invalid inputs"
            }))
            return
        }

        const receiver  = this.totalUsers.find((user)=>user.userName===to)

        if (!receiver) {
            this.onlineUsers.get(from)?.send(JSON.stringify({
                message:"receiver is not present"
            }))
            return
        }

        const existingRoom = this.rooms.find((room)=>
            ((room.messenger1.userName===from)&&(room.messenger2.userName===to))||((room.messenger1.userName===to)&&(room.messenger2.userName===from)))

        if (existingRoom) {
            const user = this.onlineUsers.get(to)

            const now = new Date()

            this.onlineUsers.get(from)?.send(JSON.stringify({
                from,
                to,
                value:message,
                type:"newMessage",
                messageType:'MESSAGE',
                roomId:existingRoom.roomId,
                Time:this.formatTime(now).split(",")[0],
                Date:this.formatTime(now).split(',')[1]
            }))

           

            const newMessage:Message = {
                from,
                to,
                value:message,
                messageType:'MESSAGE',
                Time:this.formatTime(now).split(",")[0],
                Date:this.formatTime(now).split(',')[1]
            }

            const test = {
                from:from,
                to:to,
                value:message,
                type:"newMessage",
                messageType:'MESSAGE',
                roomId:existingRoom.roomId,
                Time:this.formatTime(now).split(",")[0],
                Date:this.formatTime(now).split(',')[1]
            }

            existingRoom.message.push(newMessage)
            user?.send(JSON.stringify(test))
            await this.sendToDb(from,to,message,existingRoom.roomId)
            

        }else{
          const newRoom = await this.createRoom(from,to)
          const sender = this.onlineUsers.get(from)?.send(JSON.stringify({
            type:"newRoom",
            roomId:newRoom.roomId,
            userId:to,
            userPubKey:this.totalUsers.find((receiver)=>receiver.userName===to)?.pubKey
          }))
          const receiver = this.onlineUsers.get(to)?.send(JSON.stringify({
            type:"newRoom",
            roomId:newRoom.roomId,
            userId:from
          }))
        }
    }

    exisitngMessage(roomId:string,firstUser:string,secondUser:string,userWs:WebSocket){
        const existingRoom = this.rooms.find((t)=>t.roomId===roomId)
        if (!existingRoom) {
            return
        }
        const isUser = ((existingRoom.messenger1.userName === firstUser)&&(existingRoom.messenger2.userName===secondUser))||((existingRoom.messenger1.userName === secondUser)&&(existingRoom.messenger2.userName===firstUser))
        if (!isUser) {
            return userWs.send("invalid")
        }
        
        existingRoom.message.map((m)=>{
            userWs.send(JSON.stringify({
                from:m.from,
                to:m.to,
                messageType:m.messageType,
                amount:m.amount,
                value:m.value,
                type:"newMessage"
            }))
        })

    }

    findUser(from:string,searchUserName:string){
        const existingUser = this.totalUsers.find((user)=>user.userName===searchUserName)

        if(existingUser){
            this.onlineUsers.get(from)?.send(JSON.stringify({
                type:"searchUser",
                userName:existingUser.userName
            }))
        }else{
            this.onlineUsers.get(from)?.send(JSON.stringify({
                type:"searchUser",
                userName:''
            }))
        }
    }

     async createRoom(from:string,to:string):Promise<Room>{

        const user1:User = {
            userName:from,
            pubKey:this.totalUsers.find((u)=>u.userName===from)?.pubKey,
            status:this.onlineUsers.has(from)?true:false
        }
        const user2:User = {
            userName:to,
            pubKey:this.totalUsers.find((u)=>u.userName===to)?.pubKey,
            status:this.onlineUsers.has(to)?true:false
        }

        try{
            const room =  await this.prisma.conversation.create({
                data:{
                    user1Id:from,
                    user2Id:to
                },
                select:{
                    id:true
                }
            })
    
            await this.prisma.$transaction(async(tx)=>{
               await tx.group.create({
                    data:{
                        userId:from,
                        conversationId:room.id
                    }
                })
    
               await tx.group.create({
                data:{
                    userId:to,
                    conversationId:room.id
                }
               })
            })
            const newRoom =  new Room(user1,user2,room.id)
            this.rooms.push(newRoom)

            this.onlineUsers.get(from)?.send(JSON.stringify({
                type:"firstOnline",
                roomID:newRoom.roomId,
                friend:user2.userName,
                friendPubKey:user2.pubKey,
                lastMessage:(newRoom.message.length)?newRoom.message[newRoom.message.length-1]:"",
                message:newRoom.message
            }))

            this.onlineUsers.get(to)?.send(JSON.stringify({
                type:"firstOnline",
                roomID:newRoom.roomId,
                friend:user1.userName,
                friendPubKey:user1.pubKey,
                lastMessage:(newRoom.message.length)?newRoom.message[newRoom.message.length-1]:"",
                message:newRoom.message
            }))

            return newRoom
        }catch(e){
            console.log(e)
            throw new Error("something went wrong")
        }
    }


    async sendToDb(from:string,to:string,value:string,roomId:string){
        
        await this.redis.xadd(
            'messageStream', // The name of the Redis Stream
            '*',            // Use '*' to let Redis generate a unique ID
            'type', 'newMessage',
            'from', from,
            'to', to,
            'value', value,
            'roomId', roomId
        );
    }

    async sendSol(from:string , to:string, fromUserId:string,toUserId:string,message:string ,amount:number,signature:string,roomId:string){
        const now  = new Date()

        const newMessage:Message = {
            from:fromUserId,
            to:toUserId,
            value:message,
            messageType:"SOLANA",
            amount:amount/LAMPORTS_PER_SOL,
            signature:signature,
            Time:this.formatTime(now).split(",")[0],
            Date:this.formatTime(now).split(",")[1]
        }

        this.onlineUsers.get(fromUserId)?.send(JSON.stringify({
            ...newMessage,
            roomId:roomId,
            type:"newMessage"
        }))

        if (this.onlineUsers.has(toUserId)) {
            this.onlineUsers.get(toUserId)?.send(JSON.stringify({
                ...newMessage,
                roomId:roomId,
                type:"newMessage"
            }))
        }

        const existingRoom = this.rooms.find((room)=>room.roomId===roomId)
        if (existingRoom) {
            existingRoom.message.push(newMessage)
        }

        await this.redis.xadd(
            'messageStream',   // Name of the Redis Stream
            '*',               // Use '*' to let Redis generate an ID automatically
            'type', 'sendSolana',
            'from', from,
            'to', to,
            'fromUserId', fromUserId,
            'toUserId', toUserId,
            'amount', amount,
            'signature', signature,
            'roomId', roomId,
            'value', message
        );
    }

    offline(ws:WebSocket){
        let userName:string =""
         this.onlineUsers.forEach((value,key)=>{
            if (value===ws) {
                userName = key
                this.onlineUsers.delete(key)
            }
        })

            if (userName) {
                this.rooms.map((value)=>{
    
                    value.messenger1.userName === userName ? value.messenger1.status=false : value.messenger2.status=false
    
                    if (value.messenger1.userName===userName) {
                        this.onlineUsers.get(value.messenger2.userName)?.send(JSON.stringify({
                            type:"status",
                            status:false,
                            roomId:value.roomId
                        }))
                    }else if (value.messenger2.userName===userName) {
                        this.onlineUsers.get(value.messenger1.userName)?.send(JSON.stringify({
                            type:"status",
                            status:false,
                            roomId:value.roomId
                        }))
                    }
                })
            }
    }
}