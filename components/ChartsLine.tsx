"use client"
import React,{useEffect, useRef} from 'react'
import * as  d3 from "d3"
import { useChatData } from '@/tools/store'
function ChartsLine() {
    //Using the variable from the zustand
    const emotions = useChatData((state:any)=>state.emotions)

    //Ref of the SVG
    const line_ref = useRef(null)

    //Running the chart every time data is change in editor
    useEffect(()=>{
      //Get the current data 
      const datas = Object.values(emotions).map((data:any)=>Math.round(data.score*100))

      //Assiging the width,height and barwidth
      const width = 500;
      const height = 300;
      const barWidth = width / datas.length;

      //Clear the previous elements of SVG
      d3.select(line_ref.current).selectAll("*").remove()

      //making the range 
      const range = d3.scaleLinear().domain([0,d3.max(datas)]).range([height,0])
      
      //Creating the bar chart 
      const svg = d3.select(line_ref.current).attr("width", width)
      .attr("height", height);
      svg.selectAll("rect")
        .data(datas)
        .enter()
        .append("rect")
        .attr("x", (d:Number, i:Number) => i * barWidth)
        .attr("y", (d:Number) => range(d))
        .attr("width", barWidth - 5)
        .attr("height", (d:Number) => d)
        .attr("fill", "green")

    },[emotions]) //Assign the dependency variable



  return (
    <div>ChartsLine
        <svg className='' ref={line_ref}>
            
        </svg>
        
    </div>
  )
}

export default ChartsLine