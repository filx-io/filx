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
    desc: "Coinbase's x402 protocol launched in 2024. FilX is one of the first production services built on it.",
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
            FilX is purpose-built for what comes next.
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

      </div>
    </section>
  );
}
