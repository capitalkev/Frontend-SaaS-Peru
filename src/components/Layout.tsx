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
  return (
    <div className="min-h-screen bg-[#f4f7fe] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />
      <div className="md:pl-72 flex flex-col min-h-screen">
        <Header title={headerTitle} />
        <main className="flex-1 p-8 pt-28 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
