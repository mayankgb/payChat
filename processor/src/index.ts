import { PrismaClient } from "@prisma/client";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { downloadFile } from "./aws";
import dotenv from 'dotenv';
import { Redis } from "ioredis";

dotenv.config();

interface Message {
    fromId: string;
    to: string;
    message: string;
}

interface Transaction {
    senderPubKey: string;
    receiverPubKey: string;
    senderId: string;
    receiverId: string;
}

const prisma = new PrismaClient();

const redis = new Redis({
    host: process.env.BROKERS,
    password: process.env.PASSWORD,
    port: 15268,
    db: 0,
});

const streamName = 'messageStream';
const groupName = 'messageGroup';
const consumerName = 'consumer1';

// Function to setup the Redis Stream and Consumer Group
async function setupStreamAndGroup() {
    try {
        await redis.xgroup('CREATE', streamName, groupName, '$', 'MKSTREAM');
    } catch (err) {
       console.log(err)
    }
}

// Function to process messages from the Redis Stream
async function processStreamMessages() {
    while (true) {
        const response = await redis.xreadgroup(
            'GROUP',
            groupName,          // Consumer group name
            consumerName,       // Consumer name
            'BLOCK', 0,         // Block indefinitely until new messages arrive
            'STREAMS',
            streamName,
            '>'                 // Read new messages
        )as [string, [string, string[]][]][];;

        if (!response) {
            continue;
        }
        console.log(response)

        
        for (const [stream, messages] of response) {
            for (const [messageId, fields] of messages) {
                const data = parseStreamData(fields);
                console.log(data)

                if (data.type === 'newMessage') {
                    console.log('Processing new message:', data);
                    const result = await newMessage(data.from, data.to, data.roomId, data.value);
                    console.log('Message stored with ID:', result);
                } else if (data.type === 'sendSolana') {
                    console.log('Processing Solana transaction:', data);
                    const result = await sendSolana(
                        data.from,
                        data.to,
                        data.fromUserId,
                        data.toUserId,
                        data.signature,
                        data.amount,
                        data.roomId,
                        data.value
                    );
                    console.log('Transaction stored with ID:', result);
                }

                // Acknowledge the message after processing
                await redis.xack(streamName, groupName, messageId);
                console.log("done")
            }
        }
    }
}

// Helper function to parse the fields from the Redis Stream
function parseStreamData(fields: string[]): any {
    const data: any = {};
    for (let i = 0; i < fields.length; i += 2) {
        data[fields[i]] = fields[i + 1];
    }
    return data;
}

// Function to handle new message logic
async function newMessage(senderId: string, receiverId: string, conversationId: string, value: string): Promise<string> {
    const messageId = await prisma.message.create({
        data: {
            senderId: senderId,
            receiverId: receiverId,
            conversationId: conversationId,
            message: value,
            type: "MESSAGE",
            status: "DELEIVERED",
        }
    });

    return messageId.id;
}

// Function to handle sending Solana transactions
async function sendSolana(
    from: string,
    to: string,
    fromUserId: string,
    toUserId: string,
    signature: string,
    amount: string,
    roomId: string,
    value: string
): Promise<string> {
    const transactionId = await prisma.transaction.create({
        data: {
            senderId: fromUserId,
            receiverId: toUserId,
            senderKey: from,
            receiverKey: to,
            conversationId: roomId,
            signature: signature,
            amount: parseInt(amount)
        }
    });

    const message = await prisma.message.create({
        data: {
            senderId: fromUserId,
            receiverId: toUserId,
            conversationId: roomId,
            message: value,
            type: "SOLANA",
            status: "DELEIVERED",
            amount: parseInt(amount),
            signature: signature
        }
    });

    return transactionId.id;
}

// Main function to setup and process messages
async function main() {
    await setupStreamAndGroup();
    await processStreamMessages();
}

main();
