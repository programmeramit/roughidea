import { createBrowserClient } from "@supabase/ssr";

export function createClient(){
    return createBrowserClient(
            "https://prnopoxndhdgyjjrlwuu.supabase.co",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybm9wb3huZGhkZ3lqanJsd3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NTA4NjYsImV4cCI6MjA3NjQyNjg2Nn0.rMFE5bpuigyWdp-l-B_IbgBfbdwbOFmisyZt__Im0ck",


    )
}