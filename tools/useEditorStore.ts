import {create } from "zustand"


export const useEditorStore = create((set)=>({
editorRef:null,
setEditorRef:(ref:any)=>set({editorRef:ref})
}))