import Image from "next/image";

interface size {
    size : Number | String | any 
}


const Ai = ({size}:size)=>{
    return (
        <Image src={"/ai.svg"} sizes={size} height={size} width={size} alt="ai"/>
    )
}
const Italic = ({size}:size)=>{
    return (
        <Image src={"/italic.svg"} sizes={size} height={size} width={size} alt="ai"/>
    )
}
const Redo = ({size}:size)=>{
    return (
        <Image src={"/redo.svg"} sizes={size} height={size} width={size} alt="ai"/>
    )
}
const Undo = ({size}:size)=>{
    return (
        <Image src={"/undo.svg"} sizes={size} height={size} width={size} alt="ai"/>
    )
}
const Underline = ({size}:size)=>{
    return (
        <Image src={"/underline.svg"} sizes={size} height={size} width={size} alt="ai"/>
    )
}


export {
    Ai,
    Italic,
    Undo,
    Redo,
    Underline,

}