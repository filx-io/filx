"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { X, Zap, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { type PaymentRequiredResponse } from "@/lib/api";
import { USDC_ADDRESS } from "@/lib/wagmi";

// Minimal ERC-20 ABI for transfer
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

interface Props {
  paymentInfo: PaymentRequiredResponse;
  onSuccess: (txHash: string) => void;
  onCancel: () => void;
}

export function PaymentModal({ paymentInfo, onSuccess, onCancel }: Props) {
  const { address } = useAccount();
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync } = useWriteContract();

  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  // When tx confirmed, call onSuccess
  if (isSuccess && txHash) {
    onSuccess(txHash);
  }
  if (isError && txHash) {
    toast.error("Transaction failed on-chain. Please try again.");
    setTxHash(undefined);
    setIsPaying(false);
  }

  const handlePay = async () => {
    if (!address) { toast.error("Wallet not connected"); return; }
    setIsPaying(true);

    try {
      const hash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [
          paymentInfo.payment.recipient,
          parseUnits(paymentInfo.payment.amount_usd, 6),
        ],
        chainId: paymentInfo.payment.chain_id,
      });
      setTxHash(hash);
      toast.info("Transaction submitted! Waiting for confirmation…");
    } catch (err: unknown) {
      const error = err as { message?: string };
      if (error.message?.includes("User rejected")) {
        toast.error("Transaction rejected.");
      } else {
        toast.error("Transaction failed. Please try again.");
        console.error(err);
      }
      setIsPaying(false);
    }
  };

  const isWaiting = isPaying && !!txHash;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!isPaying ? onCancel : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0c0d12] border border-white/[0.08] rounded-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md border border-white/[0.08] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#3b82f6]" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-slate-200 text-sm tracking-wide">Payment Required</h3>
              <p className="font-mono text-xs text-slate-500">x402 Protocol · Base Chain</p>
            </div>
          </div>
          {!isPaying && (
            <button onClick={onCancel} className="p-1.5 rounded-md hover:bg-white/[0.04] transition-colors text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Amount */}
        <div className="p-5 space-y-5">
          <div className="text-center space-y-1">
            <div className="font-mono font-black text-5xl text-[#3b82f6]">
              ${paymentInfo.payment.amount_usd}
            </div>
            <div className="font-mono text-slate-500 text-xs">
              USDC on Base · Job #{paymentInfo.job_id.slice(-8)}
            </div>
          </div>

          {/* Estimate */}
          {paymentInfo.estimate && (
            <div className="grid grid-cols-3 gap-2">
              {paymentInfo.estimate.pages && (
                <div className="text-center p-3 rounded-md border border-white/[0.06]">
                  <div className="font-mono font-bold text-slate-200">{paymentInfo.estimate.pages}</div>
                  <div className="font-mono text-xs text-slate-500">pages</div>
                </div>
              )}
              {paymentInfo.estimate.size_mb && (
                <div className="text-center p-3 rounded-md border border-white/[0.06]">
                  <div className="font-mono font-bold text-slate-200">{paymentInfo.estimate.size_mb.toFixed(1)}</div>
                  <div className="font-mono text-xs text-slate-500">MB</div>
                </div>
              )}
              {paymentInfo.estimate.duration_seconds && (
                <div className="text-center p-3 rounded-md border border-white/[0.06]">
                  <div className="font-mono font-bold text-slate-200">~{paymentInfo.estimate.duration_seconds}s</div>
                  <div className="font-mono text-xs text-slate-500">est. time</div>
                </div>
              )}
            </div>
          )}

          {/* Security note */}
          <div className="flex items-start gap-2.5 p-3 rounded-md border border-white/[0.06] font-mono text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
            <p>Payment goes directly on-chain. FilX.io cannot access your wallet beyond this transaction.</p>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={isPaying}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-[#3b82f6] text-white font-mono font-bold text-sm
              hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWaiting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming on Base…
              </>
            ) : isPaying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Check your wallet…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Pay ${paymentInfo.payment.amount_usd} USDC
              </>
            )}
          </button>

          {txHash && (
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 font-mono text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              View on BaseScan <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
