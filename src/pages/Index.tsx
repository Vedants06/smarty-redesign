import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CourseGrid } from "@/components/CourseGrid";
import { LearningPaths } from "@/components/LearningPaths";
import { SocialProof } from "@/components/SocialProof";
import { AITutorSidebar } from "@/components/AITutorSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/Pricing";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Refs for each section
  const coursesRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);

  // Scroll handler function
  const scrollToSection = (section: string) => {
    const sectionMap: Record<string, React.RefObject<HTMLDivElement>> = {
      "Courses": coursesRef,
      "Paths": pathsRef,
      "For Business": pricingRef,
      "Community": communityRef,
    };

    const targetRef = sectionMap[section];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "start" 
      });
    }
  };

  return (
    <>
      <Navbar onScrollToSection={scrollToSection} />
      <main className="pb-16 md:pb-0 pt-16"> {/* Added pt-16 to account for fixed navbar */}
        <HeroSection query={searchQuery} onQueryChange={setSearchQuery} />
        
        <div ref={coursesRef} className="scroll-mt-20">
          <CourseGrid searchQuery={searchQuery} />
        </div>
        
        <div ref={pathsRef} className="scroll-mt-20">
          <LearningPaths />
        </div>
        
        <div ref={pricingRef} className="scroll-mt-20">
          <Pricing />
        </div>
        
        <div ref={communityRef} className="scroll-mt-20">
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