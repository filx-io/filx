"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FileText, LayoutDashboard, BookOpen, Twitter } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg filx-gradient text-white font-black text-sm">
            FX
          </span>
          <span className="filx-gradient-text">FilX.io</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/#convert" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> Convert
          </Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/docs" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Docs
          </Link>
          <a
            href="https://twitter.com/filx_io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Twitter className="w-4 h-4" /> @filx_io
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ConnectButton
            label="Connect Wallet"
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  );
}
