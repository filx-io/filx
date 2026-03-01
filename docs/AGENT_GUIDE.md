# FilX.io — Agent Integration Guide

> How to use FilX.io as a tool in your AI agent framework

---

## Quick Concepts

FilX.io uses the **x402 payment protocol**:
1. Your agent calls the API → gets `402 Payment Required`
2. Agent pays the exact USDC amount on Base
3. Agent re-calls with tx hash → gets the conversion result

Most x402-compatible clients handle steps 1-3 automatically.

---

## Option A: MCP (Model Context Protocol)

Add to your MCP config:

```json
{
  "mcpServers": {
    "filx": {
      "url": "https://api.filx.io/mcp",
      "transport": "http",
      "auth": {
        "type": "x402",
        "walletKey": "${AGENT_WALLET_KEY}",
        "network": "base"
      }
    }
  }
}
```

Available tools via MCP:
- `filx_convert_pdf` — PDF to markdown/JSON
- `filx_ocr` — Image/PDF OCR
- `filx_convert_image` — Image format conversion
- `filx_extract_tables` — Table extraction
- `filx_pdf_tools` — Compress/merge/split/rotate PDF

---

## Option B: LangChain / LangGraph

```python
# pip install filx-sdk
from filx import FilXClient, FilXTools
import os

client = FilXClient(
    api_url="https://api.filx.io",
    wallet_private_key=os.getenv("AGENT_WALLET_KEY"),  # Base chain wallet
    network="base"
)

# Use as LangChain tools
tools = FilXTools(client).get_tools()
# Returns: [convert_pdf_tool, ocr_tool, image_convert_tool, ...]

# Or use directly
result = client.convert(
    url="https://example.com/report.pdf",
    to="markdown",
    options={"include_tables": True, "language": "id"}
)
print(result.content)  # Markdown string
print(result.metadata)  # {pages: 5, cost_usdc: "0.010", duration_ms: 8200}
```

---

## Option C: Raw HTTP (any language)

### Step 1: First request (expect 402)

```bash
curl -X POST https://api.filx.io/api/v1/convert \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/document.pdf",
    "from": "pdf",
    "to": "markdown",
    "options": {"ocr": false}
  }'

# Response: 402 Payment Required
# Header: X-Payment-Required: eyJ2ZXJzaW9uIj...
# Body: {
#   "error": "payment_required",
#   "job_id": "jb_abc123",
#   "payment": {
#     "amount": "10000",
#     "currency": "USDC",
#     "network": "base",
#     "chain_id": 8453,
#     "recipient": "0xFILX...",
#     "expires_at": 1700000300
#   }
# }
```

### Step 2: Pay on Base chain

```python
from web3 import Web3
from eth_account import Account

w3 = Web3(Web3.HTTPProvider("https://mainnet.base.org"))
account = Account.from_key(os.getenv("AGENT_WALLET_KEY"))

# USDC contract (Base)
usdc = w3.eth.contract(
    address="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    abi=ERC20_ABI
)

tx = usdc.functions.transfer(
    "0xFILX_TREASURY_ADDRESS",
    10000  # 10000 micro-USDC = $0.01
).build_transaction({
    "from": account.address,
    "nonce": w3.eth.get_transaction_count(account.address),
    "gas": 100000,
    "gasPrice": w3.eth.gas_price,
    "chainId": 8453
})

signed = account.sign_transaction(tx)
tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
```

### Step 3: Re-submit with payment proof

```bash
curl -X POST https://api.filx.io/api/v1/convert \
  -H "Content-Type: application/json" \
  -H "X-Payment-Tx: 0x{tx_hash}" \
  -H "X-Payment-Job: jb_abc123" \
  -d '{
    "url": "https://example.com/document.pdf",
    "from": "pdf",
    "to": "markdown"
  }'

# Response: 200 OK
# {
#   "job_id": "jb_abc123",
#   "status": "queued",
#   "poll_url": "https://api.filx.io/api/v1/jobs/jb_abc123"
# }
```

### Step 4: Poll for result

```bash
curl https://api.filx.io/api/v1/jobs/jb_abc123

# When complete:
# {
#   "job_id": "jb_abc123",
#   "status": "complete",
#   "result": {
#     "format": "markdown",
#     "content": "# Document Title\n\n...",
#     "metadata": {
#       "pages": 5,
#       "words": 2847,
#       "has_tables": true,
#       "language": "en"
#     }
#   },
#   "download_url": "https://files.filx.io/jb_abc123/output.md",
#   "expires_at": "2025-01-01T12:00:00Z",
#   "cost": {"amount": "10000", "currency": "USDC", "usd": "0.010"}
# }
```

---

## Option D: AutoGPT Plugin

```yaml
# autogpt-plugin.yaml
name: FilX File Converter
description: Convert files (PDF→MD, OCR, images) with micropayments via x402
auth:
  type: x402
  wallet_key_env: AGENT_WALLET_KEY
  network: base
api:
  base_url: https://api.filx.io
  openapi_url: https://api.filx.io/openapi.json
```

---

## Option E: CrewAI Tool

```python
from crewai import Tool
from filx import FilXClient

client = FilXClient(wallet_private_key=os.getenv("AGENT_WALLET_KEY"))

filx_tool = Tool(
    name="FilX File Converter",
    description="""
    Convert files using FilX.io. Supports:
    - PDF to structured Markdown (great for RAG ingestion)
    - OCR on images and scanned PDFs (English + Indonesian)
    - Image format conversion (PNG/JPG/WebP/AVIF)
    - Table extraction from PDFs to CSV/JSON
    Input: {"url": "...", "to": "markdown|text|csv|json|png|jpg|webp|pdf"}
    """,
    func=lambda params: client.convert(**params)
)
```

---

## Response Codes (Agent-Specific)

| Code | Meaning | Agent Action |
|------|---------|-------------|
| `200` | Success | Parse result |
| `402` | Payment required | Pay and retry |
| `400` | Bad request | Fix input params |
| `413` | File too large | Split or compress first |
| `415` | Unsupported format | Check conversion matrix |
| `422` | Validation error | Check schema |
| `429` | Rate limited | Backoff + retry |
| `500` | Server error | Retry after 5s |
| `503` | Queue full | Retry after 30s |

### Error Response Format (always JSON)

```json
{
  "error": "payment_required",
  "error_code": "X402_PAYMENT_REQUIRED",
  "message": "Payment of 0.010 USDC required to proceed",
  "job_id": "jb_abc123",
  "payment": { ... },
  "docs": "https://filx.io/docs/errors/X402_PAYMENT_REQUIRED"
}
```

---

## Batch Conversions

```bash
POST /api/v1/convert/batch
{
  "files": [
    {"url": "https://example.com/doc1.pdf", "to": "markdown"},
    {"url": "https://example.com/doc2.pdf", "to": "markdown"},
    {"url": "https://example.com/scan.jpg", "to": "text", "options": {"language": "id"}}
  ]
}

# Returns single 402 with TOTAL cost for all files
# Pay once → all jobs processed
```

---

## Copy-Paste Agent Prompts

### For Claude / GPT-4 agents:
```
You have access to FilX.io file conversion tool. 
When you need to process a PDF, image, or document:
1. Use the filx_convert tool with the file URL
2. The tool handles payment automatically
3. Use the returned markdown/text for further processing

Available conversions: pdf→markdown, pdf→json, image→text (OCR), 
image→png/jpg/webp, pdf→csv (tables), pdf compress/merge/split
```

### For LangGraph nodes:
```python
# System prompt addition for LangGraph
FILX_TOOL_DESCRIPTION = """
FilX.io converts files. Use when you have a file URL to process.
Call: convert_file(url="...", to="markdown|text|csv|json|png|jpg|webp")
Cost: ~$0.001-0.01 per file (auto-paid via agent wallet)
Output: {content: "...", metadata: {...}, download_url: "..."}
"""
```
