const DISTRIBUTION = [
  { label: "Community & Ecosystem", pct: 40, bar: "████████████████████", color: "text-blue-400" },
  { label: "Liquidity",             pct: 25, bar: "█████████████",        color: "text-green-400" },
  { label: "Team (12mo vesting)",   pct: 15, bar: "████████",             color: "text-yellow-400" },
  { label: "Treasury",              pct: 10, bar: "█████",                color: "text-purple-400" },
  { label: "Early Supporters",      pct: 10, bar: "█████",                color: "text-slate-400" },
];

const TOKEN_DETAILS = [
  { label: "Token",    value: "$FILX" },
  { label: "Network",  value: "Base (ERC-20)" },
  { label: "Supply",   value: "1,000,000,000" },
  { label: "Status",   value: "Launching Q3 2025" },
];

export function Tokenomics() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // token
          </p>
          <h2 className="font-mono font-black text-slate-200 text-2xl uppercase tracking-widest">
            $FILX Tokenomics
          </h2>
          <p className="font-mono text-slate-500 text-sm max-w-xl mx-auto">
            Pay for conversions with $FILX and get 50% off vs USDC. Stake for protocol revenue share.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Token details */}
          <div className="space-y-4">
            <h3 className="font-mono font-bold text-slate-400 text-xs uppercase tracking-widest border-b border-white/5 pb-2">
              Token Details
            </h3>
            <div className="space-y-3">
              {TOKEN_DETAILS.map((d) => (
                <div key={d.label} className="flex justify-between items-center">
                  <span className="font-mono text-xs text-slate-600 uppercase tracking-wider">{d.label}</span>
                  <span className="font-mono text-sm text-slate-200 font-bold">{d.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-3 border-t border-white/5">
              <h4 className="font-mono text-xs text-slate-600 uppercase tracking-wider">Utility</h4>
              {[
                "50% discount on all conversions vs USDC",
                "Staking rewards from protocol fees",
                "Governance over endpoint pricing",
                "Priority processing in agent queues",
              ].map((u) => (
                <div key={u} className="flex gap-2">
                  <span className="font-mono text-[#3b82f6] text-xs">→</span>
                  <span className="font-mono text-slate-400 text-xs">{u}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Distribution chart */}
          <div className="space-y-4">
            <h3 className="font-mono font-bold text-slate-400 text-xs uppercase tracking-widest border-b border-white/5 pb-2">
              Distribution
            </h3>
            <div className="bg-[#0a0c14] border border-white/5 p-5">
              <pre className="font-mono text-xs leading-loose">
                {DISTRIBUTION.map((d) => (
                  <span key={d.label}>
                    <span className="text-slate-500">{d.label.padEnd(26)}</span>
                    <span className="text-slate-600">{String(d.pct).padStart(3)}%  </span>
                    <span className={d.color}>{d.bar}</span>
                    {"\n"}
                  </span>
                ))}
              </pre>
            </div>
            <p className="font-mono text-[10px] text-slate-600 text-center">
              Total Supply: 1,000,000,000 $FILX · Network: Base
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
