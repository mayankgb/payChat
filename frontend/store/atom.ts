
import { rooms } from "@/app/lib/types";
import { atom } from "recoil";

export const wss = atom<WebSocket|null>({
    key:"socket",
    default:null
})

export const index = atom<number>({
    key:"index",
    default:0
})

export const sol = atom<boolean>({
    key:"sol",
    default:false
})

export const open = atom<boolean>({
    key:"open",
    default:false
})

export const backend = atom<rooms[]>({
    key:"backend",
    default:[]
})

export const component = atom<number>({
    key:"component",
    default:0
})

export const searchUser = atom<string>({
    key:"searchUser",
    default:""
})