import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";
import { BottomNav } from "./BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {!isMobile && (
        <AppSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      )}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
      {isMobile && <BottomNav />}
    </div>
  );
}
