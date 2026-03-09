import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  UserCircle,
  Bell,
  Search,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";


export type Route = "dashboard" | "operations" | "new-operation" | "profile" | "operation-detail";

interface SidebarProps {
  currentRoute: Route;
  onNavigate: (route: Route) => void;
}

export function Sidebar({ currentRoute, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard General", icon: LayoutDashboard },
    { id: "operations", label: "Mis Operaciones", icon: Briefcase },
    { id: "new-operation", label: "Nueva Operación", icon: PlusCircle },
    { id: "profile", label: "Perfil y Scoring", icon: UserCircle },
  ] as const;
  const { logout } = useAuth();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-white border-r border-navy-100 hidden md:flex flex-col shadow-xl shadow-navy-200/20">
      <div className="p-8 pb-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-2xl font-bold text-navy-900 tracking-tight">
            capital<span className="text-brand-600">express</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentRoute === item.id || (currentRoute === 'operation-detail' && item.id === 'operations');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Route)}
              className={cn(
                "relative flex items-center w-full p-3 rounded-xl transition-all duration-200 group font-medium",
                isActive
                  ? "bg-brand-50 text-brand-700 shadow-sm shadow-brand-100/50"
                  : "text-navy-500 hover:bg-navy-50 hover:text-navy-900"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-brand-600"
                />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 mr-3 transition-colors",
                  isActive ? "text-brand-600" : "text-navy-400 group-hover:text-navy-600"
                )}
              />
              {item.label}
              {isActive && (
                <ChevronRight className="ml-auto h-4 w-4 text-brand-400 opacity-50" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div 
          onClick={logout} 
          className="flex items-center justify-between px-2 text-navy-500 hover:text-rose-600 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </div>
          <span className="text-xs text-slate-400">v1.0.2</span>
        </div>
      </div>
    </aside>
  );
}
