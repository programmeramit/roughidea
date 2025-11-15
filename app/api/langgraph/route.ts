import { NextResponse } from "next/server";
import { Graph } from '@langchain/langgraph'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'


const llm = new ChatGoogleGenerativeAI({
    model:'gemini-1.5-flash',
    apiKey:'AIzaSyA1td6t9F-kmG2RbGIXOmXK2Wgnk0uE-jA'
})

const graph = new Graph()
graph.addNode("greeter", async (inputs) => {
  const msg = inputs.message
  const res = await llm.invoke(`Say hi to: ${msg}`)
  return { reply: res.content }
}).compile()


export const GET = async  (req:Request)=>{

    const { message } = await req.json()
  const result = await graph.invoke({ message })
  return NextResponse.json(result)

}