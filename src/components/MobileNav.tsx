import { Home, BookOpen, Compass, User, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const tabs = [
  { icon: Home, label: "Home" },
  { icon: BookOpen, label: "Courses" },
  { icon: Compass, label: "Explore" },
  { icon: User, label: "Profile" },
];

export function MobileNav() {
  const { theme, toggle } = useTheme();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <button key={tab.label} className="flex flex-col items-center gap-1 py-1 px-3 text-muted-foreground hover:text-primary transition-colors">
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
        <button onClick={toggle} className="flex flex-col items-center gap-1 py-1 px-3 text-muted-foreground hover:text-primary transition-colors" aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-[10px] font-medium">Theme</span>
        </button>
      </div>
    </nav>
  );
}
