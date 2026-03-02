import Link from "next/link";
import { Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg filx-gradient text-white font-black text-xs">FX</span>
          <span className="font-bold">FilX.io</span>
          <span className="text-muted-foreground text-sm ml-2">
            The x402 File Converter Primitive
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <a
            href="https://twitter.com/filx_io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Twitter className="w-3.5 h-3.5" /> @filx_io
          </a>
          <a
            href="https://github.com/filx-io/web"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" /> GitHub
          </a>
        </div>

        <p className="text-xs text-muted-foreground">
          © 2025 FilX.io · MIT License · Built on Base ⬜
        </p>
      </div>
    </footer>
  );
}
