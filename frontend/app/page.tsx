import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TerminalDemo } from "@/components/terminal-demo";
import { Thesis } from "@/components/thesis";
import { HowItWorks } from "@/components/how-it-works";
import { AllTools } from "@/components/all-tools";
import { AgentSnippet } from "@/components/agent-snippet";
import { UseCases } from "@/components/use-cases";
import { Integrations } from "@/components/integrations";
import { Tokenomics } from "@/components/tokenomics";
import { Roadmap } from "@/components/roadmap";
import { PricingTable } from "@/components/pricing-table";
import { Security } from "@/components/security";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08090d]">
      <Navbar />
      <Hero />
      <TerminalDemo />
      <Thesis />
      <HowItWorks />
      <AllTools />
      <AgentSnippet />
      <UseCases />
      <Integrations />
      <Tokenomics />
      <Roadmap />
      <PricingTable />
      <Security />
      <Footer />
    </main>
  );
}
