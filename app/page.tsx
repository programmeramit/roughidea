import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
async function page() {
  const supabase = await createClient()
  const {data} = await supabase.from('users').select('*')
  console.log(data)

  return (
    <div>
      <h1>Rough Idea </h1>
      {
        JSON.stringify(data)
      }
      <p>make your rough idea into full emotion idea... </p>
      <Button>hello</Button>
    </div>
  )
}

export default page