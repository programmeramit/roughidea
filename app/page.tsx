import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

async function page() {
  const {data:{session}} =  await(await (createClient())).auth.getSession()




  console.log(session)
  

  return (
    <div className='min-h-[100dvh]'>
      <div className='flex justify-between mx-10 items-center mt-4'>
       <h1 className='font-myanmar text-3xl  text-[#5A6960]'>Rough Idea </h1>
       <div className='flex gap-8 font-bold text-[#536358] items-center'>
        <span className='font-murecho'>Home</span>
        <span className='font-murecho'>Pricing</span>
        <span className='font-murecho'>Support</span>
        <Button className='bg-[#536358] hover:bg-[#536358]'>
          {
            !!session ? <Link href={"/dashboard"}>Dashboard</Link> : <Link href={"/login"}>Login  </Link>

          }

        </Button>
     
       </div>

      </div>
      <div className='flex justify-center'>
        <span className='mt-8 font-murecho font-[1000] md:text-4xl text-2xl'>Know your audience Emotion
           <div className='flex mt-2 justify-center'>
            <span className='font-murecho'>
              Before
            </span>
            <span className='ml-4 font-extrabold text-[#536358]'>
              Publish
            </span>
        </div>
        </span>
       
       

      </div>
      <div className='flex justify-center mt-8 font-murecho text-[#536358] '>
 
          Analyze, feel, and refine your message using emotional intelligence driven by AI.
             </div>
     
     
      <div className="font-ruda absolute bottom-0 -translate-x-1/2 left-1/2 ">
      <Image src={"/hero.png"} alt='hero-image' width={1280} height={720} className='drop-shadow-2xl'/>      </div>
            
    </div>
  )
}

export default page