import { useState } from "react";
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

  return (
    <>
      <Navbar />
      <main className="pb-16 md:pb-0">
        <HeroSection query={searchQuery} onQueryChange={setSearchQuery} />
        <CourseGrid searchQuery={searchQuery} />
        <LearningPaths />
        <Pricing />
        <SocialProof />
        <Footer />
      </main>
      <AITutorSidebar />
      <MobileNav />
    </>
  );
};

export default Index;
