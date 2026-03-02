"use client";

import { useState, useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { DropZone } from "./DropZone";
import { UrlInput } from "./UrlInput";
import { FormatSelector } from "./FormatSelector";
import { OptionPanel } from "./OptionPanel";
import { PriceEstimate } from "./PriceEstimate";
import { JobProgress } from "./JobProgress";
import { ResultPanel } from "./ResultPanel";
import { PaymentModal } from "../payment/PaymentModal";
import {
  type ConvertRequest,
  type JobResponse,
  type PaymentRequiredResponse,
  initiateConvert,
  pollUntilDone,
} from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link2 } from "lucide-react";

export type ConvertStep =
  | "idle"
  | "ready"
  | "awaiting_payment"
  | "processing"
  | "complete"
  | "error";

export function FileConverter() {
  // Input
  const [inputMode, setInputMode] = useState<"file" | "url">("file");
  const [file, setFile]           = useState<File | null>(null);
  const [url, setUrl]             = useState("");
  const [outputFormat, setOutputFormat] = useState<ConvertRequest["to"]>("markdown");
  const [options, setOptions]     = useState<ConvertRequest["options"]>({});

  // State machine
  const [step, setStep]           = useState<ConvertStep>("idle");
  const [paymentInfo, setPaymentInfo] = useState<PaymentRequiredResponse | null>(null);
  const [jobId, setJobId]         = useState<string | null>(null);
  const [job, setJob]             = useState<JobResponse | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { isConnected } = useAccount();

  const hasInput = inputMode === "file" ? !!file : !!url.trim();

  // ── Step 1: User clicks "Convert" ────────────────────────
  const handleConvert = useCallback(async () => {
    if (!hasInput) { toast.error("Please provide a file or URL."); return; }

    setStep("processing");

    const req: ConvertRequest = {
      url: inputMode === "url" ? url : undefined,
      to: outputFormat,
      options,
    };

    try {
      const res = await initiateConvert(req, inputMode === "file" ? (file ?? undefined) : undefined);

      if ("error" in res && res.error === "payment_required") {
        // x402 flow: show payment modal
        setPaymentInfo(res as PaymentRequiredResponse);
        setJobId((res as PaymentRequiredResponse).job_id);
        setStep("awaiting_payment");
        setShowPaymentModal(true);
      } else {
        // Direct result (shouldn't happen without payment but for testing)
        const j = res as JobResponse;
        setJobId(j.job_id);
        setStep("processing");
        startPolling(j.job_id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to start conversion. Please try again.");
      setStep("error");
    }
  }, [hasInput, inputMode, url, file, outputFormat, options]);

  // ── Step 2: Payment confirmed → submit with tx hash ──────
  const handlePaymentComplete = useCallback(async (txHash: string) => {
    setShowPaymentModal(false);
    setStep("processing");

    const req: ConvertRequest = {
      url: inputMode === "url" ? url : undefined,
      to: outputFormat,
      options,
    };

    try {
      const { submitWithPayment } = await import("@/lib/api");
      const j = await submitWithPayment(
        req,
        jobId!,
        txHash,
        inputMode === "file" ? (file ?? undefined) : undefined
      );
      setJob(j);
      startPolling(j.job_id);
    } catch (err) {
      console.error(err);
      toast.error("Submission failed after payment. Contact support with tx: " + txHash);
      setStep("error");
    }
  }, [inputMode, url, outputFormat, options, jobId, file]);

  // ── Step 3: Poll until done ───────────────────────────────
  // Use a ref to keep a stable reference without triggering dep warnings
  const startPollingRef = useRef(async (jId: string) => {
    try {
      const done = await pollUntilDone(jId, (updated) => setJob(updated));
      setJob(done);
      if (done.status === "complete") {
        setStep("complete");
        toast.success("Conversion complete! 🎉");
      } else {
        setStep("error");
        toast.error(`Conversion failed: ${done.error ?? "Unknown error"}`);
      }
    } catch {
      setStep("error");
      toast.error("Job timed out. Please check your dashboard.");
    }
  });
  const startPolling = startPollingRef.current;

  const handleReset = () => {
    setFile(null); setUrl(""); setStep("idle");
    setJob(null); setJobId(null); setPaymentInfo(null);
  };

  return (
    <div className="space-y-4">
      {/* ── Input section ── */}
      {(step === "idle" || step === "ready") && (
        <div className="rounded-md border border-white/[0.06] bg-[#0a0b0f] overflow-hidden">
          {/* Input mode tabs */}
          <Tabs
            value={inputMode}
            onValueChange={(v) => setInputMode(v as "file" | "url")}
            className="w-full"
          >
            <TabsList className="w-full rounded-none border-b border-border bg-muted/50 h-12">
              <TabsTrigger value="file" className="flex-1 gap-2 data-[state=active]:bg-background">
                <Upload className="w-4 h-4" /> Upload File
              </TabsTrigger>
              <TabsTrigger value="url" className="flex-1 gap-2 data-[state=active]:bg-background">
                <Link2 className="w-4 h-4" /> Paste URL
              </TabsTrigger>
            </TabsList>

            <div className="p-6 space-y-6">
              <TabsContent value="file" className="mt-0">
                <DropZone
                  file={file}
                  onFile={(f) => { setFile(f); setStep("ready"); }}
                  onClear={() => { setFile(null); setStep("idle"); }}
                />
              </TabsContent>

              <TabsContent value="url" className="mt-0">
                <UrlInput
                  value={url}
                  onChange={(v) => { setUrl(v); setStep(v ? "ready" : "idle"); }}
                />
              </TabsContent>

              {/* Format + options */}
              {hasInput && (
                <>
                  <div className="border-t border-border pt-6 grid md:grid-cols-2 gap-6">
                    <FormatSelector
                      value={outputFormat}
                      onChange={setOutputFormat}
                      inputFile={file ?? undefined}
                      inputUrl={url}
                    />
                    <OptionPanel
                      format={outputFormat}
                      options={options}
                      onChange={setOptions}
                    />
                  </div>

                  <PriceEstimate
                    file={file ?? undefined}
                    url={url}
                    format={outputFormat}
                    onConvert={handleConvert}
                    isConnected={isConnected}
                  />
                </>
              )}
            </div>
          </Tabs>
        </div>
      )}

      {/* ── Progress / Result ── */}
      {step === "processing" && (
        <JobProgress job={job} />
      )}

      {step === "complete" && job && (
        <ResultPanel job={job} onReset={handleReset} />
      )}

      {step === "error" && (
        <div className="rounded-md border border-red-900/40 bg-red-950/20 p-6 text-center space-y-3">
          <p className="text-destructive font-medium">Conversion failed</p>
          <p className="text-sm text-muted-foreground">{job?.error ?? "Unknown error occurred"}</p>
          <button
            onClick={handleReset}
            className="text-sm underline text-muted-foreground hover:text-foreground"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Payment Modal ── */}
      {showPaymentModal && paymentInfo && (
        <PaymentModal
          paymentInfo={paymentInfo}
          onSuccess={handlePaymentComplete}
          onCancel={() => { setShowPaymentModal(false); setStep("idle"); }}
        />
      )}
    </div>
  );
}
