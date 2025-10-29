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
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar
      className={`
        ${collapsed ? "w-20" : "w-64"} 
        min-h-screen 
        bg-gradient-to-b from-amber-100 via-orange-50 to-rose-100
        text-gray-800 
        shadow-lg 
        flex flex-col
        border-r border-gray-200
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Header */}
      <SidebarHeader
        className={`px-5 py-4 border-b border-gray-300 flex items-center justify-between ${
          collapsed ? "px-3 justify-center" : ""
        }`}
      >
        {!collapsed ? (
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              RoughIdea
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Turn ideas into emotions 💡
            </p>
          </div>
        ) : (
          <h1 className="text-xl font-bold text-gray-900">💡</h1>
        )}

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="p-1 hover:bg-gray-200 rounded-md"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent
        className={`flex-1 px-4 py-4 space-y-4 overflow-y-auto ${
          collapsed ? "px-2" : ""
        }`}
      >
        <SidebarGroup>
          <div className="flex flex-col gap-2">
            <SidebarButton
              collapsed={collapsed}
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
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
            <div className="text-sm text-gray-600 px-2 font-semibold">
              Recent Items
            </div>
          )}
          <ul
            className={`${
              collapsed ? "flex flex-col items-center gap-3" : "pl-5 list-disc"
            } text-gray-700 text-sm`}
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
        className={`px-5 py-3 border-t border-gray-300 bg-white/60 backdrop-blur-md ${
          collapsed ? "px-2 flex justify-center" : ""
        }`}
      >
        {collapsed ? (
          <User className="text-gray-500" size={20} />
        ) : (
          <div className="w-full flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Amit Kumar</p>
              <p className="text-xs text-gray-500">Creator</p>
            </div>
            <div className="text-gray-400 text-xl select-none">|||</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

/* 🔹 Reusable Sidebar Button */
function SidebarButton({
  collapsed,
  icon,
  label,
}: {
  collapsed: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className={`flex items-center gap-3 px-3 py-2 rounded-md bg-white/50 hover:bg-white/80 transition font-medium shadow-sm w-full ${
        collapsed ? "justify-center px-2" : ""
      }`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
