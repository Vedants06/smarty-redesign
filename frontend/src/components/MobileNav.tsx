import { Home, BookOpen, Compass, User, Sun, Moon, Layout } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

// label must match the keys in your scrollToSection map in Index.tsx
const tabs = [
  { icon: Home, label: "Home", section: "Home" },
  { icon: BookOpen, label: "Courses", section: "Courses" },
  { icon: Compass, label: "Explore", section: "Paths" }, // Changed to match your sections
  { icon: User, label: "Pricing", section: "For Business" }, // Changed to match your sections
];

interface MobileNavProps {
  onScrollToSection: (section: string) => void;
}

export function MobileNav({ onScrollToSection }: MobileNavProps) {
  const { theme, toggle } = useTheme();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <button 
            key={tab.label} 
            onClick={() => {
              if (tab.section === "Home") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                onScrollToSection(tab.section);
              }
            }}
            className="flex flex-col items-center gap-1 py-1 px-3 text-muted-foreground active:text-primary transition-colors"
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
        
        <button 
          onClick={toggle} 
          className="flex flex-col items-center gap-1 py-1 px-3 text-muted-foreground active:text-primary transition-colors" 
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-[10px] font-medium">Theme</span>
        </button>
      </div>
    </nav>
  );
}