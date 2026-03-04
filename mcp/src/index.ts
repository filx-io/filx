#!/usr/bin/env node
/**
 * FilX MCP Server
 * Exposes all 21 FilX file-processing tools as MCP tools.
 * Auth: X-FilX-API-Key header (set FILX_API_KEY env var).
 *
 * Setup:
 *   FILX_API_KEY=your_key   — get one at filx.io or use your Bankr API key
 *   FILX_API_URL=https://api.filx.io  (optional, defaults to production)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ── Config ─────────────────────────────────────────────────────────────────

const API_KEY = process.env.FILX_API_KEY;
const API_URL = process.env.FILX_API_URL ?? "https://api.filx.io";

if (!API_KEY) {
  console.error(
    "❌ FILX_API_KEY is required.\n" +
    "   Set it to your FilX API key (or Bankr API key: bk_...).\n" +
    "   Get one at filx.io"
  );
  process.exit(1);
}

// ── FilX API call helper ───────────────────────────────────────────────────

async function filxCall(path: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-FilX-API-Key": API_KEY!,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`FilX error ${res.status}: ${err}`);
  }
  return res.json();
}

// ── Tool definitions ───────────────────────────────────────────────────────

const TOOLS = [
  // ── Document ──────────────────────────────────────────────────────────────
  {
    name: "pdf_to_markdown",
    description: "Convert a PDF to Markdown. Preserves headings, tables, lists, and code blocks. Ideal for feeding documents into LLM context or RAG pipelines.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF." },
        pages: { type: "string", description: "Page range e.g. '1-5'. Defaults to all." },
      },
    },
    path: "/api/v1/pdf/to-markdown",
  },
  {
    name: "pdf_ocr",
    description: "Extract text from scanned or image-heavy PDFs using OCR. Supports English and Indonesian.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the scanned PDF." },
        lang: { type: "string", description: "'eng' (default) or 'ind'." },
      },
    },
    path: "/api/v1/pdf/ocr",
  },
  {
    name: "pdf_compress",
    description: "Reduce PDF file size using Ghostscript.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF." },
        quality: { type: "string", description: "'low', 'medium' (default), or 'high'." },
      },
    },
    path: "/api/v1/pdf/compress",
  },
  {
    name: "pdf_merge",
    description: "Combine multiple PDFs into one file.",
    inputSchema: {
      type: "object", required: ["urls"],
      properties: {
        urls: { type: "array", items: { type: "string" }, description: "Array of public PDF URLs to merge in order (max 10)." },
      },
    },
    path: "/api/v1/pdf/merge",
  },
  {
    name: "pdf_split",
    description: "Split a PDF into multiple files by page range.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF." },
        ranges: { type: "string", description: "Comma-separated ranges e.g. '1-3,4-7,8-'." },
        every: { type: "number", description: "Split every N pages." },
      },
    },
    path: "/api/v1/pdf/split",
  },
  {
    name: "pdf_rotate",
    description: "Rotate PDF pages by 90, 180, or 270 degrees.",
    inputSchema: {
      type: "object", required: ["url", "angle"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF." },
        angle: { type: "number", description: "90, 180, or 270." },
        pages: { type: "string", description: "Page range to rotate. Defaults to all." },
      },
    },
    path: "/api/v1/pdf/rotate",
  },
  {
    name: "pdf_unlock",
    description: "Remove password protection from a PDF.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the locked PDF." },
        password: { type: "string", description: "PDF password if known." },
      },
    },
    path: "/api/v1/pdf/unlock",
  },
  {
    name: "pdf_to_image",
    description: "Render each PDF page as a PNG or JPG image.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the PDF." },
        dpi: { type: "number", description: "Resolution: 72, 96, 150 (default), 300." },
        format: { type: "string", description: "'png' (default) or 'jpg'." },
        pages: { type: "string", description: "Page range. Defaults to all." },
      },
    },
    path: "/api/v1/pdf/to-image",
  },
  {
    name: "html_to_pdf",
    description: "Convert a webpage URL or raw HTML string to PDF.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Public URL of the webpage." },
        html: { type: "string", description: "Raw HTML string. Use url or html, not both." },
        page_size: { type: "string", description: "'A4' (default), 'letter', or 'A3'." },
        margin: { type: "string", description: "CSS margin. Default: '20px'." },
      },
    },
    path: "/api/v1/html/to-pdf",
  },
  {
    name: "markdown_to_pdf",
    description: "Convert Markdown to a styled PDF. Themes: default, github, minimal.",
    inputSchema: {
      type: "object", required: ["markdown"],
      properties: {
        markdown: { type: "string", description: "Raw Markdown content." },
        theme: { type: "string", description: "'default', 'github', or 'minimal'." },
      },
    },
    path: "/api/v1/markdown/to-pdf",
  },
  // ── Image ─────────────────────────────────────────────────────────────────
  {
    name: "image_resize",
    description: "Resize an image by width, height, or scale factor.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the image." },
        width: { type: "number" }, height: { type: "number" },
        scale: { type: "number", description: "Scale factor e.g. 0.5 for 50%." },
        fit: { type: "string", description: "'contain' (default), 'cover', 'fill'." },
      },
    },
    path: "/api/v1/image/resize",
  },
  {
    name: "image_compress",
    description: "Reduce image file size by adjusting quality.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the image." },
        quality: { type: "number", description: "Quality 1-100. Default: 80." },
        lossless: { type: "boolean" },
      },
    },
    path: "/api/v1/image/compress",
  },
  {
    name: "image_convert",
    description: "Convert an image to a different format (png, jpg, webp, avif, gif, bmp, tiff).",
    inputSchema: {
      type: "object", required: ["url", "format"],
      properties: {
        url: { type: "string", description: "Public URL of the image." },
        format: { type: "string", description: "Target format: png, jpg, webp, avif, gif, bmp, tiff." },
      },
    },
    path: "/api/v1/image/convert",
  },
  {
    name: "image_crop",
    description: "Crop an image. Use smart=true for AI center-crop.",
    inputSchema: {
      type: "object", required: ["url", "width", "height"],
      properties: {
        url: { type: "string" }, x: { type: "number" }, y: { type: "number" },
        width: { type: "number" }, height: { type: "number" },
        smart: { type: "boolean", description: "Smart center-crop — ignores x/y." },
      },
    },
    path: "/api/v1/image/crop",
  },
  {
    name: "image_remove_bg",
    description: "Remove background from an image. Returns transparent PNG. Powered by AI.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: { url: { type: "string", description: "Public URL of the image (PNG/JPG/WebP)." } },
    },
    path: "/api/v1/image/remove-bg",
  },
  {
    name: "image_upscale",
    description: "Upscale an image 2x or 4x.",
    inputSchema: {
      type: "object", required: ["url", "scale"],
      properties: {
        url: { type: "string" },
        scale: { type: "number", description: "2 (2×) or 4 (4×)." },
      },
    },
    path: "/api/v1/image/upscale",
  },
  {
    name: "image_watermark",
    description: "Add text or image watermark to a photo.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string" }, text: { type: "string" }, watermark_url: { type: "string" },
        position: { type: "string", description: "center, top-left, top-right, bottom-left, bottom-right (default)." },
        opacity: { type: "number", description: "0.0–1.0. Default: 0.5." },
        rotation: { type: "number" },
      },
    },
    path: "/api/v1/image/watermark",
  },
  {
    name: "image_rotate",
    description: "Rotate or flip an image.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string" },
        angle: { type: "number", description: "90, 180, or 270." },
        flip: { type: "string", description: "'horizontal' or 'vertical'." },
      },
    },
    path: "/api/v1/image/rotate",
  },
  // ── Extraction ────────────────────────────────────────────────────────────
  {
    name: "table_extract",
    description: "Extract tables from PDFs into JSON or CSV.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string" },
        format: { type: "string", description: "'json' (default) or 'csv'." },
        pages: { type: "string" },
      },
    },
    path: "/api/v1/table/extract",
  },
  {
    name: "ocr_image",
    description: "Extract text from a photo, screenshot, or scanned image. Supports English and Indonesian.",
    inputSchema: {
      type: "object", required: ["url"],
      properties: {
        url: { type: "string" },
        lang: { type: "string", description: "'eng' (default) or 'ind'." },
        structured: { type: "boolean", description: "Return bounding boxes and confidence scores." },
      },
    },
    path: "/api/v1/ocr/image",
  },
  // ── NL Router ─────────────────────────────────────────────────────────────
  {
    name: "process",
    description: "Natural language file processing. Describe what you want in plain English — FilX picks the right tool and runs it automatically.",
    inputSchema: {
      type: "object", required: ["prompt"],
      properties: {
        prompt: { type: "string", description: "e.g. 'convert this PDF to markdown' or 'remove the background'." },
        file_url: { type: "string" },
        file_urls: { type: "array", items: { type: "string" } },
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
  tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) {
    return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  }
  try {
    const result = await filxCall(tool.path, args as Record<string, unknown>);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text", text: `FilX error: ${msg}` }], isError: true };
  }
});

// ── Start ──────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);

console.error(`✅ FilX MCP server running`);
console.error(`   API: ${API_URL}`);
console.error(`   Tools: ${TOOLS.length}`);
