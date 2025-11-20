"use client"

import Image from "next/image";

import { redirect, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import google from "../../public/google.svg"
import { createClient } from "@/utils/supabase/client";



export default function LoginPage() {
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get("code");

  useEffect(() => {
    if (!code) return
    const handleSignIn = async () => {
      const supabase = createClient()

      await supabase.auth.exchangeCodeForSession(window.location.href)

      const { data: { session } } = await supabase.auth.getSession();
      router.push("/projects");




    }
    handleSignIn()

  }, [code])


  const signInWithGoogle = async () => {
    const supabase = createClient()
    // 
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google", options: {
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
      <div className="flex flex-col rounded-[10px] drop-shadow-2xl w-full max-w-md bg-[#F4F5F4] items-center justify-center p-8 m-4">
        <h1 className="text-2xl font-bold mb-8 text-[#1f2623]">Welcome Back</h1>
        <button
          className="bg-white hover:bg-gray-50 border border-gray-200 font-bold p-4 w-full rounded-[10px] transition-colors duration-200"
          onClick={signInWithGoogle}
          type="button"
        >
          <div className="flex justify-center items-center gap-3">
            <Image src={google} height={24} width={24} alt="Google logo" />
            <span className="text-gray-700">Sign in with Google</span>
          </div>
        </button>
      </div>
    </div>
  )
}