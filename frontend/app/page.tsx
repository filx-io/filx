import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { TerminalDemo } from "@/components/terminal-demo";
import { Thesis } from "@/components/thesis";
import { HowItWorks } from "@/components/how-it-works";
import { AllTools } from "@/components/all-tools";
import { AgentSnippet } from "@/components/agent-snippet";
import { UseCases } from "@/components/use-cases";
import { Integrations } from "@/components/integrations";
import { MarketOpportunity } from "@/components/market-opportunity";
import { PricingTable } from "@/components/pricing-table";
import { Security } from "@/components/security";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08090d]">
      <Navbar />
      <Hero />
      <StatsBar />
      <TerminalDemo />
      <Thesis />
      <HowItWorks />
      <AllTools />
      <AgentSnippet />
      <UseCases />
      <Integrations />
      <MarketOpportunity />
      <PricingTable />
      <Security />
      <Footer />
    </main>
  );
}
