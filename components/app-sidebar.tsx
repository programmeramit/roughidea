"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Home, BookText, BarChart2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const [collapsed] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      {/* HEADER */}
      <SidebarHeader
        className={`px-6 py-6 border-b border-gray-200 flex items-center ${
          collapsed ? "justify-center px-3" : "justify-start"
        }`}
      >
        {!collapsed && (
          <span className="font-bold text-xl text-[#3D4B44]">Rough Idea</span>
        )}
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent
        className={`flex-1 px-3 py-4 space-y-6 overflow-y-auto ${
          collapsed ? "px-2" : ""
        }`}
      >
        <SidebarGroup>
          <div className="flex flex-col gap-1">

            {/* HOME */}
            <Link
              href="/"
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium
                ${collapsed ? "justify-center px-2" : ""}
              `}
            >
              <Home size={18} />
              {!collapsed && <span>Home</span>}
            </Link>

            {/* PROJECTS */}
            <Link
              href="/projects"
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium
                ${collapsed ? "justify-center px-2" : ""}
               hover:bg-gray-100
                                bg-gray-200 text-gray-900

              `}
            >
              <BookText size={18} />
              {!collapsed && <span>Projects</span>}
            </Link>

            {/* USAGES */}
            <Link
              href="/usages"
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium
                ${collapsed ? "justify-center px-2" : ""}
                text-gray-800 hover:bg-gray-100
              `}
            >
              <BarChart2 size={18} />
              {!collapsed && <span>Usages</span>}
            </Link>

            {/* PROFILE */}
            <Link
              href="/profile"
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium
                ${collapsed ? "justify-center px-2" : ""}
                text-gray-800 hover:bg-gray-100
              `}
            >
              <User size={18} />
              {!collapsed && <span>Profile</span>}
            </Link>
          </div>
        </SidebarGroup>

        {/* SPACER TO PUSH FOOTER DOWN */}
        <div className="flex-1">
        </div>

        {/* CREDITS + UPGRADE BOX */}
        {!collapsed && (
          <div className="px-4 py-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700">Credits</p>

            <div className="flex items-center justify-between text-xs mt-1">
              <span className="font-semibold">89/100</span>
            </div>

            <div className="w-full h-2 bg-gray-300 rounded-full mt-1">
              <div
                className="h-2 bg-[#3D4B44] rounded-full"
                style={{ width: "89%" }}
              />
            </div>

            <p className="text-sm text-gray-700 mt-4">Get Premium Now</p>

            <button className="mt-2 w-full py-2 rounded-md bg-[#3D4B44] text-white text-sm">
              Upgrade Now
            </button>
          </div>
        )}
      </SidebarContent>

      {/* FOOTER - SIGN OUT */}
      <SidebarFooter
        className={`px-5 py-3 border-t border-gray-200 bg-white ${
          collapsed ? "px-2 flex justify-center" : ""
        }`}
      >
        {collapsed ? (
          <User className="text-gray-500" size={20} />
        ) : (
          <div className="w-full flex items-center justify-between">
            <div>
              <p className="font-medium">Amit Kumar</p>
              <p className="text-xs text-gray-500">Creator</p>
            </div>

            <Button type="button" onClick={logout}>
              Sign Out
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
