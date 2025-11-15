"use client"
import { useChatData } from '@/tools/store'
import React, { useEffect } from 'react'

function Recomendation() {
    //Getting data from the store ->Zustand
    const emotions = useChatData((state:any)=>state.emotions)


    const fakecall = async(text:String)=>{
        const responce =  fetch("/api/emotions",{
            method:"POST",
            body:JSON.stringify({message:text})
        })
        return responce
    }
    useEffect(()=>{
        Object.values(emotions).map((item:any)=>
        {
            if(item.score > 0.8) return 
            if (item.sentence.length < 5) return
            console.log(item)
            // const res = fakecall(item.sentence).then((res)=>res)
            // console.log({
            //     text:item.sentence,
            //     more_accuracy: res
            // })            
        })
    },[emotions])
  return (
    <div>Recomendation</div>
  )
}

export default Recomendation