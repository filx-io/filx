"use client";

import { ArrowDown, Zap, Shield, Bot } from "lucide-react";
import Link from "next/link";

const badges = [
  { icon: Zap,    label: "x402 Native",    color: "text-yellow-500" },
  { icon: Bot,    label: "Agent-First",    color: "text-blue-500"   },
  { icon: Shield, label: "USDC on Base",   color: "text-purple-500" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {badges.map(({ icon: Icon, label, color }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/60 bg-muted/50 text-sm font-medium"
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              {label}
            </span>
          ))}
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="filx-gradient-text">FilX</span>
            <span className="text-foreground">.io</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-foreground/80">
            The x402 File Converter Primitive
            <br className="hidden md:block" />
            <span className="text-muted-foreground"> for AI Agents</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Convert any file — PDF to Markdown, OCR, Image transforms, Table extraction —
          with instant <strong className="text-foreground">USDC micropayments</strong> on Base chain.
          Built for <strong className="text-foreground">MCP, LangGraph, AutoGPT & CrewAI</strong>.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#convert"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl filx-gradient text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
          >
            Start Converting
            <ArrowDown className="w-4 h-4" />
          </Link>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL ?? "https://web-production-65eed.up.railway.app"}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border hover:bg-muted transition-colors font-semibold"
          >
            API Docs
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/40 max-w-md mx-auto">
          {[
            { value: "$0.001", label: "min per job" },
            { value: "<30s",   label: "avg convert time" },
            { value: "11+",    label: "format types" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black filx-gradient-text">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
