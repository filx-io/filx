"""
FilX.io — Backend API Tests
Tests for system endpoints, pricing, and x402 payment flow.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac


# ── System ────────────────────────────────────────────────────

@pytest.mark.anyio
async def test_health(client):
    res = await client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert "version" in data
    assert "service" in data


@pytest.mark.anyio
async def test_root(client):
    res = await client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["service"] == "FilX.io"
    assert "version" in data
    assert "docs" in data


# ── Pricing ───────────────────────────────────────────────────

@pytest.mark.anyio
async def test_pricing(client):
    res = await client.get("/api/v1/pricing")
    assert res.status_code == 200
    data = res.json()
    assert data["currency"] == "USDC"
    assert data["network"] == "base"
    assert data["chain_id"] == 8453
    assert "prices" in data
    assert "discounts" in data


@pytest.mark.anyio
async def test_pricing_has_all_operations(client):
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


@pytest.mark.anyio
async def test_pricing_no_token_discount(client):
    """Ensure filx_token_holder discount is not present (tokenomics removed)."""
    res = await client.get("/api/v1/pricing")
    discounts = res.json()["discounts"]
    assert "filx_token_holder" not in discounts


# ── x402 Payment Flow ─────────────────────────────────────────

CONVERSION_ENDPOINTS = [
    "/api/v1/pdf/to-markdown",
    "/api/v1/pdf/ocr",
    "/api/v1/pdf/compress",
    "/api/v1/pdf/merge",
    "/api/v1/pdf/split",
    "/api/v1/pdf/rotate",
    "/api/v1/pdf/unlock",
    "/api/v1/pdf/to-image",
    "/api/v1/html/to-pdf",
    "/api/v1/markdown/to-pdf",
    "/api/v1/image/resize",
    "/api/v1/image/compress",
    "/api/v1/image/convert",
    "/api/v1/image/crop",
    "/api/v1/image/remove-bg",
    "/api/v1/image/upscale",
    "/api/v1/image/watermark",
    "/api/v1/image/rotate",
    "/api/v1/table/extract",
    "/api/v1/ocr/image",
]


@pytest.mark.anyio
@pytest.mark.parametrize("endpoint", CONVERSION_ENDPOINTS)
async def test_endpoint_returns_402(client, endpoint):
    """All conversion endpoints must return HTTP 402 with PAYMENT-REQUIRED header."""
    res = await client.post(
        endpoint,
        headers={"Content-Type": "application/json"},
        json={"url": "https://example.com/test.pdf"},
    )
    assert res.status_code == 402, f"{endpoint} returned {res.status_code}, expected 402"
    assert "PAYMENT-REQUIRED" in res.headers, f"{endpoint} missing PAYMENT-REQUIRED header"


@pytest.mark.anyio
async def test_payment_required_header_is_valid_base64(client):
    """PAYMENT-REQUIRED header must be valid base64-encoded JSON."""
    import base64, json
    res = await client.post(
        "/api/v1/pdf/to-markdown",
        headers={"Content-Type": "application/json"},
        json={"url": "https://example.com/test.pdf"},
    )
    assert res.status_code == 402
    header = res.headers["PAYMENT-REQUIRED"]
    decoded = json.loads(base64.b64decode(header).decode())
    assert decoded["scheme"] == "exact"
    assert decoded["currency"] == "USDC"
    assert decoded["network"] == "base"
    assert "amount" in decoded
    assert "recipient" in decoded


@pytest.mark.anyio
async def test_payment_required_body(client):
    """402 response body must include error code, amount, and docs link."""
    res = await client.post(
        "/api/v1/pdf/to-markdown",
        headers={"Content-Type": "application/json"},
        json={"url": "https://example.com/test.pdf"},
    )
    data = res.json()
    assert data["error"] == "payment_required"
    assert "amount" in data
    assert "currency" in data
    assert "docs" in data


@pytest.mark.anyio
async def test_legacy_convert_returns_410(client):
    """/api/v1/convert (legacy) should return 410 Gone."""
    res = await client.post(
        "/api/v1/convert",
        headers={"Content-Type": "application/json"},
        json={"type": "pdf_to_markdown", "url": "https://example.com/test.pdf"},
    )
    assert res.status_code == 410


@pytest.mark.anyio
async def test_job_not_found(client):
    res = await client.get("/api/v1/jobs/nonexistent-job-id")
    assert res.status_code == 404
