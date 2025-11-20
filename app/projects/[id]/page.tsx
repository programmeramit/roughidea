import React from 'react'
import Editor from "@/components/Editor";
import ChartsLine from '@/components/ChartsLine';

async function page({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params
  const { title } = await searchParams


  console.log(await searchParams)

  return (
    <div className='bg-[#F8F8F8] flex w-full'>
      <div className='flex-4'>

        <Editor id={id} title={Array.isArray(title) ? title[0] : title || ''} />

      </div>
      <div className='md:flex-1 md:block hidden'>
        <ChartsLine />

      </div>


    </div>
  )
}

export default page