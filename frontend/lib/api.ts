import axios, { type AxiosInstance } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://web-production-65eed.up.railway.app";

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// ── Types ─────────────────────────────────────────────────────

export type ConversionType =
  | "pdf_to_markdown"
  | "pdf_to_markdown_ocr"
  | "ocr_image"
  | "image_convert"
  | "image_bg_remove"
  | "table_extract"
  | "pdf_compress"
  | "pdf_merge"
  | "pdf_split"
  | "pdf_rotate"
  | "pdf_unlock";

export type OutputFormat = "markdown" | "json" | "text" | "csv" | "png" | "jpg" | "webp" | "avif" | "pdf";

export interface ConvertRequest {
  url?: string;
  to: OutputFormat;
  from?: string;
  options?: {
    ocr?: boolean;
    language?: "en" | "id" | "auto";
    quality?: number;
    width?: number;
    height?: number;
    compress?: boolean;
  };
}

export interface PaymentRequiredResponse {
  error: "payment_required";
  error_code: "X402_PAYMENT_REQUIRED";
  job_id: string;
  payment: {
    amount: string;       // USDC micro-units (6 decimals)
    amount_usd: string;   // human readable, e.g. "0.005"
    currency: "USDC";
    network: "base";
    chain_id: number;
    recipient: `0x${string}`;
    expires_at: number;
  };
  estimate: {
    pages?: number;
    size_mb?: number;
    duration_seconds?: number;
  };
}

export interface JobResponse {
  job_id: string;
  status: "pending_payment" | "queued" | "processing" | "complete" | "failed";
  result?: {
    format: OutputFormat;
    content?: string;
    metadata?: Record<string, unknown>;
  };
  download_url?: string;
  expires_at?: string;
  cost?: { amount: string; currency: string; usd: string };
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface PricingResponse {
  currency: string;
  network: string;
  prices: Record<string, { amount: string; unit: string }>;
  discounts: Record<string, string>;
}

// ── API Calls ────────────────────────────────────────────────

export async function getPricing(): Promise<PricingResponse> {
  const { data } = await api.get("/api/v1/pricing");
  return data;
}

export async function initiateConvert(
  req: ConvertRequest,
  file?: File
): Promise<PaymentRequiredResponse | JobResponse> {
  try {
    if (file) {
      const form = new FormData();
      form.append("file", file);
      form.append("to", req.to);
      if (req.options) form.append("options", JSON.stringify(req.options));
      const { data } = await api.post("/api/v1/convert/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } else {
      const { data } = await api.post("/api/v1/convert", req);
      return data;
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 402) {
      return err.response.data as PaymentRequiredResponse;
    }
    throw err;
  }
}

export async function submitWithPayment(
  req: ConvertRequest,
  jobId: string,
  txHash: string,
  file?: File
): Promise<JobResponse> {
  if (file) {
    const form = new FormData();
    form.append("file", file);
    form.append("to", req.to);
    if (req.options) form.append("options", JSON.stringify(req.options));
    const { data } = await api.post("/api/v1/convert/upload", form, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Payment-Tx": txHash,
        "X-Payment-Job": jobId,
      },
    });
    return data;
  }
  const { data } = await api.post("/api/v1/convert", req, {
    headers: { "X-Payment-Tx": txHash, "X-Payment-Job": jobId },
  });
  return data;
}

export async function getJob(jobId: string): Promise<JobResponse> {
  const { data } = await api.get(`/api/v1/jobs/${jobId}`);
  return data;
}

export async function pollUntilDone(
  jobId: string,
  onUpdate?: (job: JobResponse) => void,
  maxWaitMs = 120_000
): Promise<JobResponse> {
  const start = Date.now();
  let delay = 1000;
  while (Date.now() - start < maxWaitMs) {
    const job = await getJob(jobId);
    onUpdate?.(job);
    if (job.status === "complete" || job.status === "failed") return job;
    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay * 1.5, 5000);
  }
  throw new Error("Job timed out");
}
