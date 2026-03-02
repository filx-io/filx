import { ArrowRight } from "lucide-react";

const STATS = [
  {
    stat: "$47B",
    label: "Document AI Market",
    desc: "Global market for document processing and AI extraction, projected by 2028.",
    color: "text-[#3b82f6]",
  },
  {
    stat: "10M+",
    label: "AI Agents by 2026",
    desc: "Analysts project tens of millions of autonomous AI agents deployed globally within two years.",
    color: "text-green-400",
  },
  {
    stat: "Day 1",
    label: "x402 Adoption",
    desc: "Coinbase's x402 protocol launched in 2024. FliX is one of the first production services built on it.",
    color: "text-yellow-400",
  },
];

export function MarketOpportunity() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // market opportunity
          </p>
          <h2 className="font-mono font-black text-slate-200 text-3xl md:text-4xl uppercase tracking-widest leading-tight">
            The Timing Is Now
          </h2>
          <p className="font-mono text-slate-500 text-sm max-w-xl mx-auto">
            AI agents are proliferating faster than the infrastructure built to support them.
            FliX is purpose-built for what comes next.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STATS.map((item) => (
            <div
              key={item.label}
              className="border border-white/10 bg-[#0d0f17] p-6 space-y-3 hover:border-white/20 transition-colors"
            >
              <div className={`font-mono font-black text-5xl leading-none ${item.color}`}>
                {item.stat}
              </div>
              <div className="font-mono font-bold text-slate-200 text-sm uppercase tracking-widest">
                {item.label}
              </div>
              <p className="font-mono text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Investor CTA block */}
        <div className="border border-white/10 bg-[#0d0f17] p-8 md:p-12 space-y-6 text-center">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // for investors
          </p>
          <h3 className="font-mono font-black text-slate-200 text-2xl md:text-3xl uppercase tracking-widest">
            Investing in Agent Infrastructure
          </h3>
          <p className="font-mono text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            FliX is the first production API for file processing that requires{" "}
            <strong className="text-white">zero accounts, zero API keys</strong>, and{" "}
            <strong className="text-white">zero human infrastructure</strong> — built natively for
            the autonomous agent economy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left max-w-2xl mx-auto">
            {[
              { label: "Business Model", value: "Per-use micropayments via USDC" },
              { label: "Moat", value: "First-mover on x402 protocol" },
              { label: "Scalability", value: "Stateless API, scales to ∞ agents" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
                  {item.label}
                </div>
                <div className="font-mono text-slate-300 text-xs font-medium">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <a
              href="mailto:investors@filx.io"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3b82f6] text-white font-mono font-semibold text-sm tracking-wide hover:bg-[#2563eb] transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://api.filx.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-slate-300 font-mono font-semibold text-sm tracking-wide hover:border-white/25 hover:text-white transition-colors"
            >
              Read the Docs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
