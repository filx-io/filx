"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Zap,
  ShoppingBag,
  TrendingUp,
  Tag,
  Gift,
  Copy,
  Check,
  ExternalLink,
  Rocket,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

const TOKEN_FEATURES = [
  {
    icon: Zap,
    title: "Pay-per-Convert",
    desc: "Agents pay via Bankr wallet — no private keys needed. Natural language payments on Base chain.",
  },
  {
    icon: ShoppingBag,
    title: "Converter Marketplace",
    desc: "List and discover conversion services — document processing, OCR, image optimization. Fees paid in $FILX.",
  },
  {
    icon: TrendingUp,
    title: "Volume Rewards",
    desc: "High-volume converters earn $FILX rewards automatically — incentivizing consistent platform usage.",
  },
  {
    icon: Tag,
    title: "Token Discounts",
    desc: "Pay for conversions with $FILX at reduced rates vs USDC.",
  },
  {
    icon: Gift,
    title: "Early Adopter Incentives",
    desc: "First 100 agents earn bonus $FILX. Milestone rewards for conversions, API calls, and first payments.",
  },
  {
    icon: Rocket,
    title: "Token Launchpad",
    desc: "Launch $FILX token via Bankr. Trading fees fund compute costs. Self-sustaining from day one.",
  },
];

const PAYMENT_LOG = [
  {
    time: "just now",
    desc: "pdf-converter reward — 99.1% (7d rolling)",
    amount: "+75",
    token: "$FILX",
    status: "green",
  },
  {
    time: "1s ago",
    desc: "ocr-engine → image-optimizer (inference)",
    amount: "-500",
    token: "$FILX",
    status: "green",
  },
  {
    time: "3s ago",
    desc: "table-extractor → pdf-converter (batch job)",
    amount: "-150",
    token: "$FILX",
    status: "green",
  },
  {
    time: "7s ago",
    desc: "Test: agent-to-agent micro-payment",
    amount: "-100",
    token: "$FILX",
    status: "yellow",
  },
  {
    time: "12s ago",
    desc: "image-optimizer reward — first 10 jobs",
    amount: "+200",
    token: "$FILX",
    status: "green",
  },
  {
    time: "18s ago",
    desc: "ocr-engine → table-extractor (CSV export)",
    amount: "-200",
    token: "$FILX",
    status: "green",
  },
];

const AGENTS = [
  {
    name: "pdf-converter",
    tag: "Document",
    tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    uptime: "97.2%",
    desc: "High-fidelity PDF to Markdown converter with heading, table, and list preservation.",
    price: "100 $FILX/job",
    jobs: "12 jobs",
  },
  {
    name: "ocr-engine",
    tag: "Processing",
    tagColor: "text-green-400 bg-green-500/10 border-green-500/20",
    uptime: "99.1%",
    desc: "Multi-language OCR for scanned PDFs and images. English + Indonesian. Powered by Tesseract.",
    price: "150 $FILX/page",
    jobs: "8 jobs",
  },
  {
    name: "image-optimizer",
    tag: "Media",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    uptime: "99.6%",
    desc: "Smart image conversion, compression, and background removal. WebP/AVIF/PNG/JPG.",
    price: "200 $FILX/image",
    jobs: "5 jobs",
  },
  {
    name: "table-extractor",
    tag: "Compute",
    tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    uptime: "96.8%",
    desc: "Extract tables from PDFs and images to CSV or JSON. Ready for data pipelines.",
    price: "500 $FILX/job",
    jobs: "3 jobs",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusDot({ color }: { color: "green" | "yellow" }) {
  return (
    <span
      className={
        color === "green"
          ? "inline-block w-2 h-2 rounded-full bg-green-400"
          : "inline-block w-2 h-2 rounded-full bg-yellow-400"
      }
    />
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded text-slate-500 hover:text-slate-200 transition-colors"
      aria-label="Copy address"
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-400" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LaunchPage() {
  return (
    <main className="min-h-screen bg-[#08090d] font-mono text-slate-300">
      {/* ── A. Token Ticker Bar ── */}
      <section className="w-full bg-[#0d0f17] border-b border-white/5 py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400 font-mono">
          <span className="text-center">
            <span className="text-blue-400 font-bold">#</span>{" "}
            <span className="text-slate-200 font-bold">$FILX</span>{" "}
            <span className="text-slate-300">$0.000000</span>
            <span className="mx-2 text-white/20">|</span>
            <span>Vol <span className="text-slate-300">$0</span></span>
            <span className="mx-2 text-white/20">|</span>
            <span>MCap <span className="text-slate-300">$0</span></span>
            <span className="mx-2 text-white/20">|</span>
            <span>Liq <span className="text-slate-300">$0</span></span>
            <span className="mx-2 text-white/20">|</span>
            <span className="text-slate-400">Base · Uniswap</span>
          </span>

          <div className="flex items-center gap-1 text-xs border border-white/5 rounded px-2 py-0.5 bg-[#0a0c14]">
            <span className="text-slate-500">CA:</span>
            <span className="text-slate-300 tracking-tight">
              {CONTRACT_ADDRESS.slice(0, 8)}…{CONTRACT_ADDRESS.slice(-6)}
            </span>
            <CopyButton text={CONTRACT_ADDRESS} />
          </div>
        </div>
      </section>

      {/* ── B. Two-Column Layout ── */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Connect Card */}
        <div className="flex flex-col gap-6">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-sm tracking-widest">
              FX
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-200 tracking-wide">FilX</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                File Conversion Infrastructure
              </p>
            </div>
          </div>

          {/* Connect Card */}
          <div className="rounded-xl border border-white/10 bg-[#0d0f17] p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold text-slate-100 mb-1">Connect to Web4</h2>
              <p className="text-sm text-slate-500">
                Connect with Base chain wallet to access the platform
              </p>
            </div>

            {/* ConnectButton */}
            <div>
              <ConnectButton.Custom>
                {({ openConnectModal, connectModalOpen }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm tracking-wide"
                  >
                    Connect Wallet →
                  </button>
                )}
              </ConnectButton.Custom>
            </div>

            {/* Network label */}
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-blue-400 font-bold tracking-widest uppercase">
                Base Mainnet
              </span>
            </div>

            {/* Supported wallets */}
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-wider mb-2">
                Supported Wallets
              </p>
              <div className="flex flex-wrap gap-2">
                {/* Bankr Wallet — first position */}
                <span className="flex items-center gap-1.5 text-xs text-blue-400 border border-blue-500/30 rounded px-2 py-1 bg-blue-500/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                  Bankr Wallet
                </span>
                {["MetaMask", "Coinbase", "WalletConnect", "Embedded"].map((w) => (
                  <span
                    key={w}
                    className="flex items-center gap-1.5 text-xs text-slate-400 border border-white/5 rounded px-2 py-1 bg-[#0a0c14]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* Connect with Bankr */}
            <a
              href="https://bankr.bot/api"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-6 rounded-lg border border-[#3b82f6]/40 text-[#3b82f6] font-mono font-bold text-sm tracking-wide hover:bg-[#3b82f6]/10 transition-colors"
            >
              ⚡ Connect with Bankr →
            </a>

            {/* Agent Setup Guide link */}
            <a
              href="#"
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Agent Setup Guide
            </a>

            {/* Footer */}
            <p className="text-xs text-slate-600 pt-2 border-t border-white/5">
              Powered by Bankr · x402 Protocol · Base Network · USDC Settlement
            </p>
          </div>
        </div>

        {/* Right — Token Economy */}
        <div className="rounded-xl border border-white/10 bg-[#0d0f17] p-6 flex flex-col gap-5">
          {/* Badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded px-2.5 py-1 uppercase tracking-widest">
              $ FILX TOKEN
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">File Economy</h2>
            <p className="text-sm text-slate-500">
              The native token powering autonomous file conversion infrastructure
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-4">
            {TOKEN_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="flex gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-md bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-200">{f.title}</span>
                    <span className="text-slate-500"> — </span>
                    <span className="text-sm text-slate-400">{f.desc}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Bottom badges */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
            {[
              { label: "Base Chain", color: "bg-blue-500" },
              { label: "x402 Protocol", color: "bg-indigo-500" },
              { label: "$FILX Native", color: "bg-cyan-500" },
            ].map((b) => (
              <span
                key={b.label}
                className="flex items-center gap-1.5 text-xs text-slate-400 border border-white/5 rounded px-2 py-1 bg-[#0a0c14]"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${b.color} inline-block`} />
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── C. Payment Log ── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-center font-mono font-bold text-slate-200 text-lg mb-6 tracking-wide">
          💳 PAYMENT LOG
        </h2>

        <div className="rounded-xl border border-white/10 bg-[#0d0f17] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-slate-600 uppercase tracking-widest">
                  <th className="text-left px-4 py-3">Time</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-right px-4 py-3">Token</th>
                  <th className="text-center px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {PAYMENT_LOG.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.time}</td>
                    <td className="px-4 py-3 text-slate-300">{row.desc}</td>
                    <td
                      className={`px-4 py-3 text-right font-bold whitespace-nowrap ${
                        row.amount.startsWith("+") ? "text-green-400" : "text-slate-300"
                      }`}
                    >
                      {row.amount}
                    </td>
                    <td className="px-4 py-3 text-right text-blue-400 whitespace-nowrap">
                      {row.token}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusDot color={row.status as "green" | "yellow"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-slate-600 py-3 border-t border-white/5 px-4">
            Live testnet transactions · $FILX on Base · x402 protocol · Auto-refresh every 4s
          </p>
        </div>
      </section>

      {/* ── D. Agent Marketplace ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-center font-mono font-bold text-slate-200 text-lg mb-6 tracking-wide">
          🏪 AGENT MARKETPLACE
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="rounded-xl border border-white/10 bg-[#0d0f17] p-5 flex flex-col gap-3 hover:border-white/20 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">{agent.name}</h3>
                  <span
                    className={`inline-block text-xs font-bold border rounded px-2 py-0.5 mt-1 ${agent.tagColor}`}
                  >
                    {agent.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                  {agent.uptime} uptime
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed">{agent.desc}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-blue-400 font-bold">{agent.price}</span>
                <span className="text-slate-600">{agent.jobs}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Agent services discovered automatically · Payments settle via $FILX on Base · Ratings based on uptime and completion rate
        </p>
      </section>
    </main>
  );
}
