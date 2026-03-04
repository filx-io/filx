import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pt-12 pb-8 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/[0.06]">

          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <Image src="/assets/logo.jpg" alt="FilX" width={28} height={28} className="rounded-sm" />
              <span className="font-mono font-bold text-slate-200 text-lg tracking-wider">FilX</span>
            </div>
            <p className="font-mono text-slate-600 text-xs leading-relaxed max-w-xs">
              The x402 File Primitive for AI agents.<br />
              Powered by Base. Settled in USDC.
            </p>
            <p className="font-mono text-[10px] text-slate-700 uppercase tracking-widest">
              x402 Protocol · Built for agents, by agents.
            </p>
          </div>

          {/* Col 2: Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Links</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Docs",           href: "https://filx.io/docs" },
                { label: "Launch App",     href: "https://app.filx.io" },
                { label: "GitHub",         href: "https://github.com/filx-io/filx" },
                { label: "X / Twitter",    href: "https://x.com/filx_io" },
                { label: "x402 Protocol",  href: "https://x402.org" },
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

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Contact</h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:hello@filx.io"
                className="font-mono text-xs text-slate-500 hover:text-slate-200 transition-colors"
              >
                hello@filx.io
              </a>
              <a
                href="/terms"
                className="font-mono text-xs text-slate-500 hover:text-slate-200 transition-colors"
              >
                Terms of Use
              </a>
              <a
                href="/privacy"
                className="font-mono text-xs text-slate-500 hover:text-slate-200 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] text-slate-700">
            © 2026 FILX.io All Rights Reserved.
          </p>
          <p className="font-mono text-[10px] text-slate-700">
            x402 File Primitive
          </p>
        </div>

      </div>
    </footer>
  );
}
