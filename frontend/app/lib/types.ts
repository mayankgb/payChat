export interface Data{

    from:string,
    to:string,
    value:string,
    messageType:string,
    amount?:number,
    signature?:string
    Time:string
    Date:string
}

export interface LastMessage {
    from:string,
    to:string
    value:string,
    messageType:string,
    amount?:number
    signature?:string
}




export interface rooms{
    roomID:string,
    friend:string,
    friendPubKey:string
    status:boolean
    lastMessage?:LastMessage
    message?:Data[]
}

export enum MESSAGETYPE{
    SOLANA,
    MESSAGE
}