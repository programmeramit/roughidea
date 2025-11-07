"use client"
import { useChatData } from '@/tools/store'
import React, { useEffect } from 'react'

function Recomendation() {
    const emotions = useChatData((state:any)=>state.emotions)
    console.log("mounted the  recommendation system")

    const fakecall = async()=>{

        const responce = setTimeout(()=>"HELLO",1000)
        const randomNumber = Math.random()*100
        return randomNumber


    }

    useEffect(()=>{
        Object.values(emotions).map((item:any)=>
        {
            if(item.score > 0.8) return 
            if (item.sentence.length < 5) return
            console.log(item)
            const res = fakecall().then((res)=>res)
            console.log({
                text:item.sentence,
                more_accuracy: res
            })            
        })
    },[emotions])
  return (
    <div>Recomendation</div>
  )
}

export default Recomendation