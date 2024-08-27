export interface User {
    name?:string,
    pubKey?:string,
    userName:string
    status:boolean
}


export interface Message {
    from:string,
    to:string,
    value:string,
    messageType:string,
    amount?:number,
    signature?:string
    Time:string
    Date:string
}




export class Room{
    
    roomId:string
    messenger1:User
    messenger2:User
    offlineUser?:User
    message:Message[]

    constructor(user1:User,user2:User,roomId:string){
        this.messenger1 = user1
        this.messenger2 = user2
        this.message = []
        this.roomId = roomId
    }

    

}