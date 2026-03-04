"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

const CONTRACT = "0x8bE535Ae4bf7A8D56237f1Cc8b3211650241aBa3";
const BANKR_URL =
  "https://bankr.bot/launches/0x8bE535Ae4bf7A8D56237f1Cc8b3211650241aBa3";
const BASESCAN_URL = `https://basescan.org/token/${CONTRACT}`;

const UTILITIES = [
  {
    icon: "💸",
    title: "Fee Discounts",
    desc: "Holding $PRIM unlocks tiered discounts on FilX API operations. The more you hold, the less you pay per file op.",
    color: "text-green-400",
    border: "border-green-400/20",
    bg: "bg-green-400/5",
  },
  {
    icon: "⚡",
    title: "Rate Limit Boost",
    desc: "$PRIM holders get elevated throughput — more concurrent jobs, higher ops/min, and priority queue placement.",
    color: "text-yellow-400",
    border: "border-yellow-400/20",
    bg: "bg-yellow-400/5",
  },
  {
    icon: "🗳️",
    title: "Governance",
    desc: "Vote on new endpoints, pricing curves, and protocol parameters. $PRIM is the governance token of the FilX file primitive.",
    color: "text-[#3b82f6]",
    border: "border-[#3b82f6]/20",
    bg: "bg-[#3b82f6]/5",
  },
  {
    icon: "💰",
    title: "Revenue Share",
    desc: "A portion of all FilX API fees flows back to $PRIM liquidity providers. The more the API gets used, the more value accrues.",
    color: "text-purple-400",
    border: "border-purple-400/20",
    bg: "bg-purple-400/5",
  },
  {
    icon: "🔑",
    title: "Early Access",
    desc: "$PRIM holders get priority access to beta endpoints and new file format support before public launch.",
    color: "text-orange-400",
    border: "border-orange-400/20",
    bg: "bg-orange-400/5",
  },
  {
    icon: "🤖",
    title: "Agent Registry",
    desc: "Agents that stake $PRIM earn verified status in the FilX ecosystem — on-chain signal of trust for x402 file ops.",
    color: "text-cyan-400",
    border: "border-cyan-400/20",
    bg: "bg-cyan-400/5",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
      title="Copy contract address"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      <span className="font-mono text-xs">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}

export function PrimToken() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-3">
          <p className="font-mono text-purple-400 text-xs uppercase tracking-widest font-bold">
            // $PRIM token
          </p>
          <h2 className="font-mono font-black text-slate-200 text-3xl md:text-4xl uppercase tracking-widest leading-tight">
            The FilX<br />
            <span className="text-purple-400">Network Token</span>
          </h2>
          <p className="font-mono text-slate-500 text-sm max-w-xl mx-auto">
            $PRIM aligns incentives across agents, builders, and API consumers.
            Deployed on Base, live on Bankr.
          </p>
        </div>

        {/* Token info card */}
        <div className="border border-white/10 bg-[#0d0f17] p-6 md:p-8 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-white/5">
            <div className="space-y-1">
              <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">Ticker</p>
              <p className="font-mono font-black text-purple-400 text-xl">$PRIM</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">Chain</p>
              <p className="font-mono font-bold text-slate-200 text-sm">Base</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">Standard</p>
              <p className="font-mono font-bold text-slate-200 text-sm">ERC-20</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">Launched via</p>
              <p className="font-mono font-bold text-slate-200 text-sm">Bankr</p>
            </div>
          </div>

          {/* Contract address */}
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
              Contract Address (Base)
            </p>
            <div className="flex items-center justify-between gap-4 bg-[#08090d] border border-white/10 px-4 py-3 overflow-x-auto">
              <span className="font-mono text-slate-300 text-xs md:text-sm whitespace-nowrap select-all">
                {CONTRACT}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <CopyButton text={CONTRACT} />
                <a
                  href={BASESCAN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                  title="View on Basescan"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="font-mono text-xs">Basescan</span>
                </a>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={BANKR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-mono font-semibold text-sm tracking-wide hover:bg-purple-500 transition-colors"
            >
              Buy $PRIM on Bankr
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={BASESCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-white/10 text-slate-300 font-mono font-semibold text-sm tracking-wide hover:border-white/25 hover:text-white transition-colors"
            >
              View on Basescan
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Utility heading */}
        <div className="space-y-2">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // token utility
          </p>
          <h3 className="font-mono font-black text-slate-200 text-xl md:text-2xl uppercase tracking-widest">
            What $PRIM Does
          </h3>
        </div>

        {/* Utility grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {UTILITIES.map((item) => (
            <div
              key={item.title}
              className={`border ${item.border} ${item.bg} p-5 space-y-3 hover:border-white/20 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className={`font-mono font-bold text-sm uppercase tracking-widest ${item.color}`}>
                  {item.title}
                </span>
              </div>
              <p className="font-mono text-slate-500 text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="border border-white/5 bg-[#0d0f17] px-6 py-4">
          <p className="font-mono text-slate-600 text-xs text-center leading-relaxed">
            $PRIM utility features are progressively activated as the FilX protocol grows.
            <br />
            Fee discounts and early access are live. Governance and revenue share launching Q2 2026.
          </p>
        </div>

      </div>
    </section>
  );
}
