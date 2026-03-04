import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pt-12 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/[0.06]">
          {/* Left: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Image
                src="/assets/logo.jpg"
                alt="FilX"
                width={28}
                height={28}
                className="rounded-sm"
              />
              <span className="font-mono font-bold text-slate-200 text-lg tracking-wider">FilX</span>
            </div>
            <p className="font-mono text-slate-600 text-xs leading-relaxed">
              The x402 File Primitive for AI agents.<br />
              Powered by Base. Settled in USDC.
            </p>
            <p className="font-mono text-[10px] text-slate-700 uppercase tracking-widest">
              x402 Protocol · Built for agents, by agents.
            </p>
          </div>

          {/* Center: Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Docs", href: "https://filx.io/docs" },
                { label: "GitHub", href: "https://github.com/filx-io/web" },
                { label: "X / Twitter", href: "https://x.com/filx_io" },
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
            <h4 className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Contact</h4>
            <a
              href="mailto:hello@filx.io"
              className="font-mono text-xs text-slate-500 hover:text-slate-200 transition-colors block"
            >
              hello@filx.io
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[10px] text-slate-600">
            © 2026 FILX.io All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="font-mono text-[10px] text-slate-600 hover:text-slate-300 transition-colors">
              Terms of Use
            </a>
            <a href="/privacy" className="font-mono text-[10px] text-slate-600 hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
