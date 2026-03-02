"use client";

import { useQuery } from "@tanstack/react-query";
import { getPricing, type ConvertRequest } from "@/lib/api";
import { Zap, Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const FORMAT_TO_TYPE: Record<string, string> = {
  markdown: "pdf_to_markdown",
  json:     "pdf_to_markdown",
  text:     "ocr_image",
  csv:      "table_extract",
  png:      "image_convert",
  jpg:      "image_convert",
  webp:     "image_convert",
  avif:     "image_convert",
  pdf:      "pdf_compress",
};

interface Props {
  file?: File;
  url?: string;
  format: ConvertRequest["to"];
  onConvert: () => void;
  isConnected: boolean;
}

export function PriceEstimate({ file, url: _url, format, onConvert, isConnected }: Props) {
  const { data: pricing } = useQuery({
    queryKey: ["pricing"],
    queryFn: getPricing,
    staleTime: 5 * 60 * 1000,
  });

  const priceType = FORMAT_TO_TYPE[format] ?? "image_convert";
  const price = pricing?.prices[priceType];
  const estimatedSize = file ? (file.size / 1024 / 1024).toFixed(1) : "?";

  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Price info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md border border-white/[0.08]">
            <Zap className="w-4 h-4 text-[#3b82f6]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              {price ? (
                <>
                  <span className="font-mono font-black text-xl text-slate-200">${price.amount}</span>
                  <span className="font-mono text-xs text-slate-500">{price.unit}</span>
                </>
              ) : (
                <span className="font-mono text-xs text-slate-600 animate-pulse">Loading price…</span>
              )}
            </div>
            <div className="font-mono text-xs text-slate-600">
              USDC on Base · {estimatedSize} MB
            </div>
          </div>
        </div>

        {/* CTA */}
        {isConnected ? (
          <button
            onClick={onConvert}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#3b82f6] text-white font-mono font-semibold text-sm hover:bg-[#2563eb] transition-colors"
          >
            <Zap className="w-4 h-4" />
            Convert &amp; Pay
          </button>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-slate-500 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" /> Connect wallet to pay
            </span>
            <ConnectButton label="Connect" />
          </div>
        )}
      </div>

      {price && (
        <p className="font-mono text-xs text-slate-600 mt-3 pt-3 border-t border-white/[0.06]">
          Hold <strong className="text-slate-400">$FILX</strong> token for 50% discount · USDC auto-approved via EIP-3009
        </p>
      )}
    </div>
  );
}
