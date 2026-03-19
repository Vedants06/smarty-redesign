import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CourseGrid } from "@/components/CourseGrid";
import { LearningPaths } from "@/components/LearningPaths";
import { SocialProof } from "@/components/SocialProof";
import { AITutorSidebar } from "@/components/AITutorSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/Pricing";
import { Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [proSuccess, setProSuccess] = useState(false);

  // Refs for each section
  const coursesRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);

  // ── Handle ?pro=success redirect from Cashfree ──────────────────────────
  useEffect(() => {
    const hash = window.location.hash; // e.g. "#/?pro=success&order_id=..."
    const queryString = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(queryString);
    const orderId = params.get("order_id");
    if (params.get("pro") !== "success" || !orderId) return;

    setProSuccess(true);

    async function verifyPro(attempts = 5, delayMs = 2000) {
      for (let i = 0; i < attempts; i++) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/verify-pro-payment/${orderId}`
          );
          const data = await res.json();
          console.log(`Pro verify attempt ${i + 1}:`, data.status);
          if (data.status === "paid") break;
        } catch (e) {
          console.warn(`Pro verify attempt ${i + 1} failed:`, e);
        }
        if (i < attempts - 1) await new Promise(r => setTimeout(r, delayMs));
      }
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }

    verifyPro();
  }, []);

  // Scroll handler
  const scrollToSection = (section: string) => {
    const sectionMap: Record<string, React.RefObject<HTMLDivElement>> = {
      "Courses": coursesRef,
      "Paths": pathsRef,
      "For Business": pricingRef,
      "Community": communityRef,
    };
    const targetRef = sectionMap[section];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Navbar onScrollToSection={scrollToSection} />

      {/* ── Pro payment success banner ── */}
      <AnimatePresence>
        {proSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-50 flex justify-center px-4 pt-3"
          >
            <div className="glass border border-green-500/40 text-green-400 text-sm font-medium px-6 py-3 rounded-xl flex items-center gap-2 shadow-glow">
              <Unlock className="w-4 h-4" />
              🎉 Welcome to Pro! All courses are now unlocked.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pb-16 md:pb-0 pt-16">
        <HeroSection query={searchQuery} onQueryChange={setSearchQuery} />

        <div ref={coursesRef} id="courses" className="scroll-mt-20">
          <CourseGrid searchQuery={searchQuery} />
        </div>

        <div ref={pathsRef} id="paths" className="scroll-mt-20"> 
          <LearningPaths />
        </div>

        <div ref={pricingRef} id="pricing" className="scroll-mt-20">  
          <Pricing />
        </div>

        <div ref={communityRef} id="community" className="scroll-mt-20">
          <SocialProof />
        </div>

        <Footer />
      </main>
      <AITutorSidebar />
      <MobileNav onScrollToSection={scrollToSection} />
    </>
  );
};

export default Index;