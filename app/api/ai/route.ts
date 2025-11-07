import { NextResponse } from "next/server";
import { Graph } from '@langchain/langgraph'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph";



const llm = new ChatGoogleGenerativeAI({
    model:'gemini-2.5-flash',
    apiKey:'AIzaSyA1td6t9F-kmG2RbGIXOmXK2Wgnk0uE-jA'
})

const llmenode
 = async (state:typeof MessagesAnnotation.State)=>{
  const response = await llm.invoke(state.messages);
  return { messages: [...state.messages, response] };
}


const graph = new StateGraph(MessagesAnnotation).addNode("llm",llmenode).addEdge("__start__","llm").addEdge("llm","__end__").compile()

export const POST  = async(req:Request)=>{

  const {message} = await req.json()
  const responce = await graph.invoke({messages:[{role:"human",content:message}]})
  const lastMessage = responce.messages[responce.messages.length - 1];


  return NextResponse.json(lastMessage.content)
  

}