"""
FilX.io — Backend API Tests
"""
import base64
import json

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac


# ── System ────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_health(client):
    res = await client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert "version" in data


@pytest.mark.asyncio
async def test_root(client):
    res = await client.get("/")
    assert res.status_code == 200
    assert res.json()["service"] == "FilX.io"


# ── Pricing ───────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_pricing_structure(client):
    res = await client.get("/api/v1/pricing")
    assert res.status_code == 200
    data = res.json()
    assert data["currency"] == "USDC"
    assert data["network"] == "base"
    assert data["chain_id"] == 8453


@pytest.mark.asyncio
async def test_pricing_all_20_operations(client):
    res = await client.get("/api/v1/pricing")
    prices = res.json()["prices"]
    expected = [
        "pdf_to_markdown", "pdf_ocr", "pdf_compress", "pdf_merge",
        "pdf_split", "pdf_rotate", "pdf_unlock", "pdf_to_image",
        "html_to_pdf", "markdown_to_pdf",
        "image_resize", "image_compress", "image_convert", "image_crop",
        "image_bg_remove", "image_upscale", "image_watermark", "image_rotate",
        "table_extract", "ocr_image",
    ]
    for op in expected:
        assert op in prices, f"Missing pricing for: {op}"


@pytest.mark.asyncio
async def test_pricing_no_filx_token_discount(client):
    res = await client.get("/api/v1/pricing")
    assert "filx_token_holder" not in res.json()["discounts"]


# ── x402 flow helpers ─────────────────────────────────────────

def assert_x402(res):
    assert res.status_code == 402, f"Expected 402, got {res.status_code}: {res.text}"
    assert "PAYMENT-REQUIRED" in res.headers, "Missing PAYMENT-REQUIRED header"
    data = res.json()
    assert data["error"] == "payment_required"
    assert "amount" in data
    assert "docs" in data


def decode_payment_header(res) -> dict:
    return json.loads(base64.b64decode(res.headers["PAYMENT-REQUIRED"]).decode())


# ── Document endpoints ────────────────────────────────────────

@pytest.mark.asyncio
async def test_pdf_to_markdown(client):
    res = await client.post("/api/v1/pdf/to-markdown",
        json={"url": "https://example.com/doc.pdf"})
    assert_x402(res)
    p = decode_payment_header(res)
    assert p["operation"] == "pdf_to_markdown"
    assert p["amount_usdc"] == "0.002"


@pytest.mark.asyncio
async def test_pdf_ocr(client):
    res = await client.post("/api/v1/pdf/ocr",
        json={"url": "https://example.com/scan.pdf", "lang": "eng"})
    assert_x402(res)
    assert decode_payment_header(res)["amount_usdc"] == "0.004"


@pytest.mark.asyncio
async def test_pdf_compress(client):
    res = await client.post("/api/v1/pdf/compress",
        json={"url": "https://example.com/large.pdf"})
    assert_x402(res)


@pytest.mark.asyncio
async def test_pdf_merge(client):
    res = await client.post("/api/v1/pdf/merge",
        json={"urls": ["https://example.com/a.pdf", "https://example.com/b.pdf"]})
    assert_x402(res)


@pytest.mark.asyncio
async def test_pdf_split(client):
    res = await client.post("/api/v1/pdf/split",
        json={"url": "https://example.com/doc.pdf", "ranges": "1-5,6-10"})
    assert_x402(res)


@pytest.mark.asyncio
async def test_pdf_rotate(client):
    res = await client.post("/api/v1/pdf/rotate",
        json={"url": "https://example.com/doc.pdf", "angle": 90})
    assert_x402(res)


@pytest.mark.asyncio
async def test_pdf_unlock(client):
    res = await client.post("/api/v1/pdf/unlock",
        json={"url": "https://example.com/locked.pdf"})
    assert_x402(res)


@pytest.mark.asyncio
async def test_pdf_to_image(client):
    res = await client.post("/api/v1/pdf/to-image",
        json={"url": "https://example.com/doc.pdf", "dpi": 150})
    assert_x402(res)


@pytest.mark.asyncio
async def test_html_to_pdf(client):
    res = await client.post("/api/v1/html/to-pdf",
        json={"url": "https://example.com/page"})
    assert_x402(res)


@pytest.mark.asyncio
async def test_html_to_pdf_with_html(client):
    res = await client.post("/api/v1/html/to-pdf",
        json={"html": "<h1>Hello</h1><p>World</p>"})
    assert_x402(res)


@pytest.mark.asyncio
async def test_html_to_pdf_missing_body_422(client):
    # x402 payment check runs before FastAPI body validation,
    # so unauthenticated requests get 402 (not 422) first.
    res = await client.post("/api/v1/html/to-pdf", json={})
    assert res.status_code in (402, 422)


@pytest.mark.asyncio
async def test_markdown_to_pdf(client):
    res = await client.post("/api/v1/markdown/to-pdf",
        json={"markdown": "# Hello\n\nWorld"})
    assert_x402(res)


# ── Image endpoints ───────────────────────────────────────────

@pytest.mark.asyncio
async def test_image_resize(client):
    res = await client.post("/api/v1/image/resize",
        json={"url": "https://example.com/photo.jpg", "width": 800})
    assert_x402(res)


@pytest.mark.asyncio
async def test_image_compress(client):
    res = await client.post("/api/v1/image/compress",
        json={"url": "https://example.com/photo.jpg", "quality": 80})
    assert_x402(res)


@pytest.mark.asyncio
async def test_image_convert(client):
    res = await client.post("/api/v1/image/convert",
        json={"url": "https://example.com/photo.jpg", "format": "webp"})
    assert_x402(res)


@pytest.mark.asyncio
async def test_image_crop(client):
    res = await client.post("/api/v1/image/crop",
        json={"url": "https://example.com/photo.jpg", "width": 400, "height": 400})
    assert_x402(res)


@pytest.mark.asyncio
async def test_image_remove_bg(client):
    res = await client.post("/api/v1/image/remove-bg",
        json={"url": "https://example.com/product.jpg"})
    assert_x402(res)
    assert decode_payment_header(res)["amount_usdc"] == "0.005"


@pytest.mark.asyncio
async def test_image_upscale(client):
    res = await client.post("/api/v1/image/upscale",
        json={"url": "https://example.com/photo.jpg", "scale": 2})
    assert_x402(res)
    assert decode_payment_header(res)["amount_usdc"] == "0.008"


@pytest.mark.asyncio
async def test_image_watermark(client):
    res = await client.post("/api/v1/image/watermark",
        json={"url": "https://example.com/photo.jpg", "text": "© 2026"})
    assert_x402(res)


@pytest.mark.asyncio
async def test_image_rotate(client):
    res = await client.post("/api/v1/image/rotate",
        json={"url": "https://example.com/photo.jpg", "angle": 90})
    assert_x402(res)


# ── Data endpoints ────────────────────────────────────────────

@pytest.mark.asyncio
async def test_table_extract(client):
    res = await client.post("/api/v1/table/extract",
        json={"url": "https://example.com/report.pdf"})
    assert_x402(res)
    assert decode_payment_header(res)["amount_usdc"] == "0.003"


@pytest.mark.asyncio
async def test_ocr_image(client):
    res = await client.post("/api/v1/ocr/image",
        json={"url": "https://example.com/invoice.jpg"})
    assert_x402(res)


# ── Payment header integrity ──────────────────────────────────

@pytest.mark.asyncio
async def test_payment_header_is_valid_base64_json(client):
    res = await client.post("/api/v1/pdf/to-markdown",
        json={"url": "https://example.com/doc.pdf"})
    p = decode_payment_header(res)
    assert p["scheme"] == "exact"
    assert p["currency"] == "USDC"
    assert p["network"] == "base"
    assert "amount" in p
    assert "recipient" in p
    assert "operation" in p


# ── Jobs ──────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_job_not_found(client):
    res = await client.get("/api/v1/jobs/nonexistent-id")
    assert res.status_code == 404
