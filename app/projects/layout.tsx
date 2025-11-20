import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import Providers from "./provider"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <Providers>
      
        {children}
        </Providers>
        <Toaster/>
      
    </SidebarProvider>
  )
}