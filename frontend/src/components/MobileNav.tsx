import { Home, BookOpen, Compass, User, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home,     label: "Home",    action: "home" },
  { icon: BookOpen, label: "Courses", action: "courses" },
  { icon: User,     label: "Profile", action: "profile" },
  { icon: Compass,  label: "Explore", action: "paths" },
];

interface MobileNavProps {
  onScrollToSection: (section: string) => void;
}

export function MobileNav({ onScrollToSection }: MobileNavProps) {
  const { theme, toggle } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleTab = (action: string) => {
    switch (action) {
      case "home":
        navigate("/");
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
        break;
      case "profile":
        navigate("/profile");
        break;
      case "courses":
        if (location.pathname !== "/") {
          navigate("/");
          setTimeout(() => onScrollToSection("Courses"), 300);
        } else {
          onScrollToSection("Courses");
        }
        break;
      case "paths":
        if (location.pathname !== "/") {
          navigate("/");
          setTimeout(() => onScrollToSection("Paths"), 300);
        } else {
          onScrollToSection("Paths");
        }
        break;
    }
  };

  const isActive = (action: string) => {
    if (action === "profile") return location.pathname === "/profile";
    if (action === "home") return location.pathname === "/" ;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTab(tab.action)}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
              isActive(tab.action) ? "text-primary" : "text-muted-foreground active:text-primary"
            }`}
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