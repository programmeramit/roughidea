"use client"

import Image from "next/image";
import { login,signup } from "./actions"
import { Icon } from "lucide-react"
import { redirect, useSearchParams,useRouter } from "next/navigation";
import { useEffect } from "react";

import google from "../../public/google.svg"
import { createClient } from "@/utils/supabase/client";



export default   function LoginPage() {
    const params = useSearchParams();
    const router = useRouter();
  const code = params.get("code");

  useEffect(()=>{
    if(!code) return 
    const handleSignIn = async ()=>{
      const supabase = createClient()

      await supabase.auth.exchangeCodeForSession(window.location.href)

       const { data: { session } } = await supabase.auth.getSession();
      router.push("/dashboard");




    }
    handleSignIn()

  },[code])
 

  const signInWithGoogle = async ()=>{
     const supabase = createClient()

     const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",options:{
redirectTo: `${window.location.origin}/login` 
  }
});
 
  if (error) {
  console.log(error)
  }
  console.log(data)
  }
  return (
    <div className="bg-[linear-gradient(45deg,_#1f2623_0%,_#4f5f59_50%,_#6f7f77_100%)] h-[100dvh] justify-center items-center flex">

        
      <div className="flex md:h-3/4 rounded-[10px] drop-shadow-2xl  w-3/5  bg-[#F4F5F4] items-center justify-between">
      <div className="h-full w-1/2 flex justify-center items-center">
      <div className="bg-[linear-gradient(45deg,_#1f2623_0%,_#4f5f59_50%,_#6f7f77_100%)]  h-5/6 w-3/4 rounded-[10px]">

      </div>
      </div>
      <div className=" h-full w-1/2 flex justify-center items-center">
      <div className="h-5/6  bg-white w-4/5 ">
        <form className="p-4">
          <div className="flex justify-between">
            <div>
              <span className="font-inter text-black opacity-[90%]">Name</span>
              <input type="name" className="hover:outline-none bg-[#F8F8F8] p-2 outline-none rounded-[10px]" placeholder="name"/>
            </div>

            <div>
              <span className="font-inter opacity-90">Email</span>
              <input type="email" className="hover:outline-none bg-[#F8F8F8] p-2 outline-none rounded-[10px]" placeholder="xyz@gmail.com"/>

            </div>
           

          </div>
          <div className="flex flex-col mt-4 gap-4">
            <div>
              <span className="font-inter text-black opacity-[90%]">Password</span>
                         <input type="text" className="w-full hover:outline-none bg-[#F8F8F8] p-2 outline-none rounded-[10px]" placeholder="Password"/>

            </div>
             <div>
              <span className="font-inter text-black opacity-[90%]">Re-Enter Password</span>
                         <input type="text" className="w-full hover:outline-none bg-[#F8F8F8] p-2 outline-none rounded-[10px]" placeholder="Re-Enter Password"/>

            </div>
           </div>
           <div className="flex justify-center items-center w-full mt-8 ">
                       <button className="p-4 bg-[linear-gradient(45deg,_#ABB3AE_0%,_#4A4D4B_100%)] w-3/4 font-bold text-white rounded-[10px] mt-4 ">SignUp</button>

           </div>
           <button className="bg-[#D9D9D9] font-bold p-2 w-full mt-18 rounded-[10px]" onClick={signInWithGoogle} type="button">
            <div className="flex justify-center items-center gap-2">
                  <Image src={google} height={30} width={30} alt="image of google"/>
                  <span className="opacity-60">            Sign in with Google
</span>
            
            </div>
            </button>
        
    </form>
    </div>

      </div>
      

      </div>
  
    </div>
  )
}