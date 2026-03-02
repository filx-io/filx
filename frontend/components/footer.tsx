import Link from "next/link";
import { Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo + tagline */}
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-slate-300 tracking-wider">
            <span className="text-[#3b82f6]">#</span> FILX
          </span>
          <span className="text-slate-700 text-xs font-mono hidden sm:block">
            / x402 file conversion infrastructure
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-mono text-slate-600">
          <Link href="/docs" className="hover:text-slate-300 transition-colors tracking-wide">
            Docs
          </Link>
          <Link href="/pricing" className="hover:text-slate-300 transition-colors tracking-wide">
            Pricing
          </Link>
          <a
            href="https://twitter.com/filx_io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Twitter className="w-3.5 h-3.5" />
            @filx_io
          </a>
          <a
            href="https://github.com/filx-io/web"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>

        {/* Copyright */}
        <p className="font-mono text-xs text-slate-700">
          © 2025 FilX.io · MIT License
        </p>
      </div>
    </footer>
  );
}
