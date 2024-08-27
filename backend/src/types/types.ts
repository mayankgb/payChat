import {z} from "zod"


enum Request{
    ONLINE="online",
    SENDMESSAGE="sendMessage"

}

export const firstOnline = z.object({
    request:z.string(),
    token:z.string(),
    
})