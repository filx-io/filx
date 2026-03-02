"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Twitter, Github } from "lucide-react";

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
              href="https://twitter.com/filx_io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-200 transition-colors"
              aria-label="Twitter / X"
            >
              <Twitter className="w-4 h-4" />
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
