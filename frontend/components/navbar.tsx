"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Github, BookOpen, Zap } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08090d]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="font-mono font-bold text-lg text-slate-200 tracking-wider hover:text-white transition-colors">
          <span className="text-[#3b82f6]">#</span> FILX
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Social icons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://x.com/filx_io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-200 transition-colors"
              aria-label="X (formerly Twitter)"
            >
              {/* X (formerly Twitter) logo */}
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <Link
              href="/docs"
              className="text-slate-500 hover:text-slate-200 transition-colors"
              aria-label="Docs"
            >
              <BookOpen className="w-4 h-4" />
            </Link>
            <a
              href="https://bankr.bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-5 h-5 rounded font-mono font-black text-[10px] text-[#3b82f6] border border-[#3b82f6]/40 hover:bg-[#3b82f6]/10 transition-colors leading-none"
              aria-label="Bankr"
              title="Powered by Bankr"
            >
              B
            </a>
            <a
              href="https://github.com/filx-io/web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-200 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          <div className="w-px h-4 bg-white/[0.06] hidden sm:block" />

          {/* Launch App link */}
          <Link
            href="https://app.filx.io"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#3b82f6]/40 text-[#3b82f6] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#3b82f6]/10 transition-colors"
          >
            <Zap className="w-3 h-3" />
            App
          </Link>

          <ConnectButton
            label="Connect"
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  );
}
