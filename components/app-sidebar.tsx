"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Clock,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export async function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter()
  const supabase = await createClient()

  const logout = async()=>{
    const {error} = await supabase.auth.signOut()
    router.push("/")
  }
  return (
    <Sidebar className="bg-green-300">
      {/* Header */}
      <SidebarHeader
        className={`px-5 py-4 border-b border-gray-200/60 dark:border-gray-700/50 flex items-center justify-between ${
          collapsed ? "px-3 justify-center" : ""
        }`}
      >
        <div className="flex gap-2 items-center">

<span className="font-bold text-2xl text-[#5A6960]">Rough Idea</span>      
        </div>
          

        
      </SidebarHeader>

      {/* Content */}
      <SidebarContent
        className={`flex-1 px-4 py-4 space-y-6 overflow-y-auto ${
          collapsed ? "px-2" : ""
        }`}
      >
        <SidebarGroup>
          <div className="flex flex-col gap-2">
            <SidebarButton
              collapsed={collapsed}
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active
            />
            <SidebarButton
              collapsed={collapsed}
              icon={<FolderKanban size={18} />}
              label="Projects"
            />
            <SidebarButton
              collapsed={collapsed}
              icon={<Settings size={18} />}
              label="Settings"
            />
          </div>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <div className="text-sm text-gray-600 dark:text-gray-400 px-2 font-semibold">
              Recent Items
            </div>
          )}
          <ul
            className={`${
              collapsed ? "flex flex-col items-center gap-3" : "pl-5 list-disc"
            } text-gray-700 dark:text-gray-300 text-sm`}
          >
            {collapsed ? (
              <>
                <li>
                  <Clock size={16} />
                </li>
                <li>
                  <Clock size={16} />
                </li>
              </>
            ) : (
              <>
                <li>AI Notes</li>
                <li>Chat Summary</li>
              </>
            )}
          </ul>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter
        className={`px-5 py-3 border-t border-gray-200/60 dark:border-gray-700/50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm ${
          collapsed ? "px-2 flex justify-center" : ""
        }`}
      >
        {collapsed ? (
          <User className="text-gray-500 dark:text-gray-400" size={20} />
        ) : (
          <div className="w-full flex items-center justify-between">
            <div>
              <p className="font-medium">Amit Kumar</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Creator
              </p>
            </div>
            <div className="text-gray-400 text-xl select-none">|||</div>
            <Button type="button" onClick={logout}>Sign Out</Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

/* 🔹 Clean Sidebar Button */
function SidebarButton({
  collapsed,
  icon,
  label,
  active = false,
}: {
  collapsed: boolean;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full font-medium
        ${collapsed ? "justify-center px-2" : ""}
        ${
          active
            ? "bg-amber-100/60 dark:bg-amber-400/20 text-amber-800 dark:text-amber-200 border border-amber-200/50 dark:border-amber-400/30"
            : "bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/70 border border-white/40 dark:border-gray-700/50 text-gray-800 dark:text-gray-200"
        }
        transition-colors
      `}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
