/**
 * FliX.io — API client helpers
 * Base URL: https://api.filx.io
 */

export const API_BASE = "https://api.filx.io";

// ── Response Types ────────────────────────────────────────────

export interface HealthResponse {
  status: "ok";
  service: string;
  version: string;
}

export interface PriceEntry {
  amount: string;  // USDC amount as string, e.g. "0.002"
  unit: string;    // e.g. "per page"
}

export interface PricingResponse {
  currency: "USDC";
  network: "base";
  chain_id: number;
  decimals: number;
  prices: Record<string, PriceEntry>;
  discounts: Record<string, string>;
  notes: Record<string, string>;
}

export interface FileOutput {
  url: string;        // Temporary download URL — expires in 1 hour
  expires_at: string; // ISO 8601 timestamp
}

export interface TextOutput {
  content: string;
  pages_processed: number;
  cost_usdc: string;
}

export interface CompressOutput extends FileOutput {
  original_size: number;
  compressed_size: number;
  reduction_pct: number;
}

export interface ResizeOutput extends FileOutput {
  width: number;
  height: number;
}

export interface MultiFileOutput {
  urls: string[];
  expires_at: string;
}

export interface TableExtractOutput {
  tables: Array<{
    page: number;
    headers: string[];
    rows: string[][];
  }>;
  tables_found: number;
  cost_usdc: string;
}

export interface OcrOutput {
  text: string;
  confidence: number;
  cost_usdc: string;
}

/** x402 Payment Required response — returned when PAYMENT-SIGNATURE is missing */
export interface PaymentRequiredError {
  error: "payment_required";
  operation: string;
  amount: string;       // USDC human-readable, e.g. "0.002"
  currency: "USDC";
  network: "base";
  message: string;
  docs: string;
}

/** Decoded PAYMENT-REQUIRED header (base64 JSON) */
export interface PaymentRequiredHeader {
  scheme: "exact";
  network: "base";
  currency: "USDC";
  amount: string;       // USDC micro-units (6 decimals), e.g. "2000" = $0.002
  amount_usdc: string;  // human-readable, e.g. "0.002"
  recipient: `0x${string}`;
  operation: string;
}

export interface ApiError {
  error: string;
  message: string;
}

// ── Converter Types ───────────────────────────────────────────

export type ConvertFormat = "markdown" | "json" | "text" | "csv" | "png" | "jpg" | "webp" | "pdf";

export interface ConvertOptions {
  ocr?: boolean;
  language?: "en" | "id" | "auto";
  quality?: number;
  width?: number;
  height?: number;
}

export interface ConvertRequest {
  /** Source: public URL or uploaded file URL */
  url: string;
  /** Target output format */
  to: ConvertFormat;
  /** Optional page range for PDFs, e.g. "1-5" */
  pages?: string;
  /** Format-specific options */
  options?: ConvertOptions;
}

export interface JobResult {
  content?: string;
  format?: string;
  metadata?: Record<string, unknown>;
}

export interface JobResponse {
  job_id: string;
  status: "queued" | "processing" | "complete" | "error";
  download_url?: string;
  expires_at?: string;
  result?: JobResult;
  cost?: { usd: string };
  error?: string;
}

// ── Helpers ───────────────────────────────────────────────────

/** Decode the PAYMENT-REQUIRED header from a 402 response */
export function decodePaymentRequired(header: string): PaymentRequiredHeader {
  return JSON.parse(atob(header)) as PaymentRequiredHeader;
}

/** Fetch with x402 handling — returns response or throws */
export async function fetchApi(
  path: string,
  body: Record<string, unknown>,
  paymentSignature?: string
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (paymentSignature) {
    headers["PAYMENT-SIGNATURE"] = paymentSignature;
  }
  return fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

export async function getPricing(): Promise<PricingResponse> {
  const res = await fetch(`${API_BASE}/api/v1/pricing`);
  if (!res.ok) throw new Error("Failed to fetch pricing");
  return res.json();
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("API health check failed");
  return res.json();
}
