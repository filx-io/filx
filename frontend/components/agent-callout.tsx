import Link from "next/link";

const stats = [
  { value: "20+", label: "API Endpoints" },
  { value: "<5s", label: "Avg Time" },
  { value: "$0.001", label: "Min Cost" },
];

export function AgentCallout() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl border border-white/10 bg-[#0d0f17] p-10 space-y-8">
          {/* Eyebrow */}
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // for ai agents &amp; developers
          </p>

          {/* Headline */}
          <h2 className="font-mono font-black text-slate-200 text-3xl md:text-4xl uppercase tracking-tight leading-tight">
            Built for the{" "}
            <span className="text-[#3b82f6]">Machine Economy</span>
          </h2>

          {/* Body */}
          <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
            FliX is{" "}
            <strong className="text-slate-200">
              infrastructure for AI agents
            </strong>
            . Any agent framework —{" "}
            <strong className="text-slate-200">MCP</strong>,{" "}
            <strong className="text-slate-200">LangGraph</strong>,{" "}
            <strong className="text-slate-200">AutoGPT</strong>,{" "}
            <strong className="text-slate-200">CrewAI</strong> — can process
            files with a single API call and an{" "}
            <strong className="text-slate-200">x402 micropayment</strong>.
            20+ endpoints covering images, PDFs, OCR, and data extraction.{" "}
            <strong className="text-slate-200">No API keys</strong>. No subscriptions. No rate limits.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="border-l-2 border-[#3b82f6] pl-4 space-y-0.5"
              >
                <div className="font-mono font-black text-2xl text-slate-200">
                  {s.value}
                </div>
                <div className="font-mono text-xs text-slate-500 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/docs"
              className="font-mono text-sm font-bold text-[#3b82f6] hover:text-white transition-colors"
            >
              Read the Docs →
            </Link>
            <a
              href="https://github.com/filx-io/web"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm font-bold text-slate-500 hover:text-slate-300 transition-colors"
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
