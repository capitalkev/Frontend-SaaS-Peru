import * as React from "react";
import { Sidebar, Route } from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  headerTitle?: string; // Lo dejamos por si lo usas en el futuro, aunque no se mostrará
}

export function Layout({
  children,
  currentRoute,
  onNavigate,
}: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fe] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:pl-20" : "md:pl-72",
        )}
      >
        {/* Se quitó el Header y se quitó el pt-20 (padding-top) del main */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}