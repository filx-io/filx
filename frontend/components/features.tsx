import { Database, Zap, Bot, Clock, Shield, Layers } from "lucide-react";

const FEATURES = [
  {
    icon: Database,
    title: "20+ API Endpoints",
    desc: "Every file operation you need — images, PDFs, OCR, table extraction, format conversion — all in one place.",
  },
  {
    icon: Zap,
    title: "x402 Native",
    desc: "HTTP 402 micropayments baked in. No API keys, no subscriptions. One round-trip: send file, pay, get result.",
  },
  {
    icon: Bot,
    title: "Agent-First",
    desc: "Built for MCP, LangGraph, AutoGPT, and CrewAI. JSON-first responses, MCP tool manifest included.",
  },
  {
    icon: Clock,
    title: "Instant Processing",
    desc: "Most operations complete in under 5 seconds. Background jobs for heavy workloads with webhook callbacks.",
  },
  {
    icon: Shield,
    title: "Ephemeral by Design",
    desc: "Files auto-deleted after 1 hour. No data retained between jobs. No account required.",
  },
  {
    icon: Layers,
    title: "Multi-Format",
    desc: "Images (PNG, JPG, WebP, AVIF, SVG, ICO), PDFs, HTML, Markdown — inputs and outputs covered.",
  },
];

export function Features() {
  return (
    <section className="py-20 px-6 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // why filx
          </p>
          <h2 className="font-mono font-black text-2xl md:text-3xl uppercase tracking-widest text-slate-200">
            Built Different
          </h2>
          <p className="font-mono text-slate-500 text-sm max-w-xl mx-auto">
            Not another SaaS with API keys and rate limits. FliX is infrastructure — pay per use, own nothing, process everything.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-5 rounded-md border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all space-y-3"
            >
              <div className="w-9 h-9 rounded-md border border-white/[0.08] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <h3 className="font-mono font-bold text-sm text-slate-200 uppercase tracking-wider leading-snug">
                {title}
              </h3>
              <p className="font-mono text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
