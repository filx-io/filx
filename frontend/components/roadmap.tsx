const MILESTONES = [
  {
    period: "Q1 2025",
    status: "done",
    icon: "✅",
    label: "SHIPPED",
    labelColor: "text-green-400 border-green-400/30",
    items: ["Core API (PDF, OCR, Image Convert)", "20 endpoints live", "x402 payment integration"],
  },
  {
    period: "Q2 2025",
    status: "done",
    icon: "✅",
    label: "SHIPPED",
    labelColor: "text-green-400 border-green-400/30",
    items: ["x402 Protocol integration", "Bankr Wallet support", "Base chain deployment", "MCP tool manifest"],
  },
  {
    period: "Q3 2025",
    status: "active",
    icon: "🔄",
    label: "IN PROGRESS",
    labelColor: "text-yellow-400 border-yellow-400/30",
    items: ["$FILX Token Launch", "Agent Marketplace v1", "LangGraph Python SDK", "50% $FILX discount activation"],
  },
  {
    period: "Q4 2025",
    status: "planned",
    icon: "🔜",
    label: "PLANNED",
    labelColor: "text-slate-400 border-slate-400/30",
    items: ["MCP Registry listing", "Solana USDC support", "50+ endpoints", "Batch processing API"],
  },
  {
    period: "2026",
    status: "planned",
    icon: "🔜",
    label: "VISION",
    labelColor: "text-slate-500 border-slate-500/30",
    items: ["Autonomous agent economy", "Cross-chain settlement", "Agent-to-agent marketplace", "Self-sovereign file infrastructure"],
  },
];

export function Roadmap() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // roadmap
          </p>
          <h2 className="font-mono font-black text-slate-200 text-2xl uppercase tracking-widest">
            What&apos;s Coming
          </h2>
          <p className="font-mono text-slate-500 text-sm">
            Building the file infrastructure layer for the autonomous agent economy.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 ml-[7px] hidden md:block" />

          <div className="space-y-6">
            {MILESTONES.map((m, i) => (
              <div key={i} className="md:pl-10 relative">
                {/* Timeline dot */}
                <div
                  className={`hidden md:block absolute left-0 top-3 w-3.5 h-3.5 border-2 ${
                    m.status === "done"
                      ? "border-green-400 bg-green-400/20"
                      : m.status === "active"
                      ? "border-yellow-400 bg-yellow-400/20"
                      : "border-white/20 bg-[#0a0c14]"
                  }`}
                />

                <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-3">
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{m.icon}</span>
                      <span className="font-mono font-black text-slate-200 text-sm">{m.period}</span>
                    </div>
                    <span className={`font-mono text-[9px] font-bold border px-2 py-0.5 ${m.labelColor}`}>
                      {m.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {m.items.map((item) => (
                      <div key={item} className="flex gap-2">
                        <span className={`font-mono text-[10px] mt-0.5 flex-shrink-0 ${
                          m.status === "done" ? "text-green-400" :
                          m.status === "active" ? "text-yellow-400" :
                          "text-slate-600"
                        }`}>→</span>
                        <span className={`font-mono text-xs leading-relaxed ${
                          m.status === "done" ? "text-slate-400" :
                          m.status === "active" ? "text-slate-300" :
                          "text-slate-600"
                        }`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
