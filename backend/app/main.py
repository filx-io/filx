"""
FilX.io — x402 File Converter Primitive for AI Agents
api.filx.io
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import base64
import json

app = FastAPI(
    title="FilX.io API",
    description="The x402 File Converter Primitive for AI Agents. No accounts, no API keys — pay per request with USDC on Base via the x402 protocol.",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "ALLOWED_ORIGINS",
        "https://filx.io,https://app.filx.io,https://status.filx.io,http://localhost:3000"
    ).split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["PAYMENT-REQUIRED", "PAYMENT-RESPONSE"],
)

# ── Config ───────────────────────────────────────────────────────────────────
TREASURY_ADDRESS = os.getenv("TREASURY_ADDRESS", "0x0000000000000000000000000000000000000000")
BASE_URL = os.getenv("BASE_URL", "https://api.filx.io")

PRICING = {
    # Document
    "pdf_to_markdown":      {"amount": "0.002", "unit": "per page"},
    "pdf_ocr":              {"amount": "0.004", "unit": "per page"},
    "pdf_compress":         {"amount": "0.002", "unit": "per file"},
    "pdf_merge":            {"amount": "0.002", "unit": "per job"},
    "pdf_split":            {"amount": "0.002", "unit": "per job"},
    "pdf_rotate":           {"amount": "0.001", "unit": "per job"},
    "pdf_unlock":           {"amount": "0.003", "unit": "per file"},
    "pdf_to_image":         {"amount": "0.002", "unit": "per page"},
    "html_to_pdf":          {"amount": "0.002", "unit": "per page"},
    "markdown_to_pdf":      {"amount": "0.002", "unit": "per page"},
    # Image
    "image_resize":         {"amount": "0.001", "unit": "per image"},
    "image_compress":       {"amount": "0.001", "unit": "per image"},
    "image_convert":        {"amount": "0.001", "unit": "per image"},
    "image_crop":           {"amount": "0.001", "unit": "per image"},
    "image_bg_remove":      {"amount": "0.005", "unit": "per image"},
    "image_upscale":        {"amount": "0.008", "unit": "per image"},
    "image_watermark":      {"amount": "0.001", "unit": "per image"},
    "image_rotate":         {"amount": "0.001", "unit": "per image"},
    # Data
    "table_extract":        {"amount": "0.003", "unit": "per page"},
    "ocr_image":            {"amount": "0.003", "unit": "per image"},
}

DISCOUNTS = {
    "batch_5plus":  "10%",
    "batch_10plus": "20%",
}


def make_payment_required(operation: str) -> dict:
    """Build a PAYMENT-REQUIRED payload for the given operation."""
    price = PRICING.get(operation, {"amount": "0.001"})
    amount_usdc = price["amount"]
    # Convert to micro-units (USDC has 6 decimals)
    amount_micro = str(int(float(amount_usdc) * 1_000_000))
    return {
        "scheme":    "exact",
        "network":   "base",
        "currency":  "USDC",
        "amount":    amount_micro,
        "amount_usdc": amount_usdc,
        "recipient": TREASURY_ADDRESS,
        "operation": operation,
    }


def payment_required_response(operation: str, endpoint: str) -> JSONResponse:
    """Return a proper HTTP 402 with PAYMENT-REQUIRED header."""
    payload = make_payment_required(operation)
    encoded = base64.b64encode(json.dumps(payload).encode()).decode()
    return JSONResponse(
        status_code=402,
        content={
            "error": "payment_required",
            "operation": operation,
            "amount": payload["amount_usdc"],
            "currency": "USDC",
            "network": "base",
            "message": f"Include PAYMENT-SIGNATURE header with a signed USDC payment of {payload['amount_usdc']} USDC on Base.",
            "docs": "https://filx.io/docs#x402",
        },
        headers={"PAYMENT-REQUIRED": encoded},
    )


# ── System ───────────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
async def health():
    return {
        "status": "ok",
        "service": "filx.io",
        "version": "0.2.0",
    }


@app.get("/", tags=["System"])
async def root():
    return {
        "service":  "FilX.io",
        "tagline":  "The x402 File Converter Primitive for AI Agents",
        "version":  "0.2.0",
        "status":   "beta",
        "base_url": BASE_URL,
        "docs":     "https://filx.io/docs",
        "swagger":  f"{BASE_URL}/docs",
        "twitter":  "@filx_io",
        "endpoints": {
            "pricing": "/api/v1/pricing",
            "docs":    "/docs",
            "health":  "/health",
        },
    }


@app.get("/api/v1/pricing", tags=["Info"])
async def pricing():
    """Return current pricing for all conversion operations."""
    return {
        "currency":  "USDC",
        "network":   "base",
        "chain_id":  8453,
        "decimals":  6,
        "prices":    PRICING,
        "discounts": DISCOUNTS,
        "notes": {
            "minimum":    "$0.001 USDC per job",
            "billing":    "Charged per page for multi-page PDFs. No charge on error.",
            "settlement": "On-chain USDC on Base mainnet. Every payment has an immutable tx receipt.",
        },
    }


# ── Document Processing ───────────────────────────────────────────────────────

@app.post("/api/v1/pdf/to-markdown", tags=["Document"])
async def pdf_to_markdown(request: Request):
    """Convert PDF to Markdown. $0.002 USDC per page via x402."""
    return payment_required_response("pdf_to_markdown", "/api/v1/pdf/to-markdown")


@app.post("/api/v1/pdf/ocr", tags=["Document"])
async def pdf_ocr(request: Request):
    """Extract text from scanned PDFs via OCR. $0.004 USDC per page."""
    return payment_required_response("pdf_ocr", "/api/v1/pdf/ocr")


@app.post("/api/v1/pdf/compress", tags=["Document"])
async def pdf_compress(request: Request):
    """Compress a PDF. $0.002 USDC per file."""
    return payment_required_response("pdf_compress", "/api/v1/pdf/compress")


@app.post("/api/v1/pdf/merge", tags=["Document"])
async def pdf_merge(request: Request):
    """Merge multiple PDFs. $0.002 USDC per job."""
    return payment_required_response("pdf_merge", "/api/v1/pdf/merge")


@app.post("/api/v1/pdf/split", tags=["Document"])
async def pdf_split(request: Request):
    """Split a PDF by page range. $0.002 USDC per job."""
    return payment_required_response("pdf_split", "/api/v1/pdf/split")


@app.post("/api/v1/pdf/rotate", tags=["Document"])
async def pdf_rotate(request: Request):
    """Rotate PDF pages. $0.001 USDC per job."""
    return payment_required_response("pdf_rotate", "/api/v1/pdf/rotate")


@app.post("/api/v1/pdf/unlock", tags=["Document"])
async def pdf_unlock(request: Request):
    """Remove password from PDF. $0.003 USDC per file."""
    return payment_required_response("pdf_unlock", "/api/v1/pdf/unlock")


@app.post("/api/v1/pdf/to-image", tags=["Document"])
async def pdf_to_image(request: Request):
    """Render PDF pages to PNG/JPG. $0.002 USDC per page."""
    return payment_required_response("pdf_to_image", "/api/v1/pdf/to-image")


@app.post("/api/v1/html/to-pdf", tags=["Document"])
async def html_to_pdf(request: Request):
    """Convert HTML or URL to PDF. $0.002 USDC per page."""
    return payment_required_response("html_to_pdf", "/api/v1/html/to-pdf")


@app.post("/api/v1/markdown/to-pdf", tags=["Document"])
async def markdown_to_pdf(request: Request):
    """Convert Markdown to styled PDF. $0.002 USDC per page."""
    return payment_required_response("markdown_to_pdf", "/api/v1/markdown/to-pdf")


# ── Image Processing ──────────────────────────────────────────────────────────

@app.post("/api/v1/image/resize", tags=["Image"])
async def image_resize(request: Request):
    """Resize an image. $0.001 USDC per image."""
    return payment_required_response("image_resize", "/api/v1/image/resize")


@app.post("/api/v1/image/compress", tags=["Image"])
async def image_compress(request: Request):
    """Compress an image. $0.001 USDC per image."""
    return payment_required_response("image_compress", "/api/v1/image/compress")


@app.post("/api/v1/image/convert", tags=["Image"])
async def image_convert(request: Request):
    """Convert image format. $0.001 USDC per image."""
    return payment_required_response("image_convert", "/api/v1/image/convert")


@app.post("/api/v1/image/crop", tags=["Image"])
async def image_crop(request: Request):
    """Crop an image. $0.001 USDC per image."""
    return payment_required_response("image_crop", "/api/v1/image/crop")


@app.post("/api/v1/image/remove-bg", tags=["Image"])
async def image_remove_bg(request: Request):
    """Remove image background (AI). $0.005 USDC per image."""
    return payment_required_response("image_bg_remove", "/api/v1/image/remove-bg")


@app.post("/api/v1/image/upscale", tags=["Image"])
async def image_upscale(request: Request):
    """AI super-resolution upscale 2x/4x. $0.008 USDC per image."""
    return payment_required_response("image_upscale", "/api/v1/image/upscale")


@app.post("/api/v1/image/watermark", tags=["Image"])
async def image_watermark(request: Request):
    """Add watermark to image. $0.001 USDC per image."""
    return payment_required_response("image_watermark", "/api/v1/image/watermark")


@app.post("/api/v1/image/rotate", tags=["Image"])
async def image_rotate(request: Request):
    """Rotate or flip an image. $0.001 USDC per image."""
    return payment_required_response("image_rotate", "/api/v1/image/rotate")


# ── Data Extraction ───────────────────────────────────────────────────────────

@app.post("/api/v1/table/extract", tags=["Data"])
async def table_extract(request: Request):
    """Extract tables from PDF or image. $0.003 USDC per page."""
    return payment_required_response("table_extract", "/api/v1/table/extract")


@app.post("/api/v1/ocr/image", tags=["Data"])
async def ocr_image(request: Request):
    """OCR text extraction from images. $0.003 USDC per image."""
    return payment_required_response("ocr_image", "/api/v1/ocr/image")


# ── Legacy / Generic ──────────────────────────────────────────────────────────

@app.post("/api/v1/convert", tags=["Legacy"])
async def convert_generic(request: Request):
    """Generic convert endpoint (deprecated — use specific endpoints)."""
    return JSONResponse(
        status_code=410,
        content={
            "error": "gone",
            "message": "Use specific endpoints: /api/v1/pdf/to-markdown, /api/v1/image/resize, etc.",
            "docs": "https://filx.io/docs",
        },
    )


@app.get("/api/v1/jobs/{job_id}", tags=["Jobs"])
async def get_job(job_id: str):
    """Get the status/result of a conversion job."""
    return JSONResponse(
        status_code=404,
        content={
            "error": "not_found",
            "message": f"Job '{job_id}' not found or expired. Output files auto-delete after 1 hour.",
        },
    )
