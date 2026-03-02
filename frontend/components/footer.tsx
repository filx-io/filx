export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo + tagline */}
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-slate-300 tracking-wider">
            <span className="text-[#3b82f6]">#</span> filx.io
          </span>
          <span className="text-slate-700 text-xs font-mono hidden sm:block">
            / x402 file conversion infrastructure
          </span>
        </div>

        {/* Copyright */}
        <p className="font-mono text-xs text-slate-700">
          © 2025 FilX.io · MIT License
        </p>
      </div>
    </footer>
  );
}
