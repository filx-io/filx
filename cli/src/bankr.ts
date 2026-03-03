/**
 * Bankr API client — internal, not exposed to users.
 * Users interact with `filx` commands; Bankr is the underlying wallet infra.
 */
import { config, BANKR_API } from "./config.js";

async function bankrFetch(
  path: string,
  options: RequestInit = {},
  apiKey?: string
): Promise<Response> {
  const key = apiKey ?? config.get("bankrApiKey");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (key) headers["Authorization"] = `Bearer ${key}`;

  return fetch(`${BANKR_API}${path}`, { ...options, headers });
}

export interface WalletInfo {
  address: string;
  email: string;
  balance?: string;
}

/** Initiate email OTP login via Bankr */
export async function initiateLogin(email: string): Promise<{ token: string }> {
  const res = await bankrFetch("/v1/auth/email/init", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.statusText}`);
  return res.json();
}

/** Verify OTP and get API key */
export async function verifyOtp(
  email: string,
  otp: string,
  token: string
): Promise<{ api_key: string; wallet_address: string }> {
  const res = await bankrFetch("/v1/auth/email/verify", {
    method: "POST",
    body: JSON.stringify({ email, otp, token }),
  });
  if (!res.ok) throw new Error(`OTP verification failed: ${res.statusText}`);
  return res.json();
}

/** Get wallet info */
export async function getWhoami(): Promise<WalletInfo> {
  const res = await bankrFetch("/v1/wallet/me");
  if (!res.ok) throw new Error(`Failed to fetch wallet: ${res.statusText}`);
  return res.json();
}

/** Get USDC balance on Base */
export async function getBalance(): Promise<{ usdc: string; eth: string; chain: string }> {
  const res = await bankrFetch("/v1/wallet/balance");
  if (!res.ok) throw new Error(`Failed to fetch balance: ${res.statusText}`);
  return res.json();
}

/** Natural language prompt — Bankr routes the intent + pays */
export async function sendPrompt(
  prompt: string,
  dryRun = false
): Promise<{ result: string; cost_usdc?: string; tx_hash?: string }> {
  const res = await bankrFetch("/v1/prompt", {
    method: "POST",
    body: JSON.stringify({ prompt, dry_run: dryRun }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Prompt failed: ${err}`);
  }
  return res.json();
}

/** Sign an x402 PAYMENT-REQUIRED header */
export async function signX402(paymentRequired: string): Promise<string> {
  const res = await bankrFetch("/v1/x402/sign", {
    method: "POST",
    body: JSON.stringify({ payment_required: paymentRequired }),
  });
  if (!res.ok) throw new Error(`Signing failed: ${res.statusText}`);
  const data: { payment_signature: string } = await res.json();
  return data.payment_signature;
}

/** Rotate and return a new API key */
export async function rotateApiKey(): Promise<string> {
  const res = await bankrFetch("/v1/auth/api-key/rotate", { method: "POST" });
  if (!res.ok) throw new Error(`Failed to rotate API key: ${res.statusText}`);
  const data: { api_key: string } = await res.json();
  return data.api_key;
}
