import { GraduationCap, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

const links = ["Courses", "Paths", "For Business", "Community"];

interface NavbarProps {
  onScrollToSection: (section: string) => void;
}

export function Navbar({ onScrollToSection }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const handleNavClick = (link: string) => {
    onScrollToSection(link);
    setMobileOpen(false); // Closes mobile menu after clicking
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-strong border-b border-border/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold text-foreground">Smarty</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center ml-10 gap-8">
          {links.map((l) => (
            <button 
              key={l} 
              onClick={() => handleNavClick(l)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {l}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={toggle} 
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" 
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="gradient-primary text-primary-foreground text-sm font-medium px-5 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button 
          className="md:hidden text-foreground p-1" 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-strong border-t border-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {links.map((l) => (
                <button 
                  key={l} 
                  onClick={() => handleNavClick(l)}
                  className="block w-full text-left text-base font-medium text-muted-foreground hover:text-foreground py-1"
                >
                  {l}
                </button>
              ))}
              <div className="pt-4 space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center gradient-secondary text-primary-foreground text-sm font-medium px-5 py-3 rounded-xl"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block w-full gradient-primary text-primary-foreground text-sm font-medium px-5 py-3 rounded-xl"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
                <button 
                  onClick={toggle}
                  className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground py-2"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  Toggle Theme
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}