import { Button } from "@/components/ui/button";
import { createClient as createServer } from "@/utils/supabase/server";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Editor from "@/components/Editor";
import EmotionChart from "@/components/EmotionChart";
import Chat from "@/components/Chat";
import Recomendation from "@/components/Recomendation";
export default async function ProfilePage() {
  const supabase = await createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p> Couldnot find ypour account</p>;
  }

  return (
    <div className=" w-screen flex justify-between relative">
    <SidebarTrigger/>
  
      <div className="flex-2">
          <Editor/>

          </div> 
          <div className="flex-1">
              <EmotionChart/>
              <Recomendation/>


          </div>
                            

    </div>
  );
}
