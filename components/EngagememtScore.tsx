"use client"
import React,{useRef} from 'react'
import { useChatData } from '@/tools/store'
import CountUp from 'react-countup';
function EngagememtScore() {
    const emotions = useChatData((state:any)=>state.emotions)
    const map = useRef(new Set())
    const start = useRef(0)
    let score = Object.values(emotions).reduce((acc,current)=>
    current.label == "neutral" ?acc:acc+current.score*100
  ,0)
  return (
    <div>
      <CountUp
  start={start.current}
  end={Object.values(emotions).reduce((acc,current)=>
    current.label == "neutral" ?acc:acc+current.score*100
  ,0)}
  duration={2.75}
  
>
  {({ countUpRef, start }) => (
    <div>
      <span ref={countUpRef} className={`text-3xl font-bold ${score > 40 ?"text-green-800":''}`}/>
       
    </div>
  )}
</CountUp>
    </div>
  )
}

export default EngagememtScore