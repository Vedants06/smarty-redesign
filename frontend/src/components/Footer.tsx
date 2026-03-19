import { GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    // If already on home page, scroll directly
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate home first, then scroll after page loads
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* ── Brand ── */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Smarty</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Premium tech education for the next generation of engineers.
          </p>
        </div>

        {/* ── Platform ── */}
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-3">Platform</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => scrollTo("courses")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Courses
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo("paths")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Learning Paths
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo("pricing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </button>
            </li>
            <li>
              <a
                href="mailto:sales@smarty.com?subject=Teams Plan Inquiry"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                For Teams
              </a>
            </li>
          </ul>
        </div>

        {/* ── Account ── */}
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-3">Account</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                My Learning
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* ── Support ── */}
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-3">Support</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:support@smarty.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © 2025 Smarty. All rights reserved.
      </div>
    </footer>
  );
}