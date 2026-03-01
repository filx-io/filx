# FilX.io — Architecture & User Flow
> Section 1 of the FilX.io Technical Specification  
> The x402 File Converter Primitive for AI Agents

---

## 1. Vision & Design Principles

FilX.io is a **primitive service** — it does one thing perfectly: convert files.  
Designed for AI agents first, humans second.

| Principle | Implementation |
|-----------|---------------|
| Agent-native | HTTP 402 x402 payment, JSON-first responses, OpenAPI spec |
| Zero-friction | Pay → Convert → Get result in 1 round-trip (small files) |
| Cheap & fast | $0.001–$0.05 per job, <30s for most conversions |
| Stateless API | Jobs are ephemeral; storage auto-expires in 1h |
| Composable | Works as MCP tool, AutoGPT action, LangGraph node |

---

## 2. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FILX.IO SYSTEM                                │
│                                                                         │
│  ┌──────────────┐         ┌─────────────────────────────────────────┐  │
│  │   CLIENTS    │         │              BACKEND (api.filx.io)      │  │
│  │              │         │                                         │  │
│  │  AI Agents   │◄──────► │  ┌────────────┐    ┌────────────────┐  │  │
│  │  (MCP/Auto   │  HTTP   │  │  FastAPI   │    │  Task Queue    │  │  │
│  │  GPT/Crew/   │  402    │  │  API Gate  │───►│  (Celery +     │  │  │
│  │  LangGraph)  │         │  │            │    │   Redis)       │  │  │
│  │              │         │  └─────┬──────┘    └───────┬────────┘  │  │
│  │  Human Users │         │        │                   │           │  │
│  │  (Browser /  │         │  ┌─────▼──────┐    ┌───────▼────────┐  │  │
│  │   Dashboard) │         │  │  x402      │    │  Conversion    │  │  │
│  └──────────────┘         │  │  Payment   │    │  Workers       │  │  │
│                            │  │  Verifier  │    │  (PDF/OCR/IMG) │  │  │
│  ┌──────────────┐         │  └─────┬──────┘    └───────┬────────┘  │  │
│  │  FRONTEND    │         │        │                   │           │  │
│  │  (filx.io)   │         │  ┌─────▼──────┐    ┌───────▼────────┐  │  │
│  │              │         │  │ PostgreSQL  │    │ Cloudflare R2  │  │  │
│  │  Next.js 15  │◄──────► │  │  (jobs,    │    │ (file storage, │  │  │
│  │  App Router  │  REST   │  │  payments) │    │  1h TTL)       │  │  │
│  │  + shadcn    │         │  └────────────┘    └────────────────┘  │  │
│  └──────────────┘         └─────────────────────────────────────────┘  │
│                                          │                              │
│                            ┌─────────────▼───────────────────────────┐ │
│                            │         BASE CHAIN (USDC)               │ │
│                            │  x402 Payment Verification               │ │
│                            │  (Coinbase AgentKit / viem)             │ │
│                            └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. x402 Payment Protocol Flow

The x402 protocol is an HTTP-native micropayment standard.  
FilX.io uses it for **every conversion request**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      x402 PAYMENT FLOW                                  │
│                                                                         │
│   AGENT/CLIENT                   FILX API              BASE CHAIN       │
│       │                              │                      │           │
│       │  POST /convert               │                      │           │
│       │  {file_url, output_format}   │                      │           │
│       │─────────────────────────────►│                      │           │
│       │                              │                      │           │
│       │  HTTP 402 Payment Required   │                      │           │
│       │  X-Payment-Required: {       │                      │           │
│       │    amount: "0.005",          │                      │           │
│       │    currency: "USDC",         │                      │           │
│       │    network: "base",          │                      │           │
│       │    address: "0xFILX...",     │                      │           │
│       │    expires: 1234567890,      │                      │           │
│       │    job_id: "jb_abc123"       │                      │           │
│       │  }                           │                      │           │
│       │◄─────────────────────────────│                      │           │
│       │                              │                      │           │
│       │  (Agent pays on-chain)       │                      │           │
│       │─────────────────────────────────────────────────────►           │
│       │                              │                      │           │
│       │  POST /convert               │                      │           │
│       │  X-Payment-Tx: "0xtx..."     │                      │           │
│       │─────────────────────────────►│                      │           │
│       │                              │  verify tx_hash      │           │
│       │                              │─────────────────────►│           │
│       │                              │  ✅ confirmed         │           │
│       │                              │◄─────────────────────│           │
│       │                              │                      │           │
│       │  HTTP 200 OK                 │                      │           │
│       │  {job_id, status: queued}    │                      │           │
│       │◄─────────────────────────────│                      │           │
│       │                              │                      │           │
│       │  GET /jobs/{job_id}          │                      │           │
│       │─────────────────────────────►│                      │           │
│       │  {status: complete,          │                      │           │
│       │   download_url: "...",       │                      │           │
│       │   result: {...}}             │                      │           │
│       │◄─────────────────────────────│                      │           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Payment Header Spec

```
Request:  POST /api/v1/convert
Response: 402 Payment Required

Headers returned:
  X-Payment-Required: base64(JSON)
  
JSON structure:
{
  "version": "1.0",
  "service": "filx.io",
  "job_id": "jb_abc123xyz",
  "payment": {
    "type": "eip3009",           // EIP-3009 transferWithAuthorization
    "amount": "5000",            // in USDC base units (6 decimals), = $0.005
    "currency": "USDC",
    "network": "base",
    "chain_id": 8453,
    "recipient": "0xFILX_TREASURY_ADDRESS",
    "contract": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  },
  "expires_at": 1700000000,
  "estimate": {
    "pages": 5,
    "size_mb": 2.1,
    "duration_seconds": 8,
    "quality": "high"
  }
}

Subsequent request with payment:
  X-Payment-Tx: "0x{transaction_hash}"
  X-Payment-Job: "jb_abc123xyz"
```

---

## 4. Human User Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       HUMAN USER JOURNEY                                │
│                                                                         │
│  filx.io (Next.js Dashboard)                                            │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  LANDING PAGE                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │  🗂️ Drop file here or paste URL                         │    │  │
│  │  │  ──────────────────────────────────────────────────     │    │  │
│  │  │  [ PDF ] [ Image ] [ OCR ] [ Table ] [ PDF Tools ]      │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  │                                                                  │  │
│  │  Step 1: Upload or paste URL                                     │  │
│  │       ↓                                                          │  │
│  │  Step 2: Select output format + options                          │  │
│  │       ↓                                                          │  │
│  │  Step 3: See price estimate ($0.002)                             │  │
│  │       ↓                                                          │  │
│  │  Step 4: Connect wallet (RainbowKit / MetaMask)                  │  │
│  │       ↓                                                          │  │
│  │  Step 5: Approve USDC + sign tx (one-click)                      │  │
│  │       ↓                                                          │  │
│  │  Step 6: Real-time progress bar (WebSocket / polling)            │  │
│  │       ↓                                                          │  │
│  │  Step 7: Download result / Copy URL / View inline                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Pages:                                                                 │
│    / ............... Landing + Converter (main tool)                    │
│    /dashboard ....... Job history, usage stats, API key                 │
│    /pricing ......... Pricing calculator                                │
│    /docs ............ Auto-generated from OpenAPI                       │
│    /api-explorer .... Try the API directly in browser                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. AI Agent Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AI AGENT JOURNEY                                 │
│                         (MCP / LangGraph)                               │
│                                                                         │
│  # Example: LangGraph node calling FilX.io                              │
│                                                                         │
│  ┌─────────────────────┐    ┌──────────────────────────────────────┐   │
│  │   AGENT WORKFLOW    │    │         FILX.IO API                  │   │
│  │                     │    │                                      │   │
│  │  1. Has a PDF URL   │    │                                      │   │
│  │     "s3://..."      │    │                                      │   │
│  │         │           │    │                                      │   │
│  │  2. Call filx tool  │───►│  POST /api/v1/convert               │   │
│  │     convert_pdf()   │    │  {"url": "s3://...", "to": "md"}    │   │
│  │                     │◄───│  402 + payment_details              │   │
│  │  3. x402 client     │    │                                      │   │
│  │     auto-pays       │───►│  POST /api/v1/convert               │   │
│  │     (EIP-3009)      │    │  X-Payment-Tx: "0x..."              │   │
│  │                     │◄───│  200 {"job_id": "jb_..."}           │   │
│  │  4. Poll or         │    │                                      │   │
│  │     webhook         │───►│  GET /api/v1/jobs/jb_...            │   │
│  │                     │◄───│  {"status":"complete","markdown":""}│   │
│  │  5. Use result      │    │                                      │   │
│  │     in next LLM     │    │                                      │   │
│  │     call            │    │                                      │   │
│  └─────────────────────┘    └──────────────────────────────────────┘   │
│                                                                         │
│  Supported agent frameworks:                                            │
│    ✅ MCP (Model Context Protocol) — tool manifest included             │
│    ✅ LangGraph / LangChain — tool wrapper included                     │
│    ✅ AutoGPT — action plugin                                           │
│    ✅ CrewAI — tool class                                               │
│    ✅ OpenAI Assistants — function calling spec                         │
│    ✅ Raw HTTP — works with any HTTP client                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Data Flow & Job Lifecycle

```
Job States:
  
  PENDING_PAYMENT  →  QUEUED  →  PROCESSING  →  COMPLETE  →  [EXPIRED]
       │                                              │
       └── PAYMENT_FAILED              ┌─────────────┘
                                       │
                                  FAILED (with error details)

Persistence:
  - Job metadata: PostgreSQL (permanent for paid jobs)
  - Input files:  Cloudflare R2 (TTL: 1 hour after job complete)  
  - Output files: Cloudflare R2 (TTL: 1 hour, presigned URLs)
  - Payment log:  PostgreSQL (permanent, for reconciliation)
```

---

## 7. Network & Infrastructure Topology

```
                    ┌─────────────────────────────────────┐
                    │         CLOUDFLARE (CDN + DNS)       │
                    │  filx.io, *.filx.io                  │
                    │  DDoS protection, edge caching       │
                    └──────────────┬──────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
    ┌─────────▼─────────┐  ┌───────▼───────┐  ┌────────▼────────┐
    │   RAILWAY (EU)     │  │  RAILWAY (EU) │  │  Cloudflare R2  │
    │   frontend         │  │  backend      │  │  Object Storage │
    │   Next.js 15       │  │  FastAPI      │  │  Input/Output   │
    │   Port: 3000       │  │  Port: 8000   │  │  Files          │
    └───────────────────┘  │  + Celery      │  └─────────────────┘
                            │  Workers       │
                            └───────┬────────┘
                                    │
                         ┌──────────▼─────────┐
                         │  RAILWAY MANAGED   │
                         │  PostgreSQL        │
                         │  Redis             │
                         └────────────────────┘
```

---

## 8. Conversion Capabilities Matrix

| Feature | Input | Output | Library | Avg Time | Price |
|---------|-------|--------|---------|----------|-------|
| PDF → Markdown | PDF | .md / JSON | Docling | 5-30s | $0.002/page |
| PDF → Markdown (OCR) | Scanned PDF | .md / JSON | Docling + Tesseract | 10-60s | $0.004/page |
| Image → Text (OCR) | PNG/JPG/TIFF | .txt / JSON | Tesseract / EasyOCR | 3-10s | $0.003/img |
| Image Convert | PNG/JPG/WebP/AVIF | PNG/JPG/WebP/AVIF | Pillow + libvips | <5s | $0.001/img |
| Image Optimize | Any image | Compressed | Pillow + Squoosh | <5s | $0.001/img |
| Background Remove | PNG/JPG | PNG (transparent) | rembg | 5-15s | $0.005/img |
| Table Extract | PDF/Image | CSV / JSON | Camelot + img2table | 5-20s | $0.003/page |
| PDF Compress | PDF | PDF | Ghostscript | 3-15s | $0.002/file |
| PDF Merge | PDF[] | PDF | pypdf | 2-5s | $0.002/merge |
| PDF Split | PDF | PDF[] | pypdf | 2-5s | $0.002/file |
| PDF Rotate | PDF | PDF | pypdf | <2s | $0.001/file |
| PDF Unlock | PDF | PDF | pikepdf | <5s | $0.003/file |

---

## 9. Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                                 │
│                                                                         │
│  Layer 1: Cloudflare                                                    │
│    - DDoS protection                                                    │
│    - Rate limiting (100 req/min per IP)                                 │
│    - Bot protection                                                     │
│    - TLS 1.3 only                                                       │
│                                                                         │
│  Layer 2: API Gateway (FastAPI middleware)                              │
│    - x402 payment verification (can't skip)                             │
│    - File type validation (magic bytes, not just extension)             │
│    - File size limits (max 50MB per file, 200MB batch)                  │
│    - Content Security Policy                                            │
│    - CORS whitelist                                                     │
│                                                                         │
│  Layer 3: Worker Sandboxing                                             │
│    - Celery workers in isolated containers                              │
│    - No network access from worker (only R2)                            │
│    - CPU/memory limits per job                                          │
│    - Timeout per job type                                               │
│                                                                         │
│  Layer 4: Payment Integrity                                             │
│    - On-chain tx verification (not just agent claims)                   │
│    - Replay attack prevention (nonce per job_id)                        │
│    - Amount verification (exact USDC amount)                            │
│    - Block confirmation check (1 confirmation min)                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Environment Variables Reference

All env vars across the stack:

```bash
# === BACKEND ===
# App
APP_ENV=production
APP_SECRET_KEY=your-secret-key-here
APP_BASE_URL=https://api.filx.io
FRONTEND_URL=https://filx.io

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/filxio

# Redis
REDIS_URL=redis://localhost:6379/0

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=your-cf-account-id
R2_ACCESS_KEY_ID=your-r2-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret
R2_BUCKET_NAME=filx-jobs
R2_PUBLIC_URL=https://files.filx.io

# x402 / Base Chain
X402_TREASURY_ADDRESS=0xYOUR_TREASURY_ADDRESS
X402_RPC_URL=https://mainnet.base.org
X402_CHAIN_ID=8453
X402_USDC_CONTRACT=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
X402_PAYMENT_EXPIRY_SECONDS=300

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
LOG_LEVEL=INFO

# Optional: Webhook
WEBHOOK_SECRET=your-webhook-secret

# === FRONTEND ===
NEXT_PUBLIC_API_URL=https://api.filx.io
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_TREASURY_ADDRESS=0xYOUR_TREASURY_ADDRESS
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-wc-project-id
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```
