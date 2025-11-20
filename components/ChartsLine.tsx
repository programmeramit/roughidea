"use client"
import React, { useEffect, useRef } from 'react'
import { useChatData } from '@/tools/store'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import ProgressBar from '@ramonak/react-progress-bar'
import { Button } from './ui/button'

function ChartsLine() {
  //Using the variable from the zustand
  const emotions = useChatData((state: any) => state.emotions)
  const ref = useRef(null)


  interface Emotion {
    sentence: string;
    label: string;
    score: number;
  }

  interface emotionColors {
    [key: string]: string;
  }

  const emotionColors: emotionColors = {
    anger: "coral",       // soft red
    disgust: "green",     // pale green
    fear: "slategray",    // muted gray-blue
    joy: "yellow",        // warm happy yellow
    neutral: "gray",      // balanced neutral gray
    sadness: "lightblue",      // soft blue
    surprise: "pink"      // bright unexpected pink
  };

  const sum = (Object.values(emotions) as any[]).reduce(
    (total: number, { score }: { score: number }) => total + score,
    0
  )
  const length = Object.values(emotions).length

  const number = Math.round(sum * 100 / length)



  return (
    <div className='mt-8 font-murecho'>
      <span className='font-bold text-xl'>
        Analysis
      </span>
      {/* Emotion results */}
      <div className="mt-5">
        <h3 className="font-semibold">Emotion Analysis Cache</h3>
        {Object.keys(emotions).length === 0 ? (
          <p className="text-sm text-gray-400">No sentences analyzed yet.</p>
        ) : (
          <ul className="list-disc pl-5 mt-2 text-sm">
            {(Object.entries(emotions) as any[]).map(([sentence, res], i) => (
              <li key={i}>
                <strong>
                  <Tooltip>
                    <TooltipTrigger>{`s${i + 1}`}</TooltipTrigger>
                    <TooltipContent>
                      <p>{res.sentence}</p>
                    </TooltipContent>
                  </Tooltip>
                </strong>
                {res.sentence} : <span >{res.label}</span>{" "}
                <ProgressBar completed={Math.round(res.score * 100)} bgColor={emotionColors[res.label]} width={"300px"} height={"10px"} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='mt-4'>
        <span className='text-xl opacity-60'>
          Total Engagement Score
        </span>
        <br />
        <span className='mx-2 font-bold text-2xl' ref={ref}>

          {
            number
          }

        </span>



      </div>

      {/* Emotion graph */}

    </div>
  )
}

export default ChartsLine