import { GraduationCap, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

const links = ["Courses", "Paths", "For Business", "Community"];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-strong">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2">
          

          
          <span className="text-lg font-bold text-foreground">Smarty</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center ml-10 gap-8">
          {links.map((l) =>
          <a key={l} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l}
            </a>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </button>
          <button className="gradient-primary text-primary-foreground text-sm font-medium px-5 py-2 rounded-xl hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden glass-strong border-t border-border overflow-hidden">
          
            <div className="px-4 py-4 space-y-3">
              {links.map((l) =>
            <a key={l} href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                  {l}
                </a>
            )}
              <button className="w-full gradient-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl mt-2">
                Get Started
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

}