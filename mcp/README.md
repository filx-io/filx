# @filx/mcp

> FilX MCP server — x402-native file processing for AI agents.

21 tools. PDF, image, OCR, extraction. Agents pay per use with USDC on Base via x402 — no API keys, no subscriptions.

## Install

```bash
npx @filx/mcp
```

Or install globally:

```bash
npm install -g @filx/mcp
```

## Setup

You need an EVM wallet with USDC on Base. Get one at [bankr.bot](https://bankr.bot) — it provisions a wallet instantly.

```bash
export FILX_PRIVATE_KEY=0x...your_private_key...
```

## Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filx": {
      "command": "npx",
      "args": ["@filx/mcp"],
      "env": {
        "FILX_PRIVATE_KEY": "0x..."
      }
    }
  }
}
```

## Tools

| Tool | Description | Cost |
|------|-------------|------|
| `pdf_to_markdown` | Convert PDF to Markdown | $0.002/page |
| `pdf_ocr` | OCR scanned PDFs | $0.004/page |
| `pdf_compress` | Compress PDF file size | $0.002/file |
| `pdf_merge` | Merge multiple PDFs | $0.002/job |
| `pdf_split` | Split PDF by page ranges | $0.002/job |
| `pdf_rotate` | Rotate PDF pages | $0.001/job |
| `pdf_unlock` | Remove PDF password | $0.003/file |
| `pdf_to_image` | PDF pages → images | $0.002/page |
| `html_to_pdf` | Webpage/HTML → PDF | $0.002/page |
| `markdown_to_pdf` | Markdown → PDF | $0.002/page |
| `image_resize` | Resize image | $0.001/image |
| `image_compress` | Compress image | $0.001/image |
| `image_convert` | Convert image format | $0.001/image |
| `image_crop` | Crop image | $0.001/image |
| `image_remove_bg` | Remove background (AI) | $0.005/image |
| `image_upscale` | Upscale 2x or 4x | $0.008/image |
| `image_watermark` | Add watermark | $0.001/image |
| `image_rotate` | Rotate/flip image | $0.001/image |
| `table_extract` | Extract tables from PDF | $0.003/page |
| `ocr_image` | OCR photo/screenshot | $0.003/image |
| `process` | Natural language routing | $0.005/request |

## How it works

Every tool call automatically:
1. Sends request to `api.filx.io`
2. Receives HTTP 402 with payment requirement
3. Signs USDC transfer on Base (EIP-3009)
4. Retries with `PAYMENT-SIGNATURE` header
5. Returns processed file URL or content

No API keys. No subscriptions. Pure x402.

## Links

- [filx.io](https://filx.io)
- [Docs](https://filx.io/docs)
- [x402 Protocol](https://x402.org)
