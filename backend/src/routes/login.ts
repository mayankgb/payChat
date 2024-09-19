import { Prisma, PrismaClient } from "@prisma/client"
import express from "express"
import jwt from "jsonwebtoken"
import { string, z } from "zod"
import { RoomManager } from "../roomManager"
import dotenv from "dotenv"

dotenv.config()

export const loginRouter = express.Router()


const loginInput  = z.object({
    userName:z.string().min(3,{message:"userId should present"}),
    password:z.string().min(6),
})


const signUpInput = z.object({
    userName:z.string().min(3,{message:"userId should present"}),
    password:z.string().min(6),
    name:z.string().optional(),
    pubKey:z.string().min(44).max(44),
})

const prisma = new PrismaClient()

loginRouter.post("/login",async(req,res)=>{

    const body = req.body.userInput
    const parsedResult = loginInput.safeParse(body)
     
    if (!parsedResult.success) {
        return res.status(400).json({
            message:"Invalid inputs",
            errors:parsedResult.error.errors
        })
    }

    const existingUser = await prisma.user.findFirst({
        where:{
            userName:parsedResult.data.userName
        },
        select:{
            password:true,
            pubKey:true,
            userName:true
        }
    })

    if (!existingUser) {
        return res.status(404).json({
            message:"no user present"
        })
    }

    if (existingUser.password!==parsedResult.data.password) {
        return res.status(401).json({
            message:"Unauthorized access"
        })
    }

    if (RoomManager.getInstance().onlineUsers.has(existingUser.userName)) {   
        return res.status(400).json({
            message:"you are logged in another place"
        })
    }

    const token = jwt.sign(existingUser.userName,process.env.JWT_SECRET||"secret")

    return res.status(200).json({
        jwt:token
    })

})


loginRouter.post("/signup",async (req,res)=>{

    const body = req.body.userInput

    const parsedResult = signUpInput.safeParse(body)

    if (!parsedResult.success) {
        return res.status(400).json({
            message:"invalid inputs",
            errors:parsedResult.error.errors
        })
    }
    
    const existingUserName = await prisma.user.findFirst({
        where:{
            userName:parsedResult.data.userName
        },
        select:{
            pubKey:true
        }
    })

    if (existingUserName) {
        if (existingUserName.pubKey === parsedResult.data.pubKey) {
           return res.json(400).json({
            message:"user already exists with this publicKey"
           })
        }
        return res.status(400).json({
            message:"userName already exists! please try another username "
        })
    }

    const newUser = await prisma.user.create({
        data:{
            userName:parsedResult.data.userName,
            password:parsedResult.data.password,
            name:parsedResult.data.name,
            pubKey:parsedResult.data.pubKey
        }
    })

    const token = jwt.sign(newUser.userName,process.env.JWT_SECRET||"secret")

    RoomManager.getInstance().totalUsers.push({
        userName:newUser.userName,
        pubKey:newUser.pubKey||"",
        status:true
    })

    return res.status(200).json({
        jwt:token,
    })
})

loginRouter.get("/transaction",async(req,res)=>{

    try {
        
        const token = req.headers.authorization

    if (!token) {
        return res.status(404).json({
            message:"you are not logged"
        })
    }

    const userName:string = jwt.verify(token||"",process.env.JWT_SECRET||"secret").toString()

    const transaction = await prisma.user.findFirst({
        where:{
            userName:userName
        },
        select:{
            sendingTransaction:{
                orderBy:{
                    date:"desc"
                },
                select:{
                    amount:true,
                    date:true,
                    receiverId:true,
                    signature:true
                }   
            },

            receiverTransaction:{
                orderBy:{
                    date:"desc"
                },
                select:{
                    amount:true,
                    date:true,
                    senderId:true,
                    signature:true
                }   
            }
            
        }
    })

    if (transaction?.sendingTransaction.length||transaction?.receiverTransaction.length) {
        return res.status(200).json({
            transaction
        })
    }
    else{
        return res.status(404).json({
            message:"no transaction found"
        })
    }
        
    } catch (error) {
        return res.status(400).json({
            message:"something went wrong"
        })
    }

    

})


loginRouter.get("/me",async(req,res)=>{

    const token = req.headers.authorization
    try{
        const userName =  jwt.verify(token||"",process.env.JWT_SECRET||"secret").toString()

        if (userName) {
            return res.status(200).json({
                message:`Welcome ${userName}`
            })
        }
        else{
            return res.status(404).json({
                message:"Unauthorised accesss"
            })
        }

    }catch(e){
        console.log(e)

        return res.status(400).json({
            message:"unauthorised access"
        })
    }

})

loginRouter.get("/ping",async(req,res)=>{
    return res.json({
        messsage:"done"
    })
})