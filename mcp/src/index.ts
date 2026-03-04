#!/usr/bin/env node
/**
 * FilX MCP Server
 * Exposes all 18 FilX file-processing endpoints as MCP tools.
 * Payments are handled automatically via x402 (USDC on Base).
 *
 * Setup:
 *   FILX_PRIVATE_KEY=0x...  (EVM private key with USDC on Base)
 *   FILX_API_URL=https://api.filx.io  (optional, defaults to production)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { privateKeyToAccount } from "viem/accounts";
import { ExactEvmScheme, toClientEvmSigner } from "@x402/evm";
import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";

// ── Config ─────────────────────────────────────────────────────────────────

const PRIVATE_KEY = process.env.FILX_PRIVATE_KEY as `0x${string}` | undefined;
const API_URL = process.env.FILX_API_URL ?? "https://api.filx.io";

if (!PRIVATE_KEY) {
  console.error(
    "❌ FILX_PRIVATE_KEY is required.\n" +
    "   Set it to an EVM private key with USDC on Base.\n" +
    "   Get a funded wallet at bankr.bot — then export your private key."
  );
  process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY);
const signer = toClientEvmSigner(account);

// Wrap fetch with automatic x402 payment handling (EIP-3009 USDC on Base)
const x402Fetch = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [
    { network: "eip155:8453", client: new ExactEvmScheme(signer) },
  ],
});

// ── FilX API call helper ───────────────────────────────────────────────────

async function filxCall(path: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await x402Fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`FilX API error ${res.status}: ${err}`);
  }
  return res.json();
}

// ── Tool definitions ───────────────────────────────────────────────────────

const TOOLS = [
  // ── Document ──────────────────────────────────────────────────────────────
  {
    name: "pdf_to_markdown",
    description: "Convert a PDF to Markdown. Preserves headings, tables, lists, and code blocks. Ideal for feeding documents into LLM context. Costs $0.002 USDC per page.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF to convert." },
        pages: { type: "string", description: "Page range, e.g. '1-5' or '1,3,7'. Defaults to all." },
      },
    },
    path: "/api/v1/pdf/to-markdown",
  },
  {
    name: "pdf_ocr",
    description: "Extract text from scanned or image-heavy PDFs using OCR. Supports English and Indonesian. Costs $0.004 USDC per page.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the scanned PDF." },
        lang: { type: "string", description: "'eng' (English, default) or 'ind' (Indonesian)." },
      },
    },
    path: "/api/v1/pdf/ocr",
  },
  {
    name: "pdf_compress",
    description: "Reduce PDF file size using Ghostscript. Costs $0.002 USDC per file.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF to compress." },
        quality: { type: "string", description: "'low', 'medium' (default), or 'high'." },
      },
    },
    path: "/api/v1/pdf/compress",
  },
  {
    name: "pdf_merge",
    description: "Combine multiple PDFs into one. Costs $0.002 USDC per job.",
    inputSchema: {
      type: "object",
      required: ["urls"],
      properties: {
        urls: { type: "array", items: { type: "string" }, description: "Array of public PDF URLs to merge (in order, max 10)." },
      },
    },
    path: "/api/v1/pdf/merge",
  },
  {
    name: "pdf_split",
    description: "Split a PDF into multiple files by page ranges. Costs $0.002 USDC per job.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF to split." },
        ranges: { type: "string", description: "Comma-separated ranges, e.g. '1-3,4-7,8-'. Optional." },
        every: { type: "number", description: "Split every N pages. Alternative to ranges." },
      },
    },
    path: "/api/v1/pdf/split",
  },
  {
    name: "pdf_rotate",
    description: "Rotate PDF pages by 90, 180, or 270 degrees. Costs $0.001 USDC per job.",
    inputSchema: {
      type: "object",
      required: ["url", "angle"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF." },
        angle: { type: "number", description: "Rotation: 90, 180, or 270." },
        pages: { type: "string", description: "Page range to rotate. Defaults to all." },
      },
    },
    path: "/api/v1/pdf/rotate",
  },
  {
    name: "pdf_unlock",
    description: "Remove password protection from a PDF. Costs $0.003 USDC per file.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the locked PDF." },
        password: { type: "string", description: "PDF password, if known." },
      },
    },
    path: "/api/v1/pdf/unlock",
  },
  {
    name: "pdf_to_image",
    description: "Render each PDF page as an image (PNG or JPG). Costs $0.002 USDC per page.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF." },
        dpi: { type: "number", description: "Resolution: 72, 96, 150 (default), or 300." },
        format: { type: "string", description: "'png' (default) or 'jpg'." },
        pages: { type: "string", description: "Page range. Defaults to all." },
      },
    },
    path: "/api/v1/pdf/to-image",
  },
  {
    name: "html_to_pdf",
    description: "Convert a webpage URL or raw HTML string to PDF. Costs $0.002 USDC per page.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Public URL of the webpage to convert." },
        html: { type: "string", description: "Raw HTML string to convert. Use url or html, not both." },
        page_size: { type: "string", description: "'A4' (default), 'letter', or 'A3'." },
        margin: { type: "string", description: "CSS margin, e.g. '20px'. Default: '20px'." },
      },
    },
    path: "/api/v1/html/to-pdf",
  },
  {
    name: "markdown_to_pdf",
    description: "Convert Markdown text to a styled PDF. Supports github, minimal, and default themes. Costs $0.002 USDC per page.",
    inputSchema: {
      type: "object",
      required: ["markdown"],
      properties: {
        markdown: { type: "string", description: "Raw Markdown content to convert." },
        theme: { type: "string", description: "'default', 'github', or 'minimal'." },
      },
    },
    path: "/api/v1/markdown/to-pdf",
  },
  // ── Image ─────────────────────────────────────────────────────────────────
  {
    name: "image_resize",
    description: "Resize an image to a specific width, height, or scale factor. Costs $0.001 USDC per image.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the image." },
        width: { type: "number", description: "Target width in pixels." },
        height: { type: "number", description: "Target height in pixels." },
        scale: { type: "number", description: "Scale factor, e.g. 0.5 for 50%." },
        fit: { type: "string", description: "'contain' (default), 'cover', or 'fill'." },
      },
    },
    path: "/api/v1/image/resize",
  },
  {
    name: "image_compress",
    description: "Reduce image file size by adjusting quality. Costs $0.001 USDC per image.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the image." },
        quality: { type: "number", description: "Quality 1-100. Lower = smaller file. Default: 80." },
        lossless: { type: "boolean", description: "Force lossless compression (PNG/WebP only)." },
      },
    },
    path: "/api/v1/image/compress",
  },
  {
    name: "image_convert",
    description: "Convert image to a different format (png, jpg, webp, avif, gif, bmp, tiff). Costs $0.001 USDC per image.",
    inputSchema: {
      type: "object",
      required: ["url", "format"],
      properties: {
        url: { type: "string", description: "Public URL of the image." },
        format: { type: "string", description: "Target format: png, jpg, webp, avif, gif, bmp, tiff." },
      },
    },
    path: "/api/v1/image/convert",
  },
  {
    name: "image_crop",
    description: "Crop an image to a specific region. Supports smart center-crop. Costs $0.001 USDC per image.",
    inputSchema: {
      type: "object",
      required: ["url", "width", "height"],
      properties: {
        url: { type: "string", description: "Public URL of the image." },
        x: { type: "number", description: "Left offset in pixels." },
        y: { type: "number", description: "Top offset in pixels." },
        width: { type: "number", description: "Crop width in pixels." },
        height: { type: "number", description: "Crop height in pixels." },
        smart: { type: "boolean", description: "Smart center-crop — ignores x/y, centers on subject." },
      },
    },
    path: "/api/v1/image/crop",
  },
  {
    name: "image_remove_bg",
    description: "Remove background from an image and return a transparent PNG. Powered by AI. Costs $0.005 USDC per image.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the image (PNG/JPG/WebP)." },
      },
    },
    path: "/api/v1/image/remove-bg",
  },
  {
    name: "image_upscale",
    description: "Upscale an image 2x or 4x using Lanczos resampling. Costs $0.008 USDC per image.",
    inputSchema: {
      type: "object",
      required: ["url", "scale"],
      properties: {
        url: { type: "string", description: "Public URL of the image." },
        scale: { type: "number", description: "Upscale factor: 2 (2×) or 4 (4×)." },
      },
    },
    path: "/api/v1/image/upscale",
  },
  {
    name: "image_watermark",
    description: "Add a text or image watermark to a photo. Costs $0.001 USDC per image.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the image." },
        text: { type: "string", description: "Watermark text." },
        watermark_url: { type: "string", description: "URL of watermark image. Use text or watermark_url." },
        position: { type: "string", description: "center, top-left, top-right, bottom-left, bottom-right (default)." },
        opacity: { type: "number", description: "Opacity 0.0-1.0. Default: 0.5." },
        rotation: { type: "number", description: "Rotation in degrees. Default: 0." },
      },
    },
    path: "/api/v1/image/watermark",
  },
  {
    name: "image_rotate",
    description: "Rotate or flip an image. Costs $0.001 USDC per image.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the image." },
        angle: { type: "number", description: "Rotation: 90, 180, or 270 degrees." },
        flip: { type: "string", description: "'horizontal' or 'vertical'." },
      },
    },
    path: "/api/v1/image/rotate",
  },
  // ── Extraction ────────────────────────────────────────────────────────────
  {
    name: "table_extract",
    description: "Extract tables from PDFs into JSON or CSV format. Costs $0.003 USDC per page.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF." },
        format: { type: "string", description: "'json' (default) or 'csv'." },
        pages: { type: "string", description: "Page range. Defaults to all." },
      },
    },
    path: "/api/v1/table/extract",
  },
  {
    name: "ocr_image",
    description: "Extract text from a photo, screenshot, or scanned image using OCR. Supports English and Indonesian. Costs $0.003 USDC per image.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the image (PNG/JPG/WebP/BMP/TIFF)." },
        lang: { type: "string", description: "'eng' (English, default) or 'ind' (Indonesian)." },
        structured: { type: "boolean", description: "Return bounding boxes and confidence scores per word." },
      },
    },
    path: "/api/v1/ocr/image",
  },
  // ── NL Router ─────────────────────────────────────────────────────────────
  {
    name: "process",
    description: "Natural language file processing. Describe what you want in plain English — FilX figures out the right operation and runs it. No need to know endpoint names. Costs $0.005 USDC per request.",
    inputSchema: {
      type: "object",
      required: ["prompt"],
      properties: {
        prompt: { type: "string", description: "Natural language instruction, e.g. 'convert this PDF to markdown' or 'remove the background from my product photo'." },
        file_url: { type: "string", description: "URL of the file to process." },
        file_urls: { type: "array", items: { type: "string" }, description: "Multiple file URLs (for merge operations)." },
      },
    },
    path: "/api/v1/nl/process",
  },
] as const;

// ── MCP Server ─────────────────────────────────────────────────────────────

const server = new Server(
  { name: "filx", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) {
    return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  }

  try {
    const result = await filxCall(tool.path, args as Record<string, unknown>);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `FilX error: ${message}` }],
      isError: true,
    };
  }
});

// ── Start ──────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);

console.error(`✅ FilX MCP server running`);
console.error(`   Wallet: ${account.address}`);
console.error(`   API:    ${API_URL}`);
console.error(`   Tools:  ${TOOLS.length} (x402 payment: auto)`);
