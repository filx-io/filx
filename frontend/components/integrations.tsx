const INTEGRATIONS = [
  {
    icon: "⛓️",
    name: "x402 Protocol",
    role: "Foundation",
    desc: "Coinbase's open payment standard. HTTP 402 finally implemented. The backbone of machine-to-machine micropayments.",
    href: "https://x402.org",
    badge: "OPEN STANDARD",
    badgeColor: "text-blue-400 border-blue-400/30",
  },
  {
    icon: "🤖",
    name: "FliX Wallet",
    role: "Agent Wallet",
    desc: "Embedded wallet built for agents. Natural language payment signing. No private key management required.",
    href: "https://filx.io/docs#wallet",
    badge: "EMBEDDED",
    badgeColor: "text-purple-400 border-purple-400/30",
  },
  {
    icon: "🔵",
    name: "Base Chain",
    role: "Settlement Layer",
    desc: "Ethereum L2 by Coinbase. Fast, cheap USDC transactions. Every FliX payment settles on-chain.",
    href: "https://base.org",
    badge: "L2 · USDC",
    badgeColor: "text-blue-400 border-blue-400/30",
  },
  {
    icon: "🔧",
    name: "MCP",
    role: "Tool Protocol",
    desc: "Native Model Context Protocol tool manifest included. Plug FliX directly into Claude, GPT, Gemini agents.",
    href: "https://modelcontextprotocol.io",
    badge: "NATIVE SUPPORT",
    badgeColor: "text-green-400 border-green-400/30",
  },
  {
    icon: "🦜",
    name: "LangGraph / LangChain",
    role: "Agent Frameworks",
    desc: "Python SDK with x402 client built-in. One import away from autonomous file processing pipelines.",
    href: "https://www.langchain.com",
    badge: "PYTHON SDK",
    badgeColor: "text-yellow-400 border-yellow-400/30",
  },
  {
    icon: "🌐",
    name: "Any HTTP Client",
    role: "Universal",
    desc: "curl, httpx, fetch, axios, requests — if it speaks HTTP, it works. Zero SDK dependency.",
    href: "#",
    badge: "NO SDK NEEDED",
    badgeColor: "text-slate-400 border-slate-400/30",
  },
];

export function Integrations() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // ecosystem
          </p>
          <h2 className="font-mono font-black text-slate-200 text-2xl uppercase tracking-widest">
            Integrations
          </h2>
          <p className="font-mono text-slate-500 text-sm max-w-xl mx-auto">
            FliX plugs into the agent stack you already use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTEGRATIONS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target={item.href !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 border border-white/10 bg-[#0d0f17] p-5 hover:border-white/20 transition-colors"
            >
              {/* Icon + name */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{item.icon}</span>
                  <div>
                    <h3 className="font-mono font-bold text-slate-200 text-sm">{item.name}</h3>
                    <p className="font-mono text-[10px] text-slate-600 uppercase tracking-wider">{item.role}</p>
                  </div>
                </div>
                <span className={`font-mono text-[9px] font-bold border px-2 py-0.5 whitespace-nowrap ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              <p className="font-mono text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
