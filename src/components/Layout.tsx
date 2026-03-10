import * as React from "react";
import { Sidebar, Route } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  headerTitle?: string;
}

export function Layout({ children, currentRoute, onNavigate, headerTitle }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fe] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar 
        currentRoute={currentRoute} 
        onNavigate={onNavigate} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "md:pl-20" : "md:pl-72"
      )}>
        <div className={cn(
          "fixed top-0 right-0 z-30 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "left-0 md:left-20" : "left-0 md:left-72"
        )}>
          <Header title={headerTitle} />
        </div>
        <main className="flex-1 p-8 pt-28 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}