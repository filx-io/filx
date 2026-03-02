import { Github, BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08090d]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="https://filx.io" className="font-mono font-bold text-lg text-slate-200 tracking-wider hover:text-white transition-colors">
          <span className="text-[#3b82f6]">#</span> FliX
        </a>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            {/* X / Twitter */}
            <a
              href="https://x.com/filx_io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-200 transition-colors"
              aria-label="X"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Docs */}
            <a
              href="https://api.filx.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-slate-500 hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Docs
            </a>

            {/* Investors */}
            <a
              href="mailto:investors@filx.io"
              className="font-mono text-xs text-slate-500 hover:text-slate-200 transition-colors"
            >
              Investors
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/filx-io/web"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-slate-500 hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>

          <div className="w-px h-4 bg-white/[0.06] hidden sm:block" />

          {/* Launch App CTA */}
          <a
            href="https://app.filx.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#3b82f6]/40 text-[#3b82f6] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#3b82f6]/10 transition-colors"
          >
            Launch App →
          </a>
        </div>
      </div>
    </header>
  );
}
