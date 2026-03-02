import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FileConverter } from "@/components/converter/FileConverter";
import { Features } from "@/components/features";
import { PricingTable } from "@/components/pricing-table";
import { AgentSnippet } from "@/components/agent-snippet";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* ── Main Converter Tool ── */}
      <section id="convert" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Convert your file
          </h2>
          <FileConverter />
        </div>
      </section>

      <Features />
      <PricingTable />
      <AgentSnippet />
      <Footer />
    </main>
  );
}
