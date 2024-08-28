import express, { json } from "express"
import { WebSocketServer } from "ws"
import { loginRouter } from "./routes/login"
import jwt from "jsonwebtoken"
import { RoomManager } from "./roomManager"
import cors from "cors"
import { firstOnline } from "./types/types"
import { downloadFile } from "./aws"
import dotenv from "dotenv"

dotenv.config()


const app = express()

app.use(cors({
    origin:"*"
}))
app.use(express.json())


app.use("/api/user",loginRouter)


async function main(){

    await downloadFile()
    
    await RoomManager.getInstance().initializeDb()

    const httpServer = app.listen(8080) 

    const wss = new WebSocketServer({server:httpServer})

    wss.on("connection",(ws)=>{
        ws.on("error",()=>{
            console.log("somthing went wrong")
            ws.send("asdasd")
        })

        ws.on('message',(data:any)=>{
            try{
                const message = JSON.parse(data)
            const parsedResult = firstOnline.safeParse(message)
            if (!parsedResult.success) {
                return
            }
                const userId =  jwt.verify(message.token,process.env.JWT_SECRET||"secret")
                if(!userId){
                    ws.send("galat hai")
                    return
                    }
                if (message.request==="online") { 
                    RoomManager.getInstance().Online(userId.toString(),ws)

                }
                else if (message.request==="sendMessage") {
                    RoomManager.getInstance().sendMessage(userId.toString(),message.to,message.value)
                }
                else if (message.request==="giveMessage") {
                    RoomManager.getInstance().exisitngMessage(message.roomId,userId.toString(),message.secondUser,ws)
                }else if (message.request==="sendSolana") {
                    RoomManager.getInstance().sendSol(message.from,message.to,userId.toString(),message.toUserId,message.value,message.amount,message.signature,message.roomId)
                }else if (message.request==="searchUser") {
                    if (userId.toString()===message.searchUserName) {
                        return
                    }
                    RoomManager.getInstance().findUser(userId.toString(),message.searchUserName)
                }else if (message.request==="createRoom") {
                    if (userId.toString()===message.to) {
                    return 
                    }
                    RoomManager.getInstance().createRoom(userId.toString(),message.to)
                }
                else{
                    ws.send(JSON.stringify({
                        type:"invalid",
                        message:"not a valid request"
                    }))
                }   
            }catch(e:any){
                ws.send(JSON.stringify({
                    message:"hat bc"
                }))
                console.log(e)
            }
            
        })

        ws.on("close",()=>{
            RoomManager.getInstance().offline(ws)
        })
    })


}

main()