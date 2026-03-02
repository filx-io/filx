export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pt-12 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/[0.06]">
          {/* Left: Brand */}
          <div className="space-y-3">
            <div className="font-mono font-bold text-slate-200 text-lg tracking-wider">
              <span className="text-[#3b82f6]">#</span> FliX
            </div>
            <p className="font-mono text-slate-600 text-xs leading-relaxed">
              x402 file conversion infrastructure.<br />
              Built for AI agents. Powered by Base.
            </p>
            <p className="font-mono text-[10px] text-slate-700 uppercase tracking-widest">
              x402 Protocol · Base Chain · USDC
            </p>
          </div>

          {/* Center: Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Docs", href: "https://api.filx.io/docs" },
                { label: "GitHub", href: "https://github.com/filx-io/web" },
                { label: "X / Twitter", href: "https://x.com/filx_io" },
                { label: "API Status", href: "https://status.filx.io" },
                { label: "Launch App", href: "https://app.filx.io" },
                { label: "x402 Protocol", href: "https://x402.org" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-slate-500 hover:text-slate-200 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: License + legal */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Legal</h4>
            <p className="font-mono text-xs text-slate-600">
              © 2025 FliX
            </p>
            <p className="font-mono text-xs text-slate-600">
              MIT License
            </p>
            <p className="font-mono text-[10px] text-slate-700 leading-relaxed">
              FliX is infrastructure software. Use responsibly.
              $FILX tokens are not securities.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-slate-600">
            Built for agents, by agents.
          </p>
          <p className="font-mono text-[11px] text-slate-700">
            x402 Protocol · Base Chain · USDC
          </p>
        </div>
      </div>
    </footer>
  );
}
