import { NextResponse } from "next/server";
import { StateGraph, Annotation, START, END } from '@langchain/langgraph'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'


const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash',
  apiKey: process.env.GOOGLE_API_KEY,
})

// Define the state using Annotation
const StateAnnotation = Annotation.Root({
  message: Annotation<string>,
  reply: Annotation<string>,
})

const app = new StateGraph(StateAnnotation)
  .addNode("greeter", async (state) => {
    const msg = state.message
    const res = await llm.invoke(`Say hi to: ${msg}`)
    return { reply: res.content as string }
  })
  .addEdge(START, "greeter")
  .addEdge("greeter", END)
  .compile()


export const POST = async (req: Request) => {

  const { message } = await req.json()
  // Initialize with default values if needed
  const result = await app.invoke({ message, reply: "" })
  return NextResponse.json(result)

}