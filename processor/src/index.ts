import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";
import fs from "fs"
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { downloadFile } from "./aws";
import dotenv from 'dotenv'
dotenv.config()

interface Message{
    fromId:string,
    to:string,
    message:string

}


interface Transaction {
    senderPubKey:string,
    receiverPubKey:string,
    senderId:string,
    recieverId:string,

}

const prisma = new PrismaClient()

async function main(){

    await downloadFile()

    console.log(process.env.BROKERS)
    console.log(process.env.USERNAME)
    console.log(process.env.PASSWORD)

    const kafka = new Kafka({
        clientId: 'my-app',
                brokers: [process.env.BROKERS||""],
                ssl: {
                  ca: [fs.readFileSync('ca.pem', 'utf-8')],
                },
                sasl: {
                  mechanism:'scram-sha-256',
                  username: process.env.USERNAME||"",
                  password: process.env.PASSWORD||"",
                },
      });

    const consumer = kafka.consumer({groupId:"worker"})

    const TOPIC_NAME = "message"

    await consumer.connect()

    await consumer.subscribe({
        topic:TOPIC_NAME,
        fromBeginning:true
    })

    await consumer.run({
        autoCommit:false,
        eachMessage:async ({topic,partition,message})=>{
            if (message.value) {
                const data = JSON.parse(message.value.toString())
                if (data.type==="newMessage") {
                    console.log(data)
                   const result = await newMessage(data.from,data.to,data.roomId,data.value)
                   console.log(result)
                }else if (data.type==="sendSolana") {
                    console.log(data)
                    const result = await sendSolana(data.from,data.to,data.fromUserId,data.toUserId,
                        data.signature,data.amount,
                        data.roomId,
                        data.value
                    )
                    console.log(result)
                }
                await consumer.commitOffsets([{
                    topic:TOPIC_NAME,
                    partition:partition,
                    offset:(parseInt(message.offset) + 1).toString()
                }])                   
            }
        }
    })
}

main()


async function newMessage(senderId:string,receiverId:string,conversationId:string,value:string):Promise<string> {
   const messageId = await prisma.message.create({
        data:{
            senderId:senderId,
            receiverId:receiverId,
            conversationId:conversationId,
            message:value,
            type:"MESSAGE",
            status:"DELEIVERED",     
        }
    })

    return messageId.id
}

async function sendSolana(from:string,to:string,fromUserId:string,toUserId:string,signature:string,amount:string,roomId:string,value:string):Promise<string>{
    const transactionId = await prisma.transaction.create({
        data:{
            senderId:fromUserId,
            receiverId:toUserId,
            senderKey:from,
            receiverKey:to,
            conversationId:roomId,
            signature:signature,
            amount:parseInt(amount)
        }

        
    })

    const message  = await prisma.message.create({
        data:{
            
            senderId:fromUserId,
            receiverId:toUserId,
            conversationId:roomId,
            message:value,
            type:"SOLANA",
            status:"DELEIVERED",
            amount:parseInt(amount),
            signature:signature
        }
    })

    return transactionId.id
}
