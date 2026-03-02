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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isPaying ? onCancel : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg filx-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Payment Required</h3>
              <p className="text-xs text-muted-foreground">x402 Protocol · Base Chain</p>
            </div>
          </div>
          {!isPaying && (
            <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Amount */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <div className="text-5xl font-black filx-gradient-text">
              ${paymentInfo.payment.amount_usd}
            </div>
            <div className="text-muted-foreground text-sm">
              USDC on Base · Job #{paymentInfo.job_id.slice(-8)}
            </div>
          </div>

          {/* Estimate */}
          {paymentInfo.estimate && (
            <div className="grid grid-cols-3 gap-3">
              {paymentInfo.estimate.pages && (
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <div className="font-bold">{paymentInfo.estimate.pages}</div>
                  <div className="text-xs text-muted-foreground">pages</div>
                </div>
              )}
              {paymentInfo.estimate.size_mb && (
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <div className="font-bold">{paymentInfo.estimate.size_mb.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">MB</div>
                </div>
              )}
              {paymentInfo.estimate.duration_seconds && (
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <div className="font-bold">~{paymentInfo.estimate.duration_seconds}s</div>
                  <div className="text-xs text-muted-foreground">est. time</div>
                </div>
              )}
            </div>
          )}

          {/* Security note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
            <p>Payment goes directly on-chain. FilX.io cannot access your wallet beyond this transaction.</p>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={isPaying}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl filx-gradient text-white font-bold text-base
              hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
          >
            {isWaiting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Confirming on Base…
              </>
            ) : isPaying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Check your wallet…
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Pay ${paymentInfo.payment.amount_usd} USDC
              </>
            )}
          </button>

          {txHash && (
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View on BaseScan <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
