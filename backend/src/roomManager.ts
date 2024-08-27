import { Kafka, Producer } from "kafkajs"
import { Message, Room, User } from "./rooms"
import { WebSocket } from "ws"
import { LAMPORTS_PER_SOL, PublicKey, StakeAuthorizationLayout, Transaction } from "@solana/web3.js"
import { PrismaClient, status } from "@prisma/client"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()


export class RoomManager{
    private static instance:RoomManager
    private rooms:Room[]
    totalUsers:User[]
    private onlineUsers:Map<string,WebSocket>
    private kafka:Kafka
    private producer:Producer
    private prisma:PrismaClient

    private  constructor(){
        this.rooms = []
        this.totalUsers = []
        this.onlineUsers= new Map()
         this.kafka = new Kafka({
            clientId: 'my-app',
            brokers: [process.env.BROKERS||""],
            ssl: {
              ca: [fs.readFileSync('ca.pem', 'utf-8')],
            },
            sasl: {
              mechanism: 'scram-sha-256',
              username: process.env.USERNAME||"",
              password: process.env.PASSWORD||"",
            },
          });
        this.producer = this.kafka.producer()
        this.prisma = new PrismaClient()
    }


    static getInstance(){
        if (!this.instance) {
            this.instance = new RoomManager()
        }
        return this.instance
    }


    // searchUser(seachName:string,userName:string,ws:WebSocket){
    //     const existingRoom = this.rooms.filter((room)=>(room.messenger1.userName===userName)||(room.messenger2.userName===userName))
    // }

  async initializeDb(){
      const users = await this.prisma.user.findMany({
            where:{},
            select:{
                userName:true,
                pubKey:true
            }
        })

        console.log("upper")
        if (users.length) {
            console.log(users.length)
            users.map((t)=>this.totalUsers.push({
                userName:t.userName,
                pubKey:t.pubKey||"",
                status:false
            }))
        }

        console.log(this.totalUsers)

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

        console.log("rroms")
        if (existingRooms.length) {
            console.log(existingRooms.length)
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
        console.log(this.totalUsers)
        if (user) {
            const existingUser = this.rooms.filter((room)=>(room.messenger1.userName===userName)||(room.messenger2.userName===userName))

            if (existingUser) {
                existingUser.map((room)=>{
                    room.messenger1.userName===userName?room.messenger1.status=true:room.messenger2.status=true
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
                        const user  = this.onlineUsers.get(room.messenger1.userName)
                        if (user) {
                            user.send(JSON.stringify({
                                type:"status",
                                status:true,
                                userName:userName,
                                roomId:room.roomId
                            }))
                        }else{
                            this.onlineUsers.get(room.messenger2.userName)?.send(JSON.stringify({
                                type:"status",
                                status:true,
                                userName:userName,
                                roomId:room.roomId
                            }))
                        }
                    }
                })
            }else{
                return
            }   
        }else{  
            console.log(this.totalUsers)
        }
    }

    private formatTime(date:Date):string{

        const formattedDate  = new Date(date).toLocaleDateString('en-US',{
            day:'numeric',
            month:"narrow",
            year:"numeric",
        })

        const formattedTime = new Date(date).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, 
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
        
        console.log(existingRoom)
        if (existingRoom) {
            console.log("double")
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
            console.log("asdasdasdaw")
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

        await this.producer.connect()

            this.producer.send({
                topic:'message',
                messages:[{
                    value:JSON.stringify({
                        type:"newMessage",
                        from,
                        to,
                        value,
                        roomId
                    })
                }]
            })
    }

    async sendSol(from:string , to:string, fromUserId:string,toUserId:string,message:string ,amount:number,signature:string,roomId:string){
        await this.producer.connect()
        this.producer.send({
            topic:"message",
            messages:[{
                value:JSON.stringify({
                    type:"sendSolana",
                    from,
                    to,
                    fromUserId,
                    toUserId,
                    amount,
                    signature,
                    roomId,
                    value:message
                })
            }]
        })

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
    }

    offline(ws:WebSocket){
         this.onlineUsers.forEach((value,key)=>{
            if (value===ws) {
                this.onlineUsers.delete(key)
            }
        })
    }
}