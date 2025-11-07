// app/api/emotion/route.ts
import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";

// Initialize LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: "AIzaSyA1td6t9F-kmG2RbGIXOmXK2Wgnk0uE-jA",
  temperature: 0.7,
});

// Step 1 — Define a node function
async function llmNode(state: typeof MessagesAnnotation.State) {
  const system = "you are the emotion generater of the sentence. write the sentence of given word in array of 5 tones of joy."
  const result = await llm.invoke([
    {
      role:"system",
      content:system
    }
  ]
  );
  return { messages: [result] };
}

// Step 2 — Create the graph with MessagesAnnotation (✅ valid)
const graph = new StateGraph(MessagesAnnotation)
  .addNode("llm", llmNode)
  .addEdge(START, "llm")
  .addEdge("llm", END)
  .compile();

// Step 3 — API endpoint
export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await graph.invoke({
    messages: [{ role: "user", content: message }],
  });
  console.log(message)

  return NextResponse.json(response);
}