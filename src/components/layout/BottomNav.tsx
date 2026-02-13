import { Home, Cpu, Activity } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Plant", url: "/machines", icon: Cpu },
  { title: "Analysis", url: "/analysis", icon: Activity },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-50 md:hidden">
      {items.map((item) => (
        <NavLink
          key={item.url}
          to={item.url}
          end={item.url === "/"}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
              isActive ? "text-accent" : "text-muted-foreground"
            )
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
