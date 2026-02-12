import { Menu, Moon, Sun, Bell, Zap } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopNavbarProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {isMobile && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="text-sm font-bold">ThermoSense AI</span>
          </div>
        )}
        {!isMobile && (
          <button onClick={onMenuToggle} className="p-2 hover:bg-muted rounded-md transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          System Online
        </div>
        <button className="p-2 hover:bg-muted rounded-md transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-thermal rounded-full" />
        </button>
        <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-md transition-colors">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
