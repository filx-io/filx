const USE_CASES = [
  {
    icon: "🔍",
    title: "Research Agent",
    desc: "Scrapes PDFs from the web, converts to Markdown for LLM context windows. Handles academic papers, reports, and whitepapers at scale.",
    endpoint: "POST /api/v1/pdf/to-markdown",
    endpointColor: "text-blue-400",
    frameworks: ["MCP", "LangGraph", "AutoGPT"],
  },
  {
    icon: "📊",
    title: "Data Pipeline Agent",
    desc: "Extracts tables from financial reports, earnings releases, and regulatory filings into structured CSV for downstream analysis.",
    endpoint: "POST /api/v1/table/extract",
    endpointColor: "text-blue-400",
    frameworks: ["LangChain", "CrewAI", "Raw HTTP"],
  },
  {
    icon: "🖼️",
    title: "Content Agent",
    desc: "Resizes and optimizes images for social media, blog posts, and marketing materials. Processes hundreds of assets per hour.",
    endpoint: "POST /api/v1/image/resize + /compress",
    endpointColor: "text-blue-400",
    frameworks: ["MCP", "OpenAI Functions", "Raw HTTP"],
  },
  {
    icon: "📄",
    title: "Document Agent",
    desc: "OCRs scanned contracts, invoices, and handwritten forms into searchable, indexable text. Multi-language support.",
    endpoint: "POST /api/v1/pdf/ocr",
    endpointColor: "text-blue-400",
    frameworks: ["LangGraph", "CrewAI", "LangChain"],
  },
  {
    icon: "🚀",
    title: "DevOps Agent",
    desc: "Converts Markdown changelogs, specs, and documentation to polished PDFs for release notes and stakeholder reports.",
    endpoint: "POST /api/v1/markdown/to-pdf",
    endpointColor: "text-blue-400",
    frameworks: ["Raw HTTP", "AutoGPT", "MCP"],
  },
];

export function UseCases() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // real-world applications
          </p>
          <h2 className="font-mono font-black text-slate-200 text-2xl uppercase tracking-widest">
            Agent Use Cases
          </h2>
          <p className="font-mono text-slate-500 text-sm max-w-xl mx-auto">
            Every use case is a single HTTP call. Agents pay per request, scale without limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASES.map((uc) => (
            <div
              key={uc.title}
              className="flex flex-col gap-4 border border-white/10 bg-[#0d0f17] p-6 hover:border-white/20 transition-colors"
            >
              {/* Icon + title */}
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">{uc.icon}</span>
                <h3 className="font-mono font-bold text-slate-200 text-sm uppercase tracking-wider">
                  {uc.title}
                </h3>
              </div>

              {/* Description */}
              <p className="font-mono text-slate-500 text-xs leading-relaxed flex-1">{uc.desc}</p>

              {/* Endpoint */}
              <code className={`font-mono text-[11px] bg-[#0a0c14] border border-white/5 px-3 py-2 block break-all ${uc.endpointColor}`}>
                {uc.endpoint}
              </code>

              {/* Framework badges */}
              <div className="flex flex-wrap gap-1.5">
                {uc.frameworks.map((fw) => (
                  <span
                    key={fw}
                    className="font-mono text-[10px] text-slate-500 border border-white/10 px-2 py-0.5 bg-[#08090d]"
                  >
                    {fw}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Catch-all card */}
          <div className="flex flex-col gap-4 border border-dashed border-white/10 bg-transparent p-6 justify-center items-center text-center">
            <p className="font-mono text-slate-600 text-xs leading-relaxed">
              Any agent. Any framework. Any HTTP client.
            </p>
            <p className="font-mono font-bold text-[#3b82f6] text-sm">If it speaks HTTP, it works.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
