"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ContextMenu from "./ContextMenu";
import { useEditorStore } from "@/tools/useEditorStore";
import * as d3 from "d3";
import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatData } from "@/tools/store";
import { createClient } from "@/utils/supabase/client";


// ----------- Types -----------
type EmotionLabel = string;
interface EmotionResult {
  sentence: string;
  label: EmotionLabel;
  score: number;
  hash: number;
}
type CacheMap = Map<string, EmotionResult>;

// ----------- Component -----------
export default function SimpleRichTextEditor(): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [editorPlaceholder, setEditorPlaceholder] = useState(true);
  const [lengthText, setLengthText] = useState(0);
  const [name,setname] = useState("")
  const supabase = createClient()


  useEffect(()=>{
    const fetchUser = async ()=>{
      const {data:{session}} = await createClient().auth.getSession()

      setname(session?.user.email || "")

      console.log(session)
    }
    fetchUser()
  },[])

  const saveToDatabase = async () =>{
    const id = (await supabase.auth.getUser()).data.user?.id
    const {data,error} = await supabase.from('Projects').insert({
      title:'this is frontemd title',
      content:'this is content and cool content from frontend',
      user: id
    })

    console.log(error)

  }
 
  // ✅ Zustand store
  const emotions = useChatData((state:any) => state.emotions);
  const setState = useChatData((state:any) => state.setState);

  const [formatState, setFormatState] = useState({
    italic: false,
    bold: false,
    underline: false,
  });


  const processCache = useRef<CacheMap>(new Map());
  const pipelineRef = useRef<any | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const setEditorRef = useEditorStore((state: any) => state.setEditorRef);

  // ----------- Helper functions -----------
  const splitSentences = (text: string): string[] =>
    text
      .split(/[.?!]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const getHash = (s: string): number => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

useEffect(()=>{

toast.promise( new Promise(async (resolve)=>{
  const pipe = await pipeline(
          "text-classification",
          "nicky48/emotion-english-distilroberta-base-ONNX",
          {
            dtype: "q4",
          }
        );
        resolve(pipe)
        pipelineRef.current = pipe;
        console.info("✅ HF pipeline ready");
      }
      ),{
        loading:"Loading Model ....",
        success:"Model is succesfully loaded",
        error:"Please check your internet connection"

      }
      )



},[])

  // ----------- Call AI Model -----------
  const callPipeline = async (sentence: string): Promise<EmotionResult | null> => {
    if (!pipelineRef.current) return null;
    try {
      const res = await pipelineRef.current(sentence);
      const best = Array.isArray(res) ? res[0] : res;
      return {
        sentence,
        label: best.label,
        score: Number(best.score) || 0,
        hash: getHash(sentence),
      };
    } catch (err) {
      console.error("Pipeline error:", err);
      return null;
    }
  };

  // ----------- Debounced Text Processing -----------
  const processText = async (): Promise<void> => {
    const divText = editorRef.current?.innerText || "";
    const sentences = splitSentences(divText);

    for (const [key] of Array.from(processCache.current.entries())) {
      if (!sentences.includes(key)) {
        processCache.current.delete(key);
      }
    }

    const toAnalyze: string[] = [];
    for (const sentence of sentences) {
      const cached = processCache.current.get(sentence);
      const hash = getHash(sentence);
      if (!cached || cached.hash !== hash) {
        toAnalyze.push(sentence);
      }
    }

    for (const sentence of toAnalyze) {
      const result = await callPipeline(sentence);
      if (result) processCache.current.set(sentence, result);
    }

    // ✅ Store in Zustand
    const uiObj: Record<string, EmotionResult> = {};
    processCache.current.forEach((v, k) => (uiObj[k] = v));
    setState(uiObj);
  };

  const debouncedProcessText = (): void => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      void processText();
    }, 600);
  };

  // ----------- Update word count + trigger analysis -----------
  const handleEditorInput = () => {
    const len = editorRef.current?.innerText.toString().length || 0;
    setLengthText(len);
    setEditorPlaceholder(len === 0);
    debouncedProcessText();
  };

  // ----------- Toolbar & selection -----------
  const updateToolState = () => {
    setFormatState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  const handleSelection = (e: MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (!selection || !selection.toString().trim()) {
      setSelectedText("");
      setContextMenu(null);
      return;
    }
    if (!editorRef.current?.contains(selection.anchorNode as Node)) {
      setSelectedText("");
      setContextMenu(null);
      return;
    }
    const text = selection.toString();
    if (text.length < 2) {
      setSelectedText("");
      setContextMenu(null);
      return;
    }
    setSelectedText(text);
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setContextMenu({
      x: rect.left + rect.width / 2,
      y: rect.bottom + window.scrollY + 8,
    });
  };


  // ----------- Setup listeners -----------
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.addEventListener("input", handleEditorInput);
    editor.addEventListener("contextmenu", handleSelection);
    document.addEventListener("selectionchange", updateToolState);
    return () => {
      editor.removeEventListener("input", handleEditorInput);
      editor.removeEventListener("contextmenu", handleSelection);
      document.removeEventListener("selectionchange", updateToolState);
    };
  }, []);

  // ----------- Toolbar actions -----------
  const formatText = (command: string) => {
    document.execCommand(command, false, null);
    updateToolState();
  };

  // ----------- Render UI -----------
  return (
    <div className="relative p-6">
      <input type="text" className="bg-white mb-3 p-2 rounded-xl w-full focus:outline-0" placeholder="Enter your Headline...."/>
        
      {/* Toolbar */}
      <div className="mb-3 flex gap-2 bg-white p-2 rounded-2xl justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => formatText("bold")}
            className={`bg-white text-black ${formatState.bold ? "bg-gray-200" : ""}`}
          >
            <b>B</b>
          </Button>
          <Button
            size="sm"
            onClick={() => formatText("italic")}
            className={`bg-white text-black ${formatState.italic ? "bg-gray-200" : ""}`}
          >
            <i>I</i>
          </Button>
          <Button
            size="sm"
            onClick={() => formatText("underline")}
            className={`bg-white text-black ${formatState.underline ? "bg-gray-200" : ""}`}
          >
            <u>U</u>
          </Button>
          <Button onClick={saveToDatabase}>
            Save
          </Button>
        </div>
        <div className="text-sm">{lengthText === 0 ? "" : `words ${lengthText}`}</div>
      </div>

      {/* Editable area */}
      <div className="relative">
        {editorPlaceholder && (
          <span className="absolute text-gray-400 pointer-events-none select-none top-4 left-5">
            Enter your idea here...
          </span>
        )}
        <div
          ref={editorRef}
          contentEditable
          className=" bg-white p-4 rounded-lg focus:outline-0  h-[60vh] o selection:bg-pink-100 selection:text-pink-950"
          style={{ whiteSpace: "pre-wrap" }}
        ></div>
      </div>

      {contextMenu && selectedText && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} trigger={setContextMenu} />
      )}

      {/* Emotion results */}
      <div className="mt-5">
        <h3 className="font-semibold">Emotion Analysis Cache</h3>
        {Object.keys(emotions).length === 0 ? (
          <p className="text-sm text-gray-400">No sentences analyzed yet.</p>
        ) : (
          <ul className="list-disc pl-5 mt-2 text-sm">
            {Object.entries(emotions).map(([sentence, res], i) => (
              <li key={i}>
                <strong>
                  <Tooltip>
                    <TooltipTrigger>{`s${i + 1}`}</TooltipTrigger>
                    <TooltipContent>
                      <p>{res.sentence}</p>
                    </TooltipContent>
                  </Tooltip>
                </strong>
                : <span className="text-blue-600">{res.label}</span>{" "}
                ({Math.round(res.score * 100)}%)
              </li>
            ))}
          </ul>
        )}
      </div>
   {/* Emotion graph */}

    </div>
  );
}
