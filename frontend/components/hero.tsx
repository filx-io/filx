"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

export function Hero() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-10">

        {/* Main heading */}
        <div className="space-y-2">
          <h1 className="font-mono font-black text-5xl md:text-7xl tracking-widest uppercase text-slate-100 leading-none">
            FILE CONVERSION
          </h1>
          <h1 className="font-mono font-black text-5xl md:text-7xl tracking-widest uppercase text-[#3b82f6] leading-none">
            INFRASTRUCTURE
          </h1>
        </div>

        {/* Description */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="font-mono text-slate-400 text-base md:text-lg leading-relaxed">
            Convert any file — <strong className="text-slate-200">PDF to Markdown</strong>,{" "}
            <strong className="text-slate-200">OCR</strong>, image transforms, table extraction —
            with instant <strong className="text-slate-200">USDC micropayments</strong> on Base chain.
          </p>
          <p className="font-mono text-slate-500 text-sm md:text-base leading-relaxed">
            Built for <strong className="text-slate-300">MCP</strong>,{" "}
            <strong className="text-slate-300">LangGraph</strong>,{" "}
            <strong className="text-slate-300">AutoGPT</strong> &amp;{" "}
            <strong className="text-slate-300">CrewAI</strong>. One HTTP call, one micropayment, one result.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/#convert"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#3b82f6] text-white font-mono font-semibold text-sm tracking-wide hover:bg-[#2563eb] transition-colors"
          >
            Start Converting
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL ?? "https://web-production-65eed.up.railway.app"}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md border border-white/[0.12] text-slate-300 font-mono font-semibold text-sm tracking-wide hover:border-white/25 hover:text-white transition-colors"
          >
            API Docs
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://github.com/filx-io/web"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md border border-white/[0.12] text-slate-300 font-mono font-semibold text-sm tracking-wide hover:border-white/25 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>

        {/* Subtle tag line */}
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">
          x402 Native · USDC on Base · Agent-First
        </p>
      </div>
    </section>
  );
}
