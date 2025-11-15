import { Button } from "@/components/ui/button";
import { createClient as createServer } from "@/utils/supabase/server";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Editor from "@/components/Editor";
import EmotionChart from "@/components/EmotionChart";
import ChartsLine from "@/components/ChartsLine";
import Recomendation from "@/components/Recomendation";
import EngagememtScore from "@/components/EngagememtScore";

export default async function ProfilePage() {
  const supabase = await createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p> Couldnot find ypour account</p>;
  }

  return (
    <div className=" w-screen flex justify-between relative bg-[#F8F8F8] ">
    <SidebarTrigger/>
  
      <div className="flex-2">
          <Editor/>

          </div> 
          <div className="flex-1 mt-8 mx-4">
              <EmotionChart/>
              <ChartsLine/>
              <Recomendation/>
              <EngagememtScore/>


          </div>
                            

    </div>
  );
}
