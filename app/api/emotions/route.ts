import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";
import { z } from "zod";
import { AIMessage } from "@langchain/core/messages";

// --- STEP 1: DEFINE THE JSON SCHEMA ---
// We use Zod to define the exact structure the LLM MUST adhere to.
export const RecommendationSchema = z.object({
  // The specific recommendation text
  recommendation: z.string().describe("The actionable recommendation provided based on the input text."), 
  // A numeric score for audience engagement
  engagement_score: z.number().int().min(1).max(10).describe("A score from 1 (low) to 10 (high) indicating potential audience engagement."),
  previous_score:z.number().describe("the previous text engagement score").min(1).max(10)
}).describe("A structured response providing a content recommendation and its estimated audience engagement score.");


// --- LLM AND GRAPH SETUP ---

// Initialize LLM and bind structured output
// NOTE: Using an empty string for the API key as required by the environment.
const apiKey = ""; // API key will be provided by the runtime environment
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey:  "AIzaSyA1td6t9F-kmG2RbGIXOmXK2Wgnk0uE-jA",
  temperature: 0.1, // Lower temperature for more reliable structured output
});

// Create the structured LLM instance by binding the schema
const structuredLlm = llm.withStructuredOutput(RecommendationSchema);


// --- STEP 2: CREATE THE LLM NODE FUNCTION ---
// This node runs the structured LLM and returns the JSON string in the message content.
async function llmNode(state: typeof MessagesAnnotation.State) {
  // The system instruction now just tells the model what to do, 
  // the schema forces the output format.
  const system = "Analyze the provided user input and generate a relevant recommendation, then estimate its audience engagement score based on the content's novelty, clarity, and utility.also with the given text engagement score"
  
  try {
    // 1. Invoke the structured LLM. It returns a parsed JavaScript object.
    const resultObject = await structuredLlm.invoke([
      {
        role:"system",
        content:system
      },
      ...state.messages // Includes the user's message
    ]);

    // 2. Convert the resulting object into a JSON string for storage in the graph state.
    const jsonString = JSON.stringify(resultObject, null, 2);

    // 3. Return the JSON string as the content of an AI message.
    return { 
      messages: [
        new AIMessage({
            content: jsonString,
            additional_kwargs: {
                structured_data: resultObject 
            }
        })
      ] 
    };
  } catch (error) {
    console.error("Error generating structured output:", error);
    // Return an error message in case of failure
    return {
      messages: [
        new AIMessage({ 
          content: '{"error": "Failed to generate structured response from LLM."}',
          additional_kwargs: {} 
        })
      ]
    };
  }
}

// --- STEP 3: CREATE THE GRAPH ---
const graph = new StateGraph(MessagesAnnotation)
  .addNode("llm", llmNode)
  .addEdge(START, "llm")
  .addEdge("llm", END)
  .compile();

// --- STEP 4: API ENDPOINT ---
export async function POST(req: Request) {
  const { message } = await req.json();

  // Invoke the graph
  const response = await graph.invoke({
    messages: [{ role: "user", content: message }]
  });
  
  // The final output will be the content of the very last message in the history.
  // The graph only has two steps: START (user message) -> llmNode (AI message)
  // So the final AI message is response.messages.slice(-1)[0]
  const finalMessage = response.messages.slice(-1)[0]; 
  const jsonString = finalMessage.content;

  try {
    // Parse the JSON string into a JavaScript object
    const finalJsonObject = JSON.parse(jsonString);

    console.log(finalJsonObject)
    
    // Return the final JavaScript object (NextResponse handles the serialization)
    return NextResponse.json(finalJsonObject);
  } catch (e) {
    console.error("Failed to parse LLM output as JSON:", e);
    // If parsing fails, return a clean error response
    return NextResponse.json({ error: "Invalid JSON format returned by the agent." }, { status: 500 });
  }
}