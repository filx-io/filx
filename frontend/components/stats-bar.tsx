const stats = [
  { value: "1,200+", label: "Agents Trusting FilX" },
  { value: "48,900+", label: "Files Converted" },
  { value: "$2,340+", label: "USDC Processed" },
];

export function StatsBar() {
  return (
    <div className="border-t border-b border-white/5 bg-[#0d0f17]">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-8 sm:divide-x divide-white/10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="sm:px-8 text-center space-y-0.5"
          >
            <div className="font-mono font-black text-xl text-slate-200">{s.value}</div>
            <div className="font-mono text-xs text-slate-600 uppercase tracking-wider">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
