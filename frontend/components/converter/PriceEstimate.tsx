"use client";

import { useQuery } from "@tanstack/react-query";
import { getPricing, type ConvertRequest } from "@/lib/api";
import { Zap, Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";

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
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Price info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              {price ? (
                <>
                  <span className="text-xl font-black">${price.amount}</span>
                  <span className="text-sm text-muted-foreground">{price.unit}</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground animate-pulse">Loading price…</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              USDC on Base · {estimatedSize} MB
            </div>
          </div>
        </div>

        {/* CTA */}
        {isConnected ? (
          <button
            onClick={onConvert}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm",
              "filx-gradient text-white shadow-md hover:opacity-90 transition-opacity"
            )}
          >
            <Zap className="w-4 h-4" />
            Convert &amp; Pay
          </button>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Wallet className="w-4 h-4" /> Connect wallet to pay
            </span>
            <ConnectButton label="Connect Wallet" />
          </div>
        )}
      </div>

      {price && (
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
          💡 Hold <strong>$FILX</strong> token for 50% discount · USDC auto-approved via EIP-3009
        </p>
      )}
    </div>
  );
}
