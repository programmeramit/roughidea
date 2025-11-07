"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";


type Message = {
  role: "user" | "bot";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null)

  

  const handleSend = async () => {
    if (!inputRef.current?.value.trim()) return;

    const userText = inputRef.current.value.trim();

  

    // Push user message
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    inputRef.current.value = "";
    setLoading(true);

    // Scroll down
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      console.log(data)
      const botText =
      data ??
        "⚠️ Sorry, I couldn’t process your request.";

      setMessages((prev) => [...prev, { role: "bot", content: botText }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const handleSuggestion = (text: string) => {
    if (inputRef.current) {
      inputRef.current.value = text;
      inputRef.current.focus();
    }
  };

  useEffect(()=>{
      inputRef.current?.addEventListener('keydown',(e)=>{
        if(e.key === "Enter"){
          buttonRef.current?.click()
          inputRef.current?.focus()
        }
      })

      return ()=> inputRef.current?.removeEventListener('keydown',()=>{console.log("chat componnet is unmount")})
  },[])

  return (
    <div className="flex-1 h-[100dvh] bg-gray-100 text-gray-100 flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-full m-2">
        {messages.length === 0 ? (
          <div className="flex gap-4 justify-center mt-20">
            <div
              className="bg-gray-600 text-white p-4 rounded-2xl cursor-pointer"
              onClick={() => handleSuggestion("Idea for an Instagram post")}
            >
              Idea for an Instagram post
            </div>
            <div
              className="bg-gray-600 text-white p-4 rounded-2xl cursor-pointer"
              onClick={() => handleSuggestion("Create an emotional Twitter post")}
            >
              Create an emotional Twitter post
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[70%] p-3 rounded-2xl whitespace-pre-wrap prose prose-invert ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-100 text-gray-900 self-start"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          ))
        )}

        {/* Loader bubble */}
        {loading && (
          <div className="flex items-center gap-2 bg-gray-100 text-gray-900 p-3 rounded-2xl w-fit animate-pulse">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-4 flex justify-center w-full">
        <div className="flex gap-2 w-[400px]">
          <input
            type="text"
            ref={inputRef}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-2xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading} ref={buttonRef}>
            {loading ? "..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
