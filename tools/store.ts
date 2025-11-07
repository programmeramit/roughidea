import {create} from "zustand"

export const useChatData = create((set)=>({
    emotions:{},
    setState:(data:any)=>set({emotions:data})
}))