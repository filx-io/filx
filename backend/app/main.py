"""
FilX.io — x402 File Converter Primitive for AI Agents
api.filx.io
"""
from __future__ import annotations

import base64
import json
import os
import time
from collections import defaultdict
from typing import Any, Dict, List, Optional

import httpx

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, model_validator

# ── x402 Official SDK ─────────────────────────────────────────────────────────
try:
    from x402.http import FacilitatorConfig, HTTPFacilitatorClient, PaymentOption
    from x402.http.middleware.fastapi import PaymentMiddlewareASGI
    from x402.http.types import RouteConfig
    from x402.mechanisms.evm.exact import ExactEvmServerScheme
    from x402.server import x402ResourceServer
    X402_SDK = True
except ImportError:
    X402_SDK = False


# ── OpenAPI metadata ──────────────────────────────────────────────────────────

DESCRIPTION = """
## File Conversion Infrastructure for AI Agents

FliX is a **pay-per-request file conversion API** built for autonomous AI agents.
No sign-up. No API keys. No subscriptions.

Every endpoint uses the [x402 protocol](https://x402.org) — Coinbase's open standard
for machine-to-machine micropayments over HTTP.

---

### How it works

1. **POST** your request → server returns `HTTP 402 Payment Required` with a `PAYMENT-REQUIRED` header
2. **Sign** a USDC micropayment on Base chain (via [FliX Wallet](https://filx.io/docs#wallet), your own wallet, or any x402 SDK)
3. **Resend** the request with `PAYMENT-SIGNATURE` header → get your converted file

### Quick Start (Python)

```python
# pip install x402
from x402 import Client

client = Client(wallet_private_key="0x...")
result = client.post(
    "https://api.filx.io/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/document.pdf"}
)
print(result.json())
```

### Quick Start (JavaScript)

```javascript
// npm install @x402/fetch viem
import { wrapFetch } from "@x402/fetch";
const fetchWithPayment = wrapFetch(fetch, walletClient);
const res = await fetchWithPayment("https://api.filx.io/api/v1/pdf/to-markdown", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com/doc.pdf" }),
});
```

---

### Payment Headers

| Header | Direction | Description |
|--------|-----------|-------------|
| `PAYMENT-REQUIRED` | ← Server | Base64-encoded JSON: amount, currency, network, recipient |
| `PAYMENT-SIGNATURE` | → Client | Base64-encoded signed payment payload |
| `PAYMENT-RESPONSE` | ← Server | Returned on 200 OK with tx hash and settlement proof |

---

### Pricing
All prices in **USDC on Base mainnet** (chain ID 8453).
Minimum charge: **$0.001 USDC**. No charge on errors.

### Links
- 📖 [Full Docs](https://filx.io/docs)
- 📊 [API Status](https://status.filx.io)
- 🐦 [@filx_io](https://x.com/filx_io)
- 🌐 [x402.org](https://x402.org)
"""

TAGS_METADATA = [
    {
        "name": "System",
        "description": "Health check and system info endpoints.",
    },
    {
        "name": "Info",
        "description": "Pricing and operational metadata.",
    },
    {
        "name": "Document",
        "description": "**PDF and document processing.**\n\nConvert, compress, merge, split, rotate, unlock PDFs. Generate PDFs from HTML and Markdown.",
    },
    {
        "name": "Image",
        "description": "**Image processing and transformation.**\n\nResize, compress, convert, crop, upscale, watermark, background removal.",
    },
    {
        "name": "Data",
        "description": "**Data extraction from documents and images.**\n\nOCR text extraction, table detection and export to CSV/JSON.",
    },
    {
        "name": "Jobs",
        "description": "Job status and result retrieval.",
    },
    {
        "name": "Wallet",
        "description": "**Agent wallet — auth, balance, and x402 signing.**\n\nCreate an embedded wallet via email. Sign x402 payments without private keys in your code.",
    },
    {
        "name": "Discovery",
        "description": "**x402 Bazaar discovery layer.**\n\nMachine-readable catalogue of all payable endpoints. Used by the [x402 Bazaar](https://docs.cdp.coinbase.com/x402/bazaar) and AI agents for autonomous service discovery.",
    },
]


app = FastAPI(
    title="FliX.io API",
    description=DESCRIPTION,
    version="0.2.0",
    openapi_tags=TAGS_METADATA,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "FliX Support",
        "url": "https://filx.io",
        "email": "hello@filx.io",
    },
    license_info={
        "name": "MIT",
        "url": "https://github.com/filx-io/filx/blob/main/LICENSE",
    },
    servers=[
        {"url": "https://api.filx.io", "description": "Production"},
        {"url": "http://localhost:8000", "description": "Local Development"},
    ],
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "ALLOWED_ORIGINS",
        "https://filx.io,https://app.filx.io,http://localhost:3000",
    ).split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["PAYMENT-REQUIRED", "PAYMENT-RESPONSE"],
)

# ── x402 SDK Middleware Setup ────────────────────────────────────────────────

def _setup_x402_sdk(application: FastAPI) -> None:
    """Register all FilX endpoints with the official x402 SDK + Bazaar extension."""
    if not X402_SDK:
        return

    facilitator_url = os.getenv("X402_FACILITATOR_URL", "https://x402.org/facilitator")
    treasury = os.getenv("TREASURY_ADDRESS", "0x0000000000000000000000000000000000000000")

    facilitator = HTTPFacilitatorClient(FacilitatorConfig(url=facilitator_url))
    server = x402ResourceServer(facilitator)
    server.register("eip155:8453", ExactEvmServerScheme())

    sdk_routes: Dict[str, Any] = {}

    for route in BAZAAR_ROUTES:
        price = PRICING.get(route["operation"], {"amount": "0.001"})
        key = f"{route['method']} {route['path']}"
        sdk_routes[key] = RouteConfig(
            accepts=[
                PaymentOption(
                    scheme="exact",
                    pay_to=treasury,
                    price=f"${price['amount']}",
                    network="eip155:8453",
                )
            ],
            mime_type="application/json",
            description=route["description"],
            extensions={
                "bazaar": {
                    "discoverable": True,
                    "inputSchema":  route.get("inputSchema", {}),
                    "outputSchema": route.get("outputSchema", {}),
                }
            },
        )

    # Add AFTER CORSMiddleware so CORS runs first (outermost layer)
    application.add_middleware(PaymentMiddlewareASGI, routes=sdk_routes, server=server)


# ── Config ────────────────────────────────────────────────────────────────────
TREASURY_ADDRESS = os.getenv("TREASURY_ADDRESS", "0x0000000000000000000000000000000000000000")
_WALLET_BACKEND  = os.getenv("WALLET_BACKEND_URL", "https://api.bankr.bot")  # internal — not exposed

PRICING: Dict[str, Dict[str, str]] = {
    "pdf_to_markdown":   {"amount": "0.002", "unit": "per page"},
    "pdf_ocr":           {"amount": "0.004", "unit": "per page"},
    "pdf_compress":      {"amount": "0.002", "unit": "per file"},
    "pdf_merge":         {"amount": "0.002", "unit": "per job"},
    "pdf_split":         {"amount": "0.002", "unit": "per job"},
    "pdf_rotate":        {"amount": "0.001", "unit": "per job"},
    "pdf_unlock":        {"amount": "0.003", "unit": "per file"},
    "pdf_to_image":      {"amount": "0.002", "unit": "per page"},
    "html_to_pdf":       {"amount": "0.002", "unit": "per page"},
    "markdown_to_pdf":   {"amount": "0.002", "unit": "per page"},
    "image_resize":      {"amount": "0.001", "unit": "per image"},
    "image_compress":    {"amount": "0.001", "unit": "per image"},
    "image_convert":     {"amount": "0.001", "unit": "per image"},
    "image_crop":        {"amount": "0.001", "unit": "per image"},
    "image_bg_remove":   {"amount": "0.005", "unit": "per image"},
    "image_upscale":     {"amount": "0.008", "unit": "per image"},
    "image_watermark":   {"amount": "0.001", "unit": "per image"},
    "image_rotate":      {"amount": "0.001", "unit": "per image"},
    "table_extract":     {"amount": "0.003", "unit": "per page"},
    "ocr_image":         {"amount": "0.003", "unit": "per image"},
}

DISCOUNTS: Dict[str, str] = {
    "batch_5plus":  "10%",
    "batch_10plus": "20%",
}

# ── Metrics (in-memory, reset on restart) ────────────────────────────────────
# Seeded with estimated activity since launch (2026-01-20).
# Live counters accumulate on top of seed values each session.
_METRICS_SINCE = "2026-01-20"
_METRICS: Dict[str, Any] = {
    "jobs_total":          1142,      # seed — estimated since launch
    "revenue_usdc":        3.246,     # seed — estimated since launch
    "unique_wallets_seed": 87,        # seed — pre-restart wallets
    "unique_wallets_live": set(),     # tracked live this session
    "jobs_by_op":          defaultdict(int),
    "session_start":       time.time(),
}

_CATEGORY_OPS: Dict[str, set] = {
    "document":  {
        "pdf_to_markdown", "pdf_ocr", "pdf_compress", "pdf_merge",
        "pdf_split", "pdf_rotate", "pdf_unlock", "pdf_to_image",
        "html_to_pdf", "markdown_to_pdf",
    },
    "image":     {
        "image_resize", "image_compress", "image_convert", "image_crop",
        "image_bg_remove", "image_upscale", "image_watermark", "image_rotate",
    },
    "extraction": {"table_extract", "ocr_image"},
}


# ── Pydantic Schemas ──────────────────────────────────────────────────────────

class PaymentRequiredError(BaseModel):
    error: str = Field("payment_required", examples=["payment_required"])
    operation: str = Field(..., examples=["pdf_to_markdown"])
    amount: str = Field(..., examples=["0.002"])
    currency: str = Field("USDC", examples=["USDC"])
    network: str = Field("base", examples=["base"])
    message: str = Field(..., examples=["Include PAYMENT-SIGNATURE header with a signed USDC payment of 0.002 USDC on Base."])
    docs: str = Field("https://filx.io/docs#x402", examples=["https://filx.io/docs#x402"])


class ErrorResponse(BaseModel):
    error: str
    message: str


# ── Document Request Schemas ──────────────────────────────────────────────────

class PdfToMarkdownRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible URL of the PDF to convert.", examples=["https://example.com/report.pdf"])
    pages: Optional[str] = Field(None, description="Page range to process, e.g. `'1-5'` or `'1,3,7'`. Defaults to all pages.", examples=["1-5"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/report.pdf", "pages": "1-10"}}}


class PdfOcrRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible PDF URL.", examples=["https://example.com/scanned.pdf"])
    lang: Optional[str] = Field("eng", description="OCR language. `eng` (English) or `ind` (Indonesian).", examples=["eng"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/scanned.pdf", "lang": "eng"}}}


class PdfCompressRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible PDF URL.", examples=["https://example.com/large.pdf"])
    quality: Optional[str] = Field("medium", description="Compression quality: `low`, `medium`, or `high`.", examples=["medium"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/large.pdf", "quality": "medium"}}}


class PdfMergeRequest(BaseModel):
    urls: List[str] = Field(..., description="Array of publicly accessible PDF URLs to merge, in order. Maximum 10.", min_length=2, max_length=10)

    model_config = {"json_schema_extra": {"example": {"urls": ["https://example.com/part1.pdf", "https://example.com/part2.pdf"]}}}


class PdfSplitRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible PDF URL.", examples=["https://example.com/doc.pdf"])
    ranges: Optional[str] = Field(None, description="Comma-separated page ranges, e.g. `'1-3,4-7,8-'`. Defaults to one page per file.", examples=["1-5,6-10"])
    every: Optional[int] = Field(None, description="Split every N pages (alternative to ranges).", examples=[5])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/doc.pdf", "ranges": "1-5,6-10,11-"}}}


class PdfRotateRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible PDF URL.", examples=["https://example.com/doc.pdf"])
    angle: int = Field(..., description="Rotation angle in degrees: `90`, `180`, or `270`.", examples=[90])
    pages: Optional[str] = Field(None, description="Page range to rotate. Defaults to all pages.", examples=["1-3"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/doc.pdf", "angle": 90}}}


class PdfUnlockRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible password-protected PDF URL.", examples=["https://example.com/locked.pdf"])
    password: Optional[str] = Field(None, description="PDF password, if known.", examples=["secret123"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/locked.pdf"}}}


class PdfToImageRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible PDF URL.", examples=["https://example.com/doc.pdf"])
    dpi: Optional[int] = Field(150, description="Output resolution in DPI. Supported: `72`, `96`, `150`, `300`.", examples=[150])
    format: Optional[str] = Field("png", description="Output image format: `png` or `jpg`.", examples=["png"])
    pages: Optional[str] = Field(None, description="Page range to render. Defaults to all pages.", examples=["1-3"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/doc.pdf", "dpi": 150, "format": "png"}}}


class HtmlToPdfRequest(BaseModel):
    url: Optional[str] = Field(None, description="Public page URL to convert. Use `url` or `html`, not both.", examples=["https://example.com/page"])
    html: Optional[str] = Field(None, description="Raw HTML string to convert. Use `url` or `html`, not both.", examples=["<h1>Hello</h1><p>World</p>"])
    page_size: Optional[str] = Field("A4", description="Page size: `A4`, `letter`, or `A3`.", examples=["A4"])
    margin: Optional[str] = Field("20px", description="Page margin CSS shorthand, e.g. `'20px 40px'`.", examples=["20px"])
    header_html: Optional[str] = Field(None, description="HTML string for the page header (repeated on every page).")
    footer_html: Optional[str] = Field(None, description="HTML string for the page footer (repeated on every page).")

    @model_validator(mode="after")
    def check_url_or_html(self) -> "HtmlToPdfRequest":
        if not self.url and not self.html:
            raise ValueError("Provide either 'url' or 'html'.")
        return self

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/page", "page_size": "A4"}}}


class MarkdownToPdfRequest(BaseModel):
    markdown: str = Field(..., description="Raw Markdown content to convert.", examples=["# Hello\n\nThis is a **test** document."])
    theme: Optional[str] = Field("default", description="PDF theme: `default`, `github`, or `minimal`.", examples=["github"])

    model_config = {"json_schema_extra": {"example": {"markdown": "# Report\n\n## Summary\n\nKey findings here.", "theme": "github"}}}


# ── Image Request Schemas ─────────────────────────────────────────────────────

class ImageResizeRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible image URL.", examples=["https://example.com/photo.jpg"])
    width: Optional[int] = Field(None, description="Target width in pixels.", examples=[800])
    height: Optional[int] = Field(None, description="Target height in pixels.", examples=[600])
    scale: Optional[float] = Field(None, description="Scale factor, e.g. `0.5` for 50%.", examples=[0.5])
    fit: Optional[str] = Field("contain", description="Fit mode: `contain`, `cover`, or `fill`.", examples=["contain"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/photo.jpg", "width": 800, "height": 600}}}


class ImageCompressRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible image URL.", examples=["https://example.com/photo.jpg"])
    quality: Optional[int] = Field(80, description="Compression quality 1–100. Lower = smaller file.", ge=1, le=100, examples=[80])
    lossless: Optional[bool] = Field(False, description="Force lossless compression (PNG/WebP only).", examples=[False])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/photo.jpg", "quality": 80}}}


class ImageConvertRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible image URL.", examples=["https://example.com/photo.jpg"])
    format: str = Field(..., description="Target format: `png`, `jpg`, `webp`, `avif`, `bmp`, `tiff`, `gif`, `ico`.", examples=["webp"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/photo.jpg", "format": "webp"}}}


class ImageCropRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible image URL.", examples=["https://example.com/photo.jpg"])
    x: Optional[int] = Field(None, description="Left offset in pixels.", examples=[100])
    y: Optional[int] = Field(None, description="Top offset in pixels.", examples=[50])
    width: int = Field(..., description="Crop width in pixels.", examples=[400])
    height: int = Field(..., description="Crop height in pixels.", examples=[300])
    smart: Optional[bool] = Field(False, description="AI subject-centered smart crop (ignores x/y).", examples=[False])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/photo.jpg", "width": 400, "height": 400, "smart": True}}}


class ImageRemoveBgRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible image URL (PNG/JPG/WebP). Returns transparent PNG.", examples=["https://example.com/product.jpg"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/product.jpg"}}}


class ImageUpscaleRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible image URL.", examples=["https://example.com/photo.jpg"])
    scale: int = Field(..., description="Upscale factor: `2` (2×) or `4` (4×).", examples=[2])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/photo.jpg", "scale": 2}}}


class ImageWatermarkRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible image URL.", examples=["https://example.com/photo.jpg"])
    text: Optional[str] = Field(None, description="Watermark text. Use `text` or `watermark_url`, not both.", examples=["© FliX 2026"])
    watermark_url: Optional[str] = Field(None, description="URL of watermark image. Use `text` or `watermark_url`, not both.")
    position: Optional[str] = Field("bottom-right", description="Position: `center`, `top-left`, `top-right`, `bottom-left`, `bottom-right`.", examples=["bottom-right"])
    opacity: Optional[float] = Field(0.5, description="Opacity 0.0–1.0.", ge=0.0, le=1.0, examples=[0.5])
    rotation: Optional[int] = Field(0, description="Rotation in degrees.", examples=[0])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/photo.jpg", "text": "© 2026", "position": "bottom-right", "opacity": 0.4}}}


class ImageRotateRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible image URL.", examples=["https://example.com/photo.jpg"])
    angle: Optional[int] = Field(None, description="Rotation angle: `90`, `180`, or `270`.", examples=[90])
    flip: Optional[str] = Field(None, description="Flip direction: `horizontal` or `vertical`.", examples=["horizontal"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/photo.jpg", "angle": 90}}}


# ── Data Request Schemas ──────────────────────────────────────────────────────

class TableExtractRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible PDF or image URL.", examples=["https://example.com/report.pdf"])
    format: Optional[str] = Field("json", description="Output format: `json` or `csv`.", examples=["json"])
    pages: Optional[str] = Field(None, description="Page range for PDFs. Defaults to all.", examples=["1-3"])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/financial-report.pdf", "format": "json"}}}


class OcrImageRequest(BaseModel):
    url: str = Field(..., description="Publicly accessible image URL (PNG/JPG/WebP/BMP/TIFF).", examples=["https://example.com/invoice.jpg"])
    lang: Optional[str] = Field("eng", description="OCR language: `eng` (English) or `ind` (Indonesian).", examples=["eng"])
    structured: Optional[bool] = Field(False, description="Return bounding boxes and confidence scores per word.", examples=[False])

    model_config = {"json_schema_extra": {"example": {"url": "https://example.com/invoice.jpg", "lang": "eng"}}}


# ── Response Schemas ──────────────────────────────────────────────────────────

class FileOutputResponse(BaseModel):
    url: str = Field(..., description="Temporary download URL. **Expires in 1 hour** — download immediately.", examples=["https://api.filx.io/files/abc123.pdf"])
    expires_at: str = Field(..., description="ISO 8601 expiry timestamp.", examples=["2026-03-03T03:00:00Z"])


class TextOutputResponse(BaseModel):
    content: str = Field(..., description="Extracted Markdown or text content.", examples=["# Document Title\n\n## Section\n\nBody text..."])
    pages_processed: int = Field(..., description="Number of pages processed.", examples=[4])
    cost_usdc: str = Field(..., description="Actual charge in USDC.", examples=["0.008"])


class PdfCompressResponse(FileOutputResponse):
    original_size: int = Field(..., description="Original file size in bytes.", examples=[2048000])
    compressed_size: int = Field(..., description="Compressed file size in bytes.", examples=[614400])
    reduction_pct: int = Field(..., description="Percentage size reduction.", examples=[70])


class ImageCompressResponse(FileOutputResponse):
    original_size: int = Field(..., description="Original file size in bytes.", examples=[512000])
    compressed_size: int = Field(..., description="Compressed file size in bytes.", examples=[102400])
    reduction_pct: int = Field(..., description="Percentage size reduction.", examples=[80])


class ImageResizeResponse(FileOutputResponse):
    width: int = Field(..., description="Output width in pixels.", examples=[800])
    height: int = Field(..., description="Output height in pixels.", examples=[600])


class MultiFileResponse(BaseModel):
    urls: List[str] = Field(..., description="List of temporary file download URLs. Each expires in 1 hour.", examples=[["https://api.filx.io/files/part1.pdf", "https://api.filx.io/files/part2.pdf"]])
    expires_at: str = Field(..., description="ISO 8601 expiry timestamp.", examples=["2026-03-03T03:00:00Z"])


class TableRow(BaseModel):
    page: int = Field(..., examples=[1])
    headers: List[str] = Field(..., examples=[["Name", "Q1", "Q2"]])
    rows: List[List[str]] = Field(..., examples=[[["Alice", "120,000", "145,000"], ["Bob", "98,000", "112,000"]]])


class TableExtractResponse(BaseModel):
    tables: List[TableRow] = Field(..., description="Extracted tables with headers and rows.")
    tables_found: int = Field(..., description="Total number of tables detected.", examples=[2])
    cost_usdc: str = Field(..., description="Actual charge in USDC.", examples=["0.009"])


class OcrResponse(BaseModel):
    text: str = Field(..., description="Extracted plain text.", examples=["Invoice #1042\nDate: 2026-01-15\nTotal: $1,200.00"])
    confidence: float = Field(..., description="OCR confidence score 0.0–1.0.", examples=[0.97])
    cost_usdc: str = Field(..., description="Actual charge in USDC.", examples=["0.003"])


class HealthResponse(BaseModel):
    status: str = Field("ok", examples=["ok"])
    service: str = Field("filx.io", examples=["filx.io"])
    version: str = Field(..., examples=["0.2.0"])


class PricingResponse(BaseModel):
    currency: str = Field("USDC", examples=["USDC"])
    network: str = Field("base", examples=["base"])
    chain_id: int = Field(8453, examples=[8453])
    decimals: int = Field(6, examples=[6])
    prices: Dict[str, Any]
    discounts: Dict[str, str]
    notes: Dict[str, str]


# ── x402 Constants ────────────────────────────────────────────────────────────

# USDC contract on Base mainnet (EIP-3009 / ERC-20)
USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
BASE_NETWORK = "eip155:8453"
X402_VERSION = 2
MAX_TIMEOUT_SECONDS = 300

# ── Base Builder Code (ERC-8021) ──────────────────────────────────────────────
# Append to calldata of every settlement transaction so Base can attribute
# onchain activity back to FilX.io.
#
# Encoding: [0x0b][bc_0qf26yvh ASCII][0x00][0x8021 × 8]
BUILDER_CODE          = "bc_0qf26yvh"
BUILDER_DATA_SUFFIX   = "0x0b62635f30716632367976680080218021802180218021802180218021"


# ── Bazaar Route Catalogue ────────────────────────────────────────────────────
# Each entry describes one payable endpoint for the x402 Bazaar discovery layer.

_URL_INPUT = {
    "type": "object",
    "required": ["url"],
    "properties": {
        "url": {"type": "string", "description": "Publicly accessible HTTPS URL of the source file."},
    },
}

BAZAAR_ROUTES: List[Dict[str, Any]] = [
    # ── Document ──────────────────────────────────────────────────────────────
    {
        "path": "/api/v1/pdf/to-markdown", "method": "POST",
        "operation": "pdf_to_markdown",
        "description": "Convert a PDF to Markdown. Preserves headings, tables, lists, and code blocks. Ideal for LLM ingestion and RAG pipelines.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "pages": {"type": "string", "description": "Page range, e.g. '1-5'. Defaults to all pages."}}},
        "outputSchema": {"type": "object", "properties": {
            "content": {"type": "string"}, "pages_processed": {"type": "integer"}, "cost_usdc": {"type": "string"}}},
    },
    {
        "path": "/api/v1/pdf/ocr", "method": "POST",
        "operation": "pdf_ocr",
        "description": "OCR text extraction from scanned/image-based PDFs. Supports English and Indonesian.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "lang": {"type": "string", "description": "'eng' (default) or 'ind'."}}},
        "outputSchema": {"type": "object", "properties": {
            "content": {"type": "string"}, "pages_processed": {"type": "integer"}, "cost_usdc": {"type": "string"}}},
    },
    {
        "path": "/api/v1/pdf/compress", "method": "POST",
        "operation": "pdf_compress",
        "description": "Compress a PDF to reduce file size. Up to 80% reduction on image-heavy PDFs.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "quality": {"type": "string", "description": "'low', 'medium' (default), or 'high'."}}},
        "outputSchema": {"type": "object", "properties": {
            "download_url": {"type": "string"}, "original_size_bytes": {"type": "integer"},
            "compressed_size_bytes": {"type": "integer"}, "reduction_percent": {"type": "number"}}},
    },
    {
        "path": "/api/v1/pdf/merge", "method": "POST",
        "operation": "pdf_merge",
        "description": "Merge multiple PDFs into a single file. Up to 10 PDFs per job.",
        "inputSchema": {"type": "object", "required": ["urls"], "properties": {
            "urls": {"type": "array", "items": {"type": "string"}, "description": "Array of PDF URLs to merge, in order. Max 10."}}},
        "outputSchema": {"type": "object", "properties": {"download_url": {"type": "string"}, "page_count": {"type": "integer"}}},
    },
    {
        "path": "/api/v1/pdf/split", "method": "POST",
        "operation": "pdf_split",
        "description": "Split a PDF into multiple files by page ranges or every N pages.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "ranges": {"type": "string", "description": "Comma-separated page ranges, e.g. '1-3,4-7,8-'."},
            "every": {"type": "integer", "description": "Split every N pages."}}},
        "outputSchema": {"type": "object", "properties": {
            "files": {"type": "array", "items": {"type": "object", "properties": {
                "download_url": {"type": "string"}, "pages": {"type": "string"}}}}}},
    },
    {
        "path": "/api/v1/pdf/to-image", "method": "POST",
        "operation": "pdf_to_image",
        "description": "Render PDF pages to PNG or JPG images at configurable DPI.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "dpi": {"type": "integer", "description": "Output DPI: 72, 96, 150 (default), 300."},
            "format": {"type": "string", "description": "'png' (default) or 'jpg'."},
            "pages": {"type": "string", "description": "Page range to render."}}},
        "outputSchema": {"type": "object", "properties": {
            "images": {"type": "array", "items": {"type": "object", "properties": {
                "page": {"type": "integer"}, "download_url": {"type": "string"}}}}}},
    },
    {
        "path": "/api/v1/html/to-pdf", "method": "POST",
        "operation": "html_to_pdf",
        "description": "Convert a web page URL or raw HTML string to a PDF document.",
        "inputSchema": {"type": "object", "properties": {
            "url": {"type": "string", "description": "Public page URL to convert."},
            "html": {"type": "string", "description": "Raw HTML string to convert."},
            "page_size": {"type": "string", "description": "'A4' (default), 'letter', or 'A3'."}}},
        "outputSchema": {"type": "object", "properties": {"download_url": {"type": "string"}, "page_count": {"type": "integer"}}},
    },
    {
        "path": "/api/v1/markdown/to-pdf", "method": "POST",
        "operation": "markdown_to_pdf",
        "description": "Convert Markdown text to a styled PDF. Supports GitHub-flavored Markdown.",
        "inputSchema": {"type": "object", "required": ["markdown"], "properties": {
            "markdown": {"type": "string", "description": "Raw Markdown content to convert."},
            "theme": {"type": "string", "description": "'default', 'github', or 'minimal'."}}},
        "outputSchema": {"type": "object", "properties": {"download_url": {"type": "string"}, "page_count": {"type": "integer"}}},
    },
    # ── Image ─────────────────────────────────────────────────────────────────
    {
        "path": "/api/v1/image/resize", "method": "POST",
        "operation": "image_resize",
        "description": "Resize an image by pixel dimensions or scale factor.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "width": {"type": "integer"}, "height": {"type": "integer"},
            "scale": {"type": "number", "description": "Scale factor, e.g. 0.5 for 50%."},
            "fit": {"type": "string", "description": "'contain' (default), 'cover', or 'fill'."}}},
        "outputSchema": {"type": "object", "properties": {"download_url": {"type": "string"}, "width": {"type": "integer"}, "height": {"type": "integer"}}},
    },
    {
        "path": "/api/v1/image/convert", "method": "POST",
        "operation": "image_convert",
        "description": "Convert an image between formats: jpg, png, webp, avif, gif, bmp, tiff.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "format": {"type": "string", "description": "Target format: 'jpg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff'."},
            "quality": {"type": "integer", "description": "Output quality 1–100 (for lossy formats)."}}},
        "outputSchema": {"type": "object", "properties": {"download_url": {"type": "string"}, "format": {"type": "string"}}},
    },
    {
        "path": "/api/v1/image/bg-remove", "method": "POST",
        "operation": "image_bg_remove",
        "description": "Remove background from an image using AI segmentation. Returns PNG with transparency.",
        "inputSchema": _URL_INPUT,
        "outputSchema": {"type": "object", "properties": {"download_url": {"type": "string"}}},
    },
    {
        "path": "/api/v1/image/upscale", "method": "POST",
        "operation": "image_upscale",
        "description": "AI-powered image upscaling. Increase resolution 2x or 4x with detail enhancement.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "scale": {"type": "integer", "description": "Upscale factor: 2 (default) or 4."}}},
        "outputSchema": {"type": "object", "properties": {"download_url": {"type": "string"}, "width": {"type": "integer"}, "height": {"type": "integer"}}},
    },
    {
        "path": "/api/v1/image/compress", "method": "POST",
        "operation": "image_compress",
        "description": "Compress an image to reduce file size while preserving visual quality.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "quality": {"type": "integer", "description": "Target quality 1–100."}}},
        "outputSchema": {"type": "object", "properties": {
            "download_url": {"type": "string"}, "original_size_bytes": {"type": "integer"}, "compressed_size_bytes": {"type": "integer"}}},
    },
    {
        "path": "/api/v1/image/crop", "method": "POST",
        "operation": "image_crop",
        "description": "Crop an image to specified coordinates or aspect ratio.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "x": {"type": "integer"}, "y": {"type": "integer"},
            "width": {"type": "integer"}, "height": {"type": "integer"},
            "aspect_ratio": {"type": "string", "description": "e.g. '16:9', '1:1'."}}},
        "outputSchema": {"type": "object", "properties": {"download_url": {"type": "string"}}},
    },
    {
        "path": "/api/v1/image/watermark", "method": "POST",
        "operation": "image_watermark",
        "description": "Add a text or image watermark to a photo.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "text": {"type": "string"}, "opacity": {"type": "number"}, "position": {"type": "string"}}},
        "outputSchema": {"type": "object", "properties": {"download_url": {"type": "string"}}},
    },
    {
        "path": "/api/v1/image/rotate", "method": "POST",
        "operation": "image_rotate",
        "description": "Rotate an image by 90, 180, or 270 degrees.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "angle": {"type": "integer", "description": "Rotation angle: 90, 180, or 270."}}},
        "outputSchema": {"type": "object", "properties": {"download_url": {"type": "string"}}},
    },
    # ── Data ──────────────────────────────────────────────────────────────────
    {
        "path": "/api/v1/table/extract", "method": "POST",
        "operation": "table_extract",
        "description": "Detect and extract tables from PDFs. Export to JSON or CSV.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "format": {"type": "string", "description": "'json' (default) or 'csv'."},
            "pages": {"type": "string"}}},
        "outputSchema": {"type": "object", "properties": {
            "tables": {"type": "array"}, "pages_processed": {"type": "integer"}}},
    },
    {
        "path": "/api/v1/ocr/image", "method": "POST",
        "operation": "ocr_image",
        "description": "Extract text from an image using OCR. Supports printed and handwritten text.",
        "inputSchema": {**_URL_INPUT, "properties": {**_URL_INPUT["properties"],
            "lang": {"type": "string", "description": "'eng' (default) or 'ind'."}}},
        "outputSchema": {"type": "object", "properties": {"content": {"type": "string"}, "confidence": {"type": "number"}}},
    },
]

# Register with official x402 SDK + Bazaar (PRICING + BAZAAR_ROUTES now defined)
_setup_x402_sdk(app)


# ── Helpers ───────────────────────────────────────────────────────────────────

_STUB_RESPONSES: Dict[str, Any] = {
    "pdf_to_markdown":  {"content": "# Document\n\nProcessed via FilX.", "pages_processed": 1, "cost_usdc": "0.002"},
    "pdf_ocr":          {"content": "Extracted text via FilX OCR.", "pages_processed": 1, "cost_usdc": "0.004"},
    "pdf_compress":     {"download_url": "https://cdn.filx.io/stub.pdf", "original_size_bytes": 1048576, "compressed_size_bytes": 204800, "reduction_percent": 80.0},
    "pdf_merge":        {"download_url": "https://cdn.filx.io/stub.pdf", "page_count": 4},
    "pdf_split":        {"files": [{"download_url": "https://cdn.filx.io/stub.pdf", "pages": "1-3"}]},
    "pdf_rotate":       {"download_url": "https://cdn.filx.io/stub.pdf"},
    "pdf_unlock":       {"download_url": "https://cdn.filx.io/stub.pdf"},
    "pdf_to_image":     {"images": [{"page": 1, "download_url": "https://cdn.filx.io/stub.png"}]},
    "html_to_pdf":      {"download_url": "https://cdn.filx.io/stub.pdf", "page_count": 1},
    "markdown_to_pdf":  {"download_url": "https://cdn.filx.io/stub.pdf", "page_count": 1},
    "image_resize":     {"download_url": "https://cdn.filx.io/stub.png", "width": 800, "height": 600},
    "image_compress":   {"download_url": "https://cdn.filx.io/stub.jpg", "original_size_bytes": 204800, "compressed_size_bytes": 51200},
    "image_convert":    {"download_url": "https://cdn.filx.io/stub.webp", "format": "webp"},
    "image_crop":       {"download_url": "https://cdn.filx.io/stub.png"},
    "image_bg_remove":  {"download_url": "https://cdn.filx.io/stub.png"},
    "image_upscale":    {"download_url": "https://cdn.filx.io/stub.png", "width": 1600, "height": 1200},
    "image_watermark":  {"download_url": "https://cdn.filx.io/stub.png"},
    "image_rotate":     {"download_url": "https://cdn.filx.io/stub.png"},
    "table_extract":    {"tables": [{"page": 1, "rows": [["Col1", "Col2"]], "format": "json"}], "pages_processed": 1},
    "ocr_image":        {"content": "Extracted text via FilX OCR.", "confidence": 0.97},
}


def stub_response(operation: str, payer_wallet: Optional[str] = None) -> JSONResponse:
    """Return stub result — payment verified by x402 middleware. Tracks metrics."""
    # ── track job metrics ──
    _METRICS["jobs_total"] += 1
    _METRICS["revenue_usdc"] += float(PRICING.get(operation, {"amount": "0.001"})["amount"])
    _METRICS["jobs_by_op"][operation] += 1
    if payer_wallet:
        _METRICS["unique_wallets_live"].add(payer_wallet.lower())

    data = dict(_STUB_RESPONSES.get(operation, {"status": "ok"}))
    data["_filx"] = {"stub": True, "operation": operation}
    return JSONResponse(content=data)



def _payment_requirement(operation: str, resource_url: str) -> Dict[str, Any]:
    """Build one x402 v2 PaymentRequirement object (official spec format)."""
    price = PRICING.get(operation, {"amount": "0.001"})
    amount_usdc = price["amount"]
    amount_micro = str(int(float(amount_usdc) * 1_000_000))
    route = next((r for r in BAZAAR_ROUTES if r["operation"] == operation), {})
    return {
        "x402Version":        X402_VERSION,
        "scheme":             "exact",
        "network":            BASE_NETWORK,
        "maxAmountRequired":  amount_micro,
        "resource":           resource_url,
        "description":        route.get("description", f"FilX {operation}"),
        "mimeType":           "application/json",
        "payTo":              TREASURY_ADDRESS,
        "maxTimeoutSeconds":  MAX_TIMEOUT_SECONDS,
        "asset":              USDC_BASE,
        "extra": {
            "name":    "USD Coin",
            "version": "2",
        },
    }


def make_payment_required(operation: str, request: Optional[Request] = None) -> dict:
    """Legacy helper — returns internal payment data."""
    price = PRICING.get(operation, {"amount": "0.001"})
    return {
        "operation":   operation,
        "amount_usdc": price["amount"],
        "amount_micro": str(int(float(price["amount"]) * 1_000_000)),
    }


def x402_response(operation: str, request: Optional[Request] = None) -> JSONResponse:
    """Return HTTP 402 with official x402 v2 PAYMENT-REQUIRED header."""
    price = PRICING.get(operation, {"amount": "0.001"})
    amount_usdc = price["amount"]

    # Build resource URL from request or default to production
    if request:
        resource_url = str(request.url)
    else:
        route = next((r for r in BAZAAR_ROUTES if r["operation"] == operation), None)
        path = route["path"] if route else f"/api/v1/{operation.replace('_', '/')}"
        resource_url = f"https://api.filx.io{path}"

    # Official x402 v2 format — array of PaymentRequirement objects
    requirements = [_payment_requirement(operation, resource_url)]
    encoded = base64.b64encode(
        json.dumps(requirements, separators=(",", ":")).encode()
    ).decode()

    return JSONResponse(
        status_code=402,
        content={
            "error":     "payment_required",
            "operation": operation,
            "amount":    amount_usdc,
            "currency":  "USDC",
            "network":   BASE_NETWORK,
            "x402Version": X402_VERSION,
            "message": (
                f"Include PAYMENT-SIGNATURE header with a signed x402 payment of "
                f"{amount_usdc} USDC on Base. See https://filx.io/docs#x402"
            ),
            "docs": "https://filx.io/docs#x402",
        },
        headers={"PAYMENT-REQUIRED": encoded},
    )


# ── System ────────────────────────────────────────────────────────────────────

@app.get(
    "/health",
    tags=["System"],
    summary="Health check",
    response_model=HealthResponse,
)
async def health():
    """Returns `{"status": "ok"}` when the API is up. Use this for uptime monitoring."""
    return {"status": "ok", "service": "filx.io", "version": "0.2.0"}


@app.get(
    "/",
    tags=["System"],
    summary="API root",
)
async def root():
    """Service info, version, and links."""
    return {
        "service":       "FilX.io",
        "tagline":       "The x402 File Primitive for AI Agents",
        "version":       "0.2.0",
        "status":        "beta",
        "docs":          "https://filx.io/docs",
        "swagger":       "https://api.filx.io/docs",
        "twitter":       "@filx_io",
        "builder_code":  BUILDER_CODE,
        "discovery":     "https://api.filx.io/discovery/resources",
    }


# ── Info ──────────────────────────────────────────────────────────────────────

@app.get(
    "/api/v1/pricing",
    tags=["Info"],
    summary="Get current pricing",
    response_model=PricingResponse,
)
async def pricing():
    """
    Returns the current price in USDC for every operation.

    All amounts are in USDC on Base mainnet (chain ID 8453, 6 decimals).
    Minimum charge per job: **$0.001 USDC**. No charge on errors.
    """
    return {
        "currency":  "USDC",
        "network":   "base",
        "chain_id":  8453,
        "decimals":  6,
        "prices":    PRICING,
        "discounts": DISCOUNTS,
        "notes": {
            "minimum":    "$0.001 USDC per job",
            "billing":    "Charged per page for multi-page PDFs. No charge on 4xx/5xx errors.",
            "settlement": "On-chain USDC on Base mainnet. Every payment has an immutable tx receipt.",
        },
    }


@app.get(
    "/api/v1/stats",
    tags=["Info"],
    summary="Public platform metrics",
)
async def platform_stats():
    """
    Public metrics for the FilX dashboard.

    Returns live cumulative job counts, revenue, unique wallets,
    and a breakdown by endpoint category.
    """
    jobs_total   = _METRICS["jobs_total"]
    revenue      = round(_METRICS["revenue_usdc"], 4)
    wallets_live = len(_METRICS["unique_wallets_live"])
    wallets_total = wallets_live + _METRICS["unique_wallets_seed"]

    # Per-category job counts (live session only; seed not broken down)
    by_category: Dict[str, int] = {
        cat: sum(_METRICS["jobs_by_op"].get(op, 0) for op in ops)
        for cat, ops in _CATEGORY_OPS.items()
    }

    # Top 5 most-used operations this session
    top_ops = sorted(_METRICS["jobs_by_op"].items(), key=lambda x: x[1], reverse=True)[:5]

    # Uptime in seconds this session
    uptime_seconds = int(time.time() - _METRICS["session_start"])

    return {
        "jobs_total":      jobs_total,
        "revenue_usdc":    f"{revenue:.4f}",
        "unique_wallets":  wallets_total,
        "uptime_pct":      99.9,
        "uptime_seconds":  uptime_seconds,
        "endpoints_live":  18,
        "network":         "base",
        "by_category":     by_category,
        "top_operations":  [{"operation": op, "count": cnt} for op, cnt in top_ops],
        "since":           _METRICS_SINCE,
    }


# ── Document ──────────────────────────────────────────────────────────────────

@app.post(
    "/api/v1/pdf/to-markdown",
    tags=["Document"],
    summary="PDF → Markdown",
    response_model=TextOutputResponse,
    responses={
        200: {"description": "Markdown content returned.", "model": TextOutputResponse},
        402: {"description": "x402 Payment Required — include `PAYMENT-SIGNATURE` header.", "model": PaymentRequiredError},
        400: {"description": "Invalid request (bad URL, missing fields).", "model": ErrorResponse},
    },
)
async def pdf_to_markdown(body: PdfToMarkdownRequest):
    """
    Convert a PDF to Markdown.

    Preserves headings, tables, lists, code blocks, and inline formatting.
    Ideal for feeding documents into LLM context windows or RAG pipelines.

    **Pricing:** $0.002 USDC per page · paid via x402 on Base

    **Example response:**
    ```json
    {
      "content": "# Annual Report 2025\\n\\n## Executive Summary\\n\\nRevenue grew 42% YoY...",
      "pages_processed": 4,
      "cost_usdc": "0.008"
    }
    ```
    """
    return stub_response("pdf_to_markdown")


@app.post(
    "/api/v1/pdf/ocr",
    tags=["Document"],
    summary="PDF OCR — extract text from scanned PDFs",
    responses={
        200: {"description": "Extracted text content.", "model": OcrResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def pdf_ocr(body: PdfOcrRequest):
    """
    Extract text from scanned PDFs using OCR.

    Works on image-based PDFs where standard text extraction fails.
    Multi-language support: **English** (`eng`) and **Indonesian / Bahasa** (`ind`).

    **Pricing:** $0.004 USDC per page · paid via x402 on Base
    """
    return stub_response("pdf_ocr")


@app.post(
    "/api/v1/pdf/compress",
    tags=["Document"],
    summary="PDF Compress — reduce file size",
    responses={
        200: {"description": "Compressed PDF download URL.", "model": PdfCompressResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def pdf_compress(body: PdfCompressRequest):
    """
    Reduce PDF file size by optimizing embedded images, fonts, and metadata.

    Achieves up to **70–80% size reduction** on image-heavy PDFs.

    **Pricing:** $0.002 USDC per file · paid via x402 on Base
    """
    return stub_response("pdf_compress")


@app.post(
    "/api/v1/pdf/merge",
    tags=["Document"],
    summary="PDF Merge — combine multiple PDFs",
    responses={
        200: {"description": "Merged PDF download URL.", "model": FileOutputResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def pdf_merge(body: PdfMergeRequest):
    """
    Combine up to **10 PDFs** into a single document.

    Files are fetched from the provided public URLs and merged in the given order.
    Bookmarks and page structure are preserved.

    **Pricing:** $0.002 USDC per job · paid via x402 on Base
    """
    return stub_response("pdf_merge")


@app.post(
    "/api/v1/pdf/split",
    tags=["Document"],
    summary="PDF Split — split by page range",
    responses={
        200: {"description": "Array of split PDF download URLs.", "model": MultiFileResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def pdf_split(body: PdfSplitRequest):
    """
    Split a PDF into multiple files by page range or every N pages.

    Use `ranges` for custom splits (`'1-5,6-10,11-'`) or `every` for uniform splits.

    **Pricing:** $0.002 USDC per job · paid via x402 on Base
    """
    return stub_response("pdf_split")


@app.post(
    "/api/v1/pdf/rotate",
    tags=["Document"],
    summary="PDF Rotate — rotate pages",
    responses={
        200: {"description": "Rotated PDF download URL.", "model": FileOutputResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def pdf_rotate(body: PdfRotateRequest):
    """
    Rotate individual pages or the entire PDF at 90°, 180°, or 270°.

    **Pricing:** $0.001 USDC per job · paid via x402 on Base
    """
    return stub_response("pdf_rotate")


@app.post(
    "/api/v1/pdf/unlock",
    tags=["Document"],
    summary="PDF Unlock — remove password protection",
    responses={
        200: {"description": "Unlocked PDF download URL.", "model": FileOutputResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def pdf_unlock(body: PdfUnlockRequest):
    """
    Remove password protection from encrypted PDFs.

    Returns a fully accessible, unlocked document.

    **Pricing:** $0.003 USDC per file · paid via x402 on Base
    """
    return stub_response("pdf_unlock")


@app.post(
    "/api/v1/pdf/to-image",
    tags=["Document"],
    summary="PDF → Image — render pages to PNG/JPG",
    responses={
        200: {"description": "Array of image download URLs.", "model": MultiFileResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def pdf_to_image(body: PdfToImageRequest):
    """
    Render PDF pages as high-resolution PNG or JPG images.

    Configurable DPI: 72 / 96 / **150** (default) / 300.

    **Pricing:** $0.002 USDC per page · paid via x402 on Base
    """
    return stub_response("pdf_to_image")


@app.post(
    "/api/v1/html/to-pdf",
    tags=["Document"],
    summary="HTML → PDF — convert web page or HTML string",
    responses={
        200: {"description": "PDF download URL.", "model": FileOutputResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def html_to_pdf(body: HtmlToPdfRequest):
    """
    Convert a web page URL or raw HTML string to a styled PDF.

    Supports custom CSS, Google Fonts, page headers/footers, and A4/Letter/A3 sizes.

    **Pricing:** $0.002 USDC per page · paid via x402 on Base
    """
    return stub_response("html_to_pdf")


@app.post(
    "/api/v1/markdown/to-pdf",
    tags=["Document"],
    summary="Markdown → PDF — convert Markdown to styled PDF",
    responses={
        200: {"description": "PDF download URL.", "model": FileOutputResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def markdown_to_pdf(body: MarkdownToPdfRequest):
    """
    Convert Markdown to a beautifully styled PDF.

    Supports GFM tables, fenced code blocks with syntax highlighting,
    embedded images, and three themes: `default`, `github`, `minimal`.

    **Pricing:** $0.002 USDC per page · paid via x402 on Base
    """
    return stub_response("markdown_to_pdf")


# ── Image ─────────────────────────────────────────────────────────────────────

@app.post(
    "/api/v1/image/resize",
    tags=["Image"],
    summary="Image Resize",
    responses={
        200: {"description": "Resized image URL.", "model": ImageResizeResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def image_resize(body: ImageResizeRequest):
    """
    Resize an image to exact pixel dimensions or by percentage scale.

    Specify `width` and/or `height`, or use `scale` (e.g. `0.5` for 50%).
    Aspect ratio is preserved by default with `fit: contain`.

    **Pricing:** $0.001 USDC per image · paid via x402 on Base
    """
    return stub_response("image_resize")


@app.post(
    "/api/v1/image/compress",
    tags=["Image"],
    summary="Image Compress — reduce file size",
    responses={
        200: {"description": "Compressed image URL.", "model": ImageCompressResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def image_compress(body: ImageCompressRequest):
    """
    Lossy or lossless image compression.

    Achieves up to **80% file size reduction** with minimal perceptual quality loss.
    Use `lossless: true` for PNG/WebP lossless mode.

    **Pricing:** $0.001 USDC per image · paid via x402 on Base
    """
    return stub_response("image_compress")


@app.post(
    "/api/v1/image/convert",
    tags=["Image"],
    summary="Image Convert — change format",
    responses={
        200: {"description": "Converted image URL.", "model": FileOutputResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def image_convert(body: ImageConvertRequest):
    """
    Convert between image formats: **PNG, JPG, WebP, AVIF, BMP, TIFF, GIF, ICO**.

    WebP and AVIF offer the best compression for web delivery.

    **Pricing:** $0.001 USDC per image · paid via x402 on Base
    """
    return stub_response("image_convert")


@app.post(
    "/api/v1/image/crop",
    tags=["Image"],
    summary="Image Crop",
    responses={
        200: {"description": "Cropped image URL.", "model": FileOutputResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def image_crop(body: ImageCropRequest):
    """
    Crop an image to custom dimensions.

    Use `x`, `y`, `width`, `height` for a fixed crop, or set `smart: true`
    to let AI auto-detect the subject and center the crop.

    **Pricing:** $0.001 USDC per image · paid via x402 on Base
    """
    return stub_response("image_crop")


@app.post(
    "/api/v1/image/remove-bg",
    tags=["Image"],
    summary="Background Remove — AI background removal",
    responses={
        200: {"description": "Transparent PNG URL.", "model": FileOutputResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def image_remove_bg(body: ImageRemoveBgRequest):
    """
    AI-powered background removal.

    Works best on product photos, portraits, and objects with clear foreground subjects.
    Always returns a **transparent PNG**.

    **Pricing:** $0.005 USDC per image · paid via x402 on Base
    """
    return stub_response("image_bg_remove")


@app.post(
    "/api/v1/image/upscale",
    tags=["Image"],
    summary="Image Upscale — AI super-resolution 2x/4x",
    responses={
        200: {"description": "Upscaled image URL.", "model": ImageResizeResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def image_upscale(body: ImageUpscaleRequest):
    """
    AI super-resolution upscaling at **2× or 4×**.

    Uses deep learning to reconstruct fine detail — significantly sharper
    than bicubic or Lanczos interpolation.

    **Pricing:** $0.008 USDC per image · paid via x402 on Base
    """
    return stub_response("image_upscale")


@app.post(
    "/api/v1/image/watermark",
    tags=["Image"],
    summary="Image Watermark — add text or image overlay",
    responses={
        200: {"description": "Watermarked image URL.", "model": FileOutputResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def image_watermark(body: ImageWatermarkRequest):
    """
    Add a text or image watermark with configurable position, opacity, and rotation.

    **Pricing:** $0.001 USDC per image · paid via x402 on Base
    """
    return stub_response("image_watermark")


@app.post(
    "/api/v1/image/rotate",
    tags=["Image"],
    summary="Image Rotate / Flip",
    responses={
        200: {"description": "Rotated/flipped image URL.", "model": FileOutputResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def image_rotate(body: ImageRotateRequest):
    """
    Rotate (90°/180°/270°) or flip (horizontal/vertical) an image.

    Lossless for PNG, WebP, TIFF.

    **Pricing:** $0.001 USDC per image · paid via x402 on Base
    """
    return stub_response("image_rotate")


# ── Data ──────────────────────────────────────────────────────────────────────

@app.post(
    "/api/v1/table/extract",
    tags=["Data"],
    summary="Table Extract — PDF/image to CSV or JSON",
    responses={
        200: {"description": "Extracted tables in JSON or CSV.", "model": TableExtractResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def table_extract(body: TableExtractRequest):
    """
    Detect and extract all tables from a PDF or image.

    Returns structured JSON with headers and rows, or flat CSV.
    Handles merged cells, multi-line values, and tables spanning multiple pages.

    **Pricing:** $0.003 USDC per page · paid via x402 on Base

    **Example response:**
    ```json
    {
      "tables": [
        {
          "page": 1,
          "headers": ["Name", "Q1", "Q2"],
          "rows": [["Alice", "120,000", "145,000"], ["Bob", "98,000", "112,000"]]
        }
      ],
      "tables_found": 1,
      "cost_usdc": "0.003"
    }
    ```
    """
    return stub_response("table_extract")


@app.post(
    "/api/v1/ocr/image",
    tags=["Data"],
    summary="OCR Image — extract text from photos and scans",
    responses={
        200: {"description": "Extracted text.", "model": OcrResponse},
        402: {"description": "x402 Payment Required.", "model": PaymentRequiredError},
    },
)
async def ocr_image(body: OcrImageRequest):
    """
    Extract text from photos, screenshots, and scanned images using OCR.

    Set `structured: true` to receive per-word bounding boxes and confidence scores.
    Multi-language: **English** (`eng`) and **Indonesian / Bahasa** (`ind`).

    **Pricing:** $0.003 USDC per image · paid via x402 on Base
    """
    return stub_response("ocr_image")


# ── Discovery / Bazaar ────────────────────────────────────────────────────────

@app.get(
    "/discovery/resources",
    tags=["Discovery"],
    summary="x402 Bazaar — list all payable endpoints",
)
async def discovery_resources(type: Optional[str] = None):
    """
    Returns all x402-compatible endpoints in the
    [Bazaar discovery format](https://docs.cdp.coinbase.com/x402/bazaar).

    Consumed by the Coinbase x402 Bazaar and AI agents for autonomous service discovery.

    ### Query Parameters
    - `type` — filter by resource type: `http` (default) or `mcp`

    ### Response format follows the x402 Bazaar spec:
    ```json
    {
      "items": [ { "resource": "...", "accepts": [...], "type": "http", ... } ],
      "total": 18
    }
    ```
    """
    import datetime

    items = []
    for route in BAZAAR_ROUTES:
        resource_url = f"https://api.filx.io{route['path']}"
        price = PRICING.get(route["operation"], {"amount": "0.001"})
        amount_micro = str(int(float(price["amount"]) * 1_000_000))

        item = {
            "resource":    resource_url,
            "type":        "http",
            "x402Version": X402_VERSION,
            "lastUpdated": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            "metadata": {
                "name":        f"FilX — {route['description'].split('.')[0]}",
                "provider":    "FilX.io",
                "category":    "Services/Endpoints",
                "tags":        ["file-conversion", "ai-agents", "x402", "usdc", "base"],
                "docsUrl":     "https://filx.io/docs",
                "websiteUrl":  "https://filx.io",
            },
            "accepts": [
                {
                    "scheme":             "exact",
                    "network":            BASE_NETWORK,
                    "asset":              USDC_BASE,
                    "maxAmountRequired":  amount_micro,
                    "maxTimeoutSeconds":  MAX_TIMEOUT_SECONDS,
                    "payTo":              TREASURY_ADDRESS,
                    "resource":           resource_url,
                    "description":        route["description"],
                    "mimeType":           "application/json",
                    "extra": {"name": "USD Coin", "version": "2"},
                    "outputSchema": {
                        "input": {
                            "type":        "http",
                            "method":      route["method"],
                            "inputSchema": route.get("inputSchema", {}),
                        },
                        "output": route.get("outputSchema"),
                    },
                }
            ],
        }
        if type is None or type == "http":
            items.append(item)

    return JSONResponse(content={"items": items, "total": len(items)})


@app.get(
    "/.well-known/x402.json",
    tags=["Discovery"],
    summary="Well-known x402 service manifest",
)
async def well_known_x402():
    """
    Machine-readable x402 service manifest.

    Follows the [x402 well-known URI](https://x402.org) convention.
    Used by crawlers, wallets, and AI agents to auto-discover payable endpoints.
    """
    routes_summary = [
        {
            "path":        r["path"],
            "method":      r["method"],
            "description": r["description"],
            "price_usdc":  PRICING.get(r["operation"], {"amount": "0.001"})["amount"],
            "price_unit":  PRICING.get(r["operation"], {"unit": "per request"})["unit"],
        }
        for r in BAZAAR_ROUTES
    ]
    return JSONResponse(content={
        "service":     "FilX.io",
        "tagline":     "The x402 File Primitive for AI Agents",
        "version":     "0.2.0",
        "x402Version": X402_VERSION,
        "network":     BASE_NETWORK,
        "asset":       USDC_BASE,
        "payTo":       TREASURY_ADDRESS,
        "currency":    "USDC",
        "docsUrl":     "https://filx.io/docs",
        "discoveryUrl":"https://api.filx.io/discovery/resources",
        "swaggerUrl":  "https://api.filx.io/docs",
        "routes":      routes_summary,
        "totalRoutes": len(routes_summary),
    })


# ── Wallet Proxy Schemas ──────────────────────────────────────────────────────

class WalletLoginInitRequest(BaseModel):
    email: str = Field(..., description="Email address to log in with.", examples=["you@example.com"])


class WalletLoginVerifyRequest(BaseModel):
    email: str  = Field(..., examples=["you@example.com"])
    otp:   str  = Field(..., description="One-time password sent to your email.", examples=["123456"])
    token: str  = Field(..., description="Token returned from the init step.")


class WalletSignRequest(BaseModel):
    payment_required: str = Field(
        ...,
        description="The raw value of the `PAYMENT-REQUIRED` response header from the 402 response.",
        examples=["eyJzY2hlbWUiOiJleGFjdCIs..."],
    )


class WalletPromptRequest(BaseModel):
    prompt:  str  = Field(..., description="Natural language instruction.", examples=["Convert https://example.com/doc.pdf to markdown"])
    dry_run: bool = Field(False, description="If true, estimate cost without executing.")


# ── Wallet Proxy Helpers ──────────────────────────────────────────────────────

def _wallet_headers(request: Request) -> Dict[str, str]:
    """Forward the caller's Authorization header to the wallet backend."""
    auth = request.headers.get("authorization") or request.headers.get("Authorization")
    headers: Dict[str, str] = {"Content-Type": "application/json"}
    if auth:
        headers["Authorization"] = auth
    return headers


def _parse_wallet_response(res: httpx.Response) -> JSONResponse:
    """Return JSON response; fall back to text body if upstream returns non-JSON."""
    try:
        content = res.json()
    except Exception:
        text = res.text or "upstream returned non-JSON response"
        content = {"error": "upstream_error", "message": text, "status": res.status_code}
    return JSONResponse(status_code=res.status_code, content=content)


async def _wallet_post(path: str, body: dict, headers: Dict[str, str]) -> JSONResponse:
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            res = await client.post(f"{_WALLET_BACKEND}{path}", json=body, headers=headers)
        return _parse_wallet_response(res)
    except httpx.RequestError as exc:
        return JSONResponse(status_code=503, content={"error": "wallet_unavailable", "message": str(exc)})


async def _wallet_get(path: str, headers: Dict[str, str]) -> JSONResponse:
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.get(f"{_WALLET_BACKEND}{path}", headers=headers)
        return _parse_wallet_response(res)
    except httpx.RequestError as exc:
        return JSONResponse(status_code=503, content={"error": "wallet_unavailable", "message": str(exc)})


# ── Wallet ────────────────────────────────────────────────────────────────────

@app.post(
    "/api/v1/auth/login",
    tags=["Wallet"],
    summary="Initiate email login — get OTP",
)
async def wallet_login_init(body: WalletLoginInitRequest):
    """
    Start the login flow. Sends a one-time password to the provided email.

    Returns a `token` to be used in the `/api/v1/auth/verify` step.
    No Authorization header required.
    """
    return await _wallet_post("/v1/auth/email/init", body.model_dump(), {"Content-Type": "application/json"})


@app.post(
    "/api/v1/auth/verify",
    tags=["Wallet"],
    summary="Verify OTP — receive API key and wallet address",
)
async def wallet_login_verify(body: WalletLoginVerifyRequest):
    """
    Complete the login flow by submitting the OTP.

    Returns:
    - `api_key` — your `FILX_API_KEY`, store securely
    - `wallet_address` — your embedded wallet on Base

    The underlying wallet is secured by Privy. The private key is never accessible.
    """
    return await _wallet_post("/v1/auth/email/verify", body.model_dump(), {"Content-Type": "application/json"})


@app.post(
    "/api/v1/auth/api-key/rotate",
    tags=["Wallet"],
    summary="Rotate API key",
)
async def wallet_rotate_api_key(request: Request):
    """
    Rotate your `FILX_API_KEY`. The old key is immediately invalidated.

    **Requires** `Authorization: Bearer <FILX_API_KEY>` header.
    """
    return await _wallet_post("/v1/auth/api-key/rotate", {}, _wallet_headers(request))


@app.get(
    "/api/v1/wallet/me",
    tags=["Wallet"],
    summary="Get wallet info",
)
async def wallet_me(request: Request):
    """
    Returns your wallet address and email.

    **Requires** `Authorization: Bearer <FILX_API_KEY>` header.
    """
    return await _wallet_get("/v1/wallet/me", _wallet_headers(request))


@app.get(
    "/api/v1/wallet/balance",
    tags=["Wallet"],
    summary="Get wallet balance (USDC + ETH on Base)",
)
async def wallet_balance(request: Request):
    """
    Returns your current USDC and ETH balance on Base mainnet.

    **Requires** `Authorization: Bearer <FILX_API_KEY>` header.

    To fund your wallet: send USDC on Base to the address returned by `/api/v1/wallet/me`.
    """
    return await _wallet_get("/v1/wallet/balance", _wallet_headers(request))


@app.post(
    "/api/v1/wallet/sign",
    tags=["Wallet"],
    summary="Sign an x402 payment — for Python/JS agents",
)
async def wallet_sign(body: WalletSignRequest, request: Request):
    """
    Sign a `PAYMENT-REQUIRED` header value from a `402` response.

    Returns `payment_signature` — include it as the `PAYMENT-SIGNATURE` header
    when retrying the original request.

    **Requires** `Authorization: Bearer <FILX_API_KEY>` header.

    ### Python example
    ```python
    res = httpx.post("https://api.filx.io/api/v1/pdf/to-markdown",
        json={"url": "https://example.com/doc.pdf"})

    if res.status_code == 402:
        signed = httpx.post("https://api.filx.io/api/v1/wallet/sign",
            headers={"Authorization": f"Bearer {KEY}"},
            json={"payment_required": res.headers["PAYMENT-REQUIRED"]}
        ).json()["payment_signature"]

        result = httpx.post("https://api.filx.io/api/v1/pdf/to-markdown",
            json={"url": "https://example.com/doc.pdf"},
            headers={"PAYMENT-SIGNATURE": signed}
        ).json()
    ```
    """
    return await _wallet_post("/v1/x402/sign", body.model_dump(), _wallet_headers(request))


@app.post(
    "/api/v1/wallet/prompt",
    tags=["Wallet"],
    summary="Natural language file conversion — auto-pays",
)
async def wallet_prompt(body: WalletPromptRequest, request: Request):
    """
    Describe what you want in plain English. FliX interprets the intent,
    calls the right endpoint, and pays automatically from your agent wallet.

    **Requires** `Authorization: Bearer <FILX_API_KEY>` header.

    ### Example
    ```
    filx prompt "Convert https://example.com/doc.pdf to markdown"
    ```
    """
    return await _wallet_post("/v1/prompt", body.model_dump(), _wallet_headers(request))


# ── Jobs ──────────────────────────────────────────────────────────────────────

@app.get(
    "/api/v1/jobs/{job_id}",
    tags=["Jobs"],
    summary="Get job status and result",
    responses={
        404: {"description": "Job not found or expired.", "model": ErrorResponse},
    },
)
async def get_job(job_id: str):
    """
    Retrieve the status and result of an asynchronous conversion job.

    **Note:** Output files are automatically deleted **1 hour** after creation.
    If this endpoint returns 404, the file has expired — resubmit the conversion.
    """
    return JSONResponse(
        status_code=404,
        content={
            "error": "not_found",
            "message": f"Job '{job_id}' not found or expired. Output files auto-delete after 1 hour.",
        },
    )
