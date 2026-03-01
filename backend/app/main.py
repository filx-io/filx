"""
FilX.io — x402 File Converter Primitive for AI Agents
api.filx.io
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

app = FastAPI(
    title="FilX.io API",
    description="The x402 File Converter Primitive for AI Agents",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "https://filx.io,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["System"])
async def health():
    return {"status": "ok", "service": "filx.io", "version": "0.1.0"}


@app.get("/", tags=["System"])
async def root():
    return {
        "service": "FilX.io",
        "tagline": "The x402 File Converter Primitive for AI Agents",
        "version": "0.1.0",
        "docs": "/docs",
        "twitter": "@filx_io",
        "status": "launching",
        "endpoints": {
            "convert": "/api/v1/convert",
            "batch":   "/api/v1/convert/batch",
            "jobs":    "/api/v1/jobs/{job_id}",
            "pricing": "/api/v1/pricing",
        }
    }


@app.get("/api/v1/pricing", tags=["Info"])
async def pricing():
    """Return current pricing for all conversion types."""
    return {
        "currency": "USDC",
        "network": "base",
        "prices": {
            "pdf_to_markdown":    {"amount": "0.002", "unit": "per page"},
            "pdf_to_markdown_ocr":{"amount": "0.004", "unit": "per page"},
            "ocr_image":          {"amount": "0.003", "unit": "per image"},
            "image_convert":      {"amount": "0.001", "unit": "per image"},
            "image_bg_remove":    {"amount": "0.005", "unit": "per image"},
            "table_extract":      {"amount": "0.003", "unit": "per page"},
            "pdf_compress":       {"amount": "0.002", "unit": "per file"},
            "pdf_merge":          {"amount": "0.002", "unit": "per merge"},
            "pdf_split":          {"amount": "0.002", "unit": "per file"},
            "pdf_rotate":         {"amount": "0.001", "unit": "per file"},
            "pdf_unlock":         {"amount": "0.003", "unit": "per file"},
        },
        "discounts": {
            "filx_token_holder": "50%",
            "batch_3plus": "10%",
            "batch_10plus": "20%",
        }
    }


@app.post("/api/v1/convert", tags=["Convert"])
async def convert(request: dict):
    """
    Convert a file. Returns 402 Payment Required with payment details.
    Full implementation coming in v0.2.0
    """
    return JSONResponse(
        status_code=402,
        content={
            "error": "payment_required",
            "error_code": "X402_PAYMENT_REQUIRED",
            "message": "FilX.io is launching soon. Full x402 payment flow coming.",
            "service": "filx.io",
            "twitter": "@filx_io",
            "docs": "https://filx.io/docs",
        }
    )


@app.get("/api/v1/jobs/{job_id}", tags=["Jobs"])
async def get_job(job_id: str):
    """Get the status and result of a conversion job."""
    return JSONResponse(
        status_code=404,
        content={
            "error": "not_found",
            "message": f"Job {job_id} not found. Full implementation launching soon.",
        }
    )
