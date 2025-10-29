import { NextResponse } from "next/server";

export async function POST(req:Request){
    const {message} = await req.json()
    const res = await fetch("https://cloud.olakrutrim.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.KRUTRIM_API_KEY}`,
    },
    body: JSON.stringify({
      model: "Qwen3-32B",
      messages: [{ role: "user", content: message }],
    }),
  });
  const data = await res.json()
  return NextResponse.json(data)
}