import { Bell, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-72 z-30 h-20 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100/50">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {title || `${getGreeting()}, Carlos`}
        </h1>
        <p className="text-sm text-slate-500 hidden md:block">
          Bienvenido de nuevo a tu panel financiero.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar operación..."
            className="h-10 w-64 rounded-full bg-slate-100 border-none pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-900">Carlos M.</p>
            <p className="text-xs text-slate-500">Gerente Financiero</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm">
            <User className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
