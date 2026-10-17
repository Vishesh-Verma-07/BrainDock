import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProblemSection } from "@/components/problem-section";
import { CaptureSection } from "@/components/capture-section";
import { DarkAISearch } from "@/components/dark-ai-search";
import { OrganizeSection } from "@/components/organize-section";
import { KnowledgeSection } from "@/components/knowledge-section";
import { WorkflowSection } from "@/components/workflow-section";
import { FeatureGrid } from "@/components/feature-grid";
import { FAQ } from "@/components/faq";
import { FinalCTA } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { UseCaseMarquee } from "@/components/use-case-marquee";
import { StatsStrip } from "@/components/stats-strip";

export default function Home() {
  return (
    <div className="landing grain flex flex-col flex-1">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <UseCaseMarquee />
        <ProblemSection />
        <CaptureSection />
        <DarkAISearch />
        <OrganizeSection />
        <KnowledgeSection />
        <WorkflowSection />
        <FeatureGrid />
        <StatsStrip />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}