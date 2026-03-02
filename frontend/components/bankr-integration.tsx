import { ExternalLink } from "lucide-react";

const HOW_IT_WORKS = [
  "Agent calls FilX API → gets HTTP 402 with payment details",
  'Agent sends Bankr prompt: "pay {amount} USDC to {address} on base"',
  "Bankr signs and submits the transaction",
  "Agent receives tx hash → submits to FilX with proof",
  "FilX delivers the converted file",
];

const WHY_BANKR = [
  {
    icon: "🔑",
    title: "No Private Keys",
    desc: "Agents don't touch raw keys. Bankr manages custodial wallets.",
  },
  {
    icon: "💬",
    title: "Natural Language Payments",
    desc: '"pay 0.005 USDC to 0x..." — that\'s it.',
  },
  {
    icon: "🌐",
    title: "Cross-Chain",
    desc: "Base, Ethereum, Polygon, Solana support.",
  },
  {
    icon: "⛽",
    title: "Gas Sponsored",
    desc: "No need to hold ETH for gas fees.",
  },
  {
    icon: "🚀",
    title: "Token Launch",
    desc: "Launch $FILX token and earn trading fees.",
  },
];

export function BankrIntegration() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* Card */}
        <div className="rounded-xl border border-white/10 bg-[#0d0f17] p-8 md:p-10 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
              // wallet infrastructure
            </p>
            <h2 className="font-mono font-black text-slate-200 text-2xl md:text-3xl uppercase tracking-wider leading-tight">
              Powered by{" "}
              <a
                href="https://bankr.bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3b82f6] hover:underline"
              >
                Bankr
              </a>
            </h2>
            <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
              FilX uses{" "}
              <strong className="text-slate-200">Bankr</strong> as its wallet
              infrastructure layer. AI agents don&apos;t need to manage private
              keys or sign transactions manually.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* How it works */}
            <div className="space-y-4">
              <h3 className="font-mono font-bold text-slate-300 text-xs uppercase tracking-widest">
                How It Works
              </h3>
              <ol className="space-y-3">
                {HOW_IT_WORKS.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border border-[#3b82f6] flex items-center justify-center font-mono font-black text-[10px] text-[#3b82f6] mt-0.5">
                      {i + 1}
                    </span>
                    <span className="font-mono text-xs text-slate-400 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Why Bankr */}
            <div className="space-y-4">
              <h3 className="font-mono font-bold text-slate-300 text-xs uppercase tracking-widest">
                Why Bankr?
              </h3>
              <ul className="space-y-3">
                {WHY_BANKR.map((item) => (
                  <li key={item.title} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-md bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-sm">
                      {item.icon}
                    </span>
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-200">
                        {item.title}
                      </span>
                      <span className="font-mono text-slate-500 text-xs">
                        {" "}
                        —{" "}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {item.desc}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code snippet teaser */}
          <div className="rounded-lg border border-white/5 bg-[#060709] p-4">
            <p className="font-mono text-xs text-slate-500 leading-relaxed">
              <span className="text-slate-600"># Natural language payment via Bankr</span>
              {"\n"}
              <span className="text-[#3b82f6]">httpx</span>
              <span className="text-slate-300">.post(</span>
              <span className="text-green-400">&quot;https://api.bankr.bot/agent/prompt&quot;</span>
              <span className="text-slate-300">,</span>
              {"\n"}
              {"  "}
              <span className="text-slate-300">headers=</span>
              <span className="text-slate-400">{"{"}</span>
              <span className="text-green-400">&quot;X-API-Key&quot;</span>
              <span className="text-slate-400">: BANKR_KEY{"}"}</span>
              <span className="text-slate-300">,</span>
              {"\n"}
              {"  "}
              <span className="text-slate-300">json=</span>
              <span className="text-slate-400">{"{"}</span>
              <span className="text-green-400">&quot;prompt&quot;</span>
              <span className="text-slate-400">: </span>
              <span className="text-green-400">
                &quot;send 0.005 USDC to 0xFilX on base&quot;
              </span>
              <span className="text-slate-400">{"}"}</span>
              <span className="text-slate-300">)</span>
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
            <a
              href="https://bankr.bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#3b82f6] hover:text-white transition-colors"
            >
              bankr.bot
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://docs.bankr.bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors"
            >
              docs.bankr.bot
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
