import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { HowItWorks } from "@/components/how-it-works";
import { X402Flow } from "@/components/x402-flow";
import { AllTools } from "@/components/all-tools";
import { AgentSnippet } from "@/components/agent-snippet";
import { SupportedFormats } from "@/components/supported-formats";
import { Features } from "@/components/features";
import { AgentCallout } from "@/components/agent-callout";
import { BankrIntegration } from "@/components/bankr-integration";
import { Security } from "@/components/security";
import { PricingTable } from "@/components/pricing-table";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08090d]">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <X402Flow />
      <AllTools />
      <AgentSnippet />
      <SupportedFormats />
      <Features />
      <AgentCallout />
      <BankrIntegration />
      <Security />
      <PricingTable />
      <Footer />
    </main>
  );
}
