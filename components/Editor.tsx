"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

export default function SimpleRichTextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [bold,setbold] = useState(false)
  const [editorPlaceholder,setEditorPlaceholder] = useState(true)

  const [lengthText,setLengthText] = useState(0)
  const buttonRef = useRef(null)
  const [formatState,setFormatState] = useState({
    italic:false,
    bold:false,
    underline:false
  })

  const handleSelection = (e) => {
    e.preventDefault()
    console.log(editorRef.current?.innerText.toString().length)

    const selection = window.getSelection();
    if (!selection || !selection.toString().trim()) {
      setSelectedText("");
      setContextMenu(null);
      return;
    }

    if (!editorRef.current?.contains(selection.anchorNode)) {
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
  console.log(text.length)

    setSelectedText(text);

    // Get selection position
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    editorRef.current?.focus()
    setContextMenu({
      x: rect.left + rect.width / 2,
      y: rect.bottom + window.scrollY + 8,
    });
  };

//update the ui of bold,italic and underline 

const updateToolState = ()=>{
  setFormatState({
    bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
  })
  console.log(formatState)

}

const lengthEditor = ()=>{
  setLengthText(editorRef?.current?.innerText.toString().length || 0)
  if (editorRef?.current?.innerText.toString().length === 1){ setEditorPlaceholder(true); return} 
  setEditorPlaceholder(false)


}


  useEffect(() => {
    // attach only to the editor
    const editor = editorRef.current;
    const buttonref = buttonRef.current;
    if(!buttonref) return 
    if (!editor) return;

    editor.addEventListener("contextmenu", handleSelection);
    editor.addEventListener("input",lengthEditor);
    buttonref.addEventListener("selectionchange",updateToolState);
    return () => {editor.removeEventListener("contextmenu", handleSelection);buttonref.removeEventListener("selectionchange",updateToolState);    editor.removeEventListener("input",lengthEditor)
};
  }, []);

  // Text formatting (bold, italic, etc.)
  const formatText = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div className="relative p-6">
      <h2 className="mb-2 font-semibold text-lg">Simple Rich Text Editor</h2>

      {/* Toolbar */}
      <div className="mb-3 flex gap-2">
        <Button size="sm" onClick={() =>{ formatText("bold");updateToolState();
}} className={formatState.bold ? "bg-red-300 hover:bg-red-400":""} ref={buttonRef}>Bold</Button>
        <Button size="sm" onClick={() => formatText("italic")} ref={buttonRef}>Italic</Button>
        <Button size="sm" onClick={() => formatText("underline")} ref={buttonRef}>Underline</Button>
        <Button size="sm" onClick={() => formatText("undo")} ref={buttonRef}>Undo</Button>
        <Button size="sm" onClick={() => formatText("redo")} ref={buttonRef}>Redo</Button>
        {
          lengthText
        }
      </div>

      {/* Editable Area */}
      <div className="relative">
       {editorPlaceholder && (
        <span className="absolute text-gray-400 pointer-events-none select-none top-4 left-5">
          Type something here...
        </span>
      )}
      <div
        ref={editorRef}
        contentEditable
        className="border border-gray-300 bg-white p-4 rounded-lg  focus:outline-none shadow-sm selection:bg-pink-100 h-[80vh] overflow-auto"
        style={{ whiteSpace: "pre-wrap" }}
        

      >
      
      </div>
      </div>

      {/* Context Menu (only appears inside editor) */}
      {contextMenu && selectedText && (
        <div
          className="absolute bg-white border rounded-lg shadow-lg px-3 py-2 text-sm flex flex-col"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            transform: "translate(-50%, 0)",
            zIndex: 50,
          }}
        >
          <p className="text-gray-400">Edit or Review</p>
        
          
          <button
            onClick={() => setContextMenu(null)}
            className="hover:bg-gray-100 rounded px-2 py-1 text-left"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Selected Text Info */}
      <div className="mt-3 text-sm text-gray-500">
        <strong>Selected Text:</strong> {selectedText || "<none>"}
      </div>
    </div>
  );
}
