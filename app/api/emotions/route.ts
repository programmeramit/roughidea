// app/api/emotion/route.ts
import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";

// Initialize LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMMINI_DATA,
  temperature: 0.7,
});

// Step 1 — Define a node function
async function llmNode(state: typeof MessagesAnnotation.State) {
  const system = "provide me a recommendation of the given text and give how much it engage audience ie {suggestion:text,message:how it can improve }"
  const result = await llm.invoke([
    {
      role:"system",
      content:system
    },
    ...state.messages
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
    messages: [{ role: "user", content: message }]
  });
  console.log(response.messages[0])

  return NextResponse.json(response.messages[0]);
}