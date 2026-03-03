"use client";

import { ArrowRight, Github } from "lucide-react";

export function Hero() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-10">

        {/* Terminal prompt */}
        <div className="flex justify-center">
          <div className="bg-[#0a0c14] border border-white/10 px-6 py-3 text-left inline-block">
            <p className="font-mono text-green-400 text-sm">
              <span className="text-slate-500">&gt;</span> filx.convert(<span className="text-yellow-400">&quot;document.pdf&quot;</span>, <span className="text-yellow-400">&quot;markdown&quot;</span>)
            </p>
            <p className="font-mono text-slate-500 text-xs mt-1.5">
              HTTP 402 → Pay <span className="text-green-400">$0.002 USDC</span> → <span className="text-blue-400">Done.</span>
            </p>
          </div>
        </div>

        {/* Badge */}
        <div className="flex justify-center">
          <span className="font-mono text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest border border-[#3b82f6]/40 px-4 py-1.5">
            ✦ x402 FILE PRIMITIVE · BASE CHAIN · USDC
          </span>
        </div>

        {/* Main heading */}
        <div className="space-y-2">
          <h1 className="font-mono font-black text-4xl md:text-6xl tracking-widest uppercase text-slate-100 leading-tight">
            THE x402<br />
            <span className="text-[#3b82f6]">FILE PRIMITIVE</span>
          </h1>
        </div>

        {/* One-liner */}
        <p className="font-mono font-bold text-slate-300 text-base md:text-lg tracking-wide">
          20+ file conversion endpoints. No API keys. No accounts. Just HTTP + USDC.
        </p>

        {/* Body */}
        <p className="font-mono text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Today&apos;s AI agents can think, reason, and code — but they can&apos;t process files independently.
          FliX gives agents the ability to convert, extract, and transform any document or image,
          paying per-use with USDC on Base chain via the x402 protocol.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href="https://filx.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] text-white font-mono font-semibold text-sm tracking-wide hover:bg-[#2563eb] transition-colors"
          >
            Read the Docs
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/filx-io/web"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/10 text-slate-300 font-mono font-semibold text-sm tracking-wide hover:border-white/25 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
          <a
            href="https://app.filx.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/10 text-slate-300 font-mono font-semibold text-sm tracking-wide hover:border-white/25 hover:text-white transition-colors"
          >
            Launch App →
          </a>
        </div>

        {/* Subtle terminal line */}
        <div className="overflow-x-auto">
          <p className="font-mono text-[11px] text-slate-600 whitespace-nowrap">
            $ curl -X POST https://api.filx.io/api/v1/pdf/to-markdown -d &apos;{"{"}
            &quot;url&quot;:&quot;...&quot;{"}"}&apos; → <span className="text-yellow-600">402 Payment Required</span>
          </p>
        </div>
      </div>
    </section>
  );
}
