"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

import Partone from "@/components/Partone"
import Parttwo from "@/components/Parttwo"

import {
  Youtube,
  FileText,
  BookOpen,
  Globe,
  Rss,
  MessageCircle,
} from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"

function Page() {
  const { register, handleSubmit, watch, setValue } = useForm({
    shouldUnregister: true,
    defaultValues: {
      firstName: '',
      source: '',
      url: ''
    }
  })
  const selected = watch("source")
  console.log(selected)



  // Multi-step screen state
  const [screen, setScreen] = useState(<Partone />)
  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const supabase = createClient()
      const user = (await supabase.auth.getUser()).data.user

      const { data: projects } = await supabase
        .from("Projects")
        .select("title,id")
        .eq("user", user?.id)
      return {
        email: user?.email,
        data: projects
      }

    },
    staleTime: 1000 * 60 * 5,

  })




  const OPTIONS = [
    { id: "youtube", label: "YouTube", icon: Youtube },
    { id: "medium", label: "Medium", icon: FileText },
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "web", label: "Website", icon: Globe },
    { id: "rss", label: "RSS", icon: Rss },
    { id: "reddit", label: "Reddit", icon: MessageCircle },
  ]


  return (
    <div className="h-[100dvh] bg-[#F8F8F8] w-full">

      {/* -------------------- Dialog -------------------- */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>

        <DialogContent className="max-w-8xl rounded-xl p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              User Information
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Fill the details below
            </DialogDescription>
          </DialogHeader>

          {/* FORM */}
          <form
            className="space-y-4 mt-4"
            onSubmit={handleSubmit((e) => console.log(e))}
          >
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">First Name</label>
              <input
                {...register("firstName")}
                className="w-full rounded-md border bg-muted px-3 py-2 text-sm"
                placeholder="Enter first name"
              />
            </div>


            <div className="grid grid-cols-3 gap-4">
              {OPTIONS.map((opt) => {
                const Icon = opt.icon
                const active = selected === opt.id

                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setValue("source", opt.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all",
                      "hover:bg-accent hover:text-accent-foreground",
                      active
                        ? "border-primary bg-primary/10 ring-2 ring-primary"
                        : "border-muted"
                    )}
                  >
                    <Icon className={cn("h-6 w-6", active && "text-primary")} />
                    <span className="text-sm">{opt.label}</span>
                  </button>
                )
              })}
            </div>
            {
              selected === "blog" && (
                <div className="my-4 ">
                  <span>Enter the url </span>
                  <input {...register("url")} className="w-full rounded-md border bg-muted px-3 py-2 text-sm"
                  />
                </div>
              )
            }

            {/* Dynamic Multi-Step Component */}
            <div className="pt-2">{screen}</div>

            {/* Switch Screen */}
            <Button
              type="button"
              className="w-full"
              variant="secondary"
              onClick={() => setScreen(<Parttwo />)}
            >
              Change Screen
            </Button>

            {/* Submit */}
            <DialogFooter>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------- PAGE CONTENT -------------------- */}
      <div className="flex flex-col p-4 mt-6">
        <span className="font-myanmar text-2xl opacity-60">
          Welcome Back
        </span>

        <span className="mt-1">{data?.email}</span>

        {data && data?.data?.map((item, i) => (
          <div key={i} className="mt-3">
            <div className="font-medium">{item.title}</div>
            <Link href={{
              pathname: `/projects/${item.id}`,
              query: {
                title: item.title
              }
            }}
              className="text-blue-600 underline">
              View Project
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
