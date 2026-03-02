import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { HowItWorks } from "@/components/how-it-works";
import { SupportedFormats } from "@/components/supported-formats";
import { FileConverter } from "@/components/converter/FileConverter";
import { Features } from "@/components/features";
import { AgentCallout } from "@/components/agent-callout";
import { Security } from "@/components/security";
import { PricingTable } from "@/components/pricing-table";
import { AgentSnippet } from "@/components/agent-snippet";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08090d]">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />

      <section id="convert" className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-mono font-bold text-center mb-8 text-slate-200 uppercase tracking-wider">
            Convert your file
          </h2>
          <FileConverter />
        </div>
      </section>

      <SupportedFormats />
      <Features />
      <AgentCallout />
      <Security />
      <PricingTable />
      <AgentSnippet />
      <Footer />
    </main>
  );
}
