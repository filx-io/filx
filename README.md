# 🗂️ FilX.io

**The x402 File Converter Primitive for AI Agents**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF)](https://base.org)
[![x402 Powered](https://img.shields.io/badge/x402-Powered-purple)](https://x402.org)
[![Twitter](https://img.shields.io/twitter/follow/filx_io?style=social)](https://twitter.com/filx_io)

> Convert any file. Pay per use. Built for agents.

FilX.io is a primitive service that enables AI agents (MCP, AutoGPT, CrewAI, LangGraph, etc.) to perform high-quality file conversions with instant micropayments via HTTP 402 Payment Required using USDC on Base chain.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **PDF → Markdown** | Structured output with headings, tables, lists — perfect for RAG |
| 🔍 **OCR** | Images & scanned PDFs, English + Indonesian |
| 🖼️ **Image Converter** | PNG/JPG/WebP/AVIF + compress, resize, background removal |
| 📊 **Table Extraction** | PDF/image → CSV/JSON |
| 🔧 **PDF Tools** | Compress, merge, split, rotate, unlock |
| 🤖 **Agent-Native** | HTTP 402 x402, JSON responses, MCP tool manifest |
| ⚡ **Instant Payment** | USDC on Base, $0.001–$0.05 per job |

---

## 🏗️ Architecture

```
filx.io (Next.js 15)  ←→  api.filx.io (FastAPI + Celery)  ←→  Base Chain
                                    ↕
                         Cloudflare R2 (file storage)
                         PostgreSQL (jobs + payments)
                         Redis (queue + cache)
```

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for full diagrams and x402 payment flow.

---

## 📁 Project Structure

```
filx-io/
├── backend/                    # FastAPI backend (Python 3.12)
│   ├── app/
│   │   ├── api/v1/endpoints/  # Route handlers
│   │   ├── core/              # Config, security, database
│   │   ├── services/          # Conversion logic
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── utils/             # Helpers (R2, payment, etc.)
│   │   └── workers/           # Celery tasks
│   ├── tests/                 # Pytest test suite
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pyproject.toml
│
├── frontend/                   # Next.js 15 App Router (TypeScript)
│   ├── app/
│   │   ├── page.tsx           # Landing + converter
│   │   ├── dashboard/         # Job history, API keys
│   │   └── api/webhook/       # Payment webhook
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── converter/         # File upload, options, progress
│   │   └── payment/           # Wallet connect, payment flow
│   ├── lib/                   # API client, x402 utils
│   ├── Dockerfile
│   └── package.json
│
├── infra/
│   ├── docker/                # docker-compose.yml
│   ├── railway/               # railway.toml configs
│   └── nginx/                 # nginx.conf (optional)
│
├── scripts/
│   ├── deploy.sh              # One-click deploy to Railway
│   ├── setup-db.sh            # Database migration runner
│   └── test-agent.py          # Agent integration test
│
├── docs/
│   ├── ARCHITECTURE.md        # System design + flow diagrams
│   ├── API.md                 # Full API reference
│   ├── AGENT_GUIDE.md         # How to integrate as agent tool
│   └── PRICING.md             # Pricing model details
│
├── .github/workflows/         # CI/CD pipelines
├── .env.example               # All environment variables
└── README.md
```

---

## 🌐 Live Endpoints

| Service | URL |
|---------|-----|
| **API (production)** | https://filx-io-production.up.railway.app |
| **API Docs (Swagger)** | https://filx-io-production.up.railway.app/docs |
| **Health** | https://filx-io-production.up.railway.app/health |
| **Pricing** | https://filx-io-production.up.railway.app/api/v1/pricing |
| **GitHub** | https://github.com/filx-io/web |

---

## 🚀 Quick Start (Development)

```bash
# Clone
git clone https://github.com/filx-io/filx-io
cd filx-io

# Backend
cd backend
cp ../.env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# Workers (new terminal)
cd backend
celery -A app.workers.celery_app worker --loglevel=info
```

---

## 🤖 Agent Quick Integration

```python
# LangChain / LangGraph tool
from langchain.tools import tool
import httpx

@tool
def convert_file(file_url: str, output_format: str) -> dict:
    """Convert a file using FilX.io. Supports pdf->md, image->text, etc."""
    client = FilXClient(
        api_url="https://api.filx.io",
        wallet_private_key=os.getenv("AGENT_WALLET_KEY")
    )
    return client.convert(url=file_url, to=output_format)
```

See [docs/AGENT_GUIDE.md](./docs/AGENT_GUIDE.md) for MCP manifest, AutoGPT plugin, CrewAI tool.

---

## 💰 Pricing

| Operation | Price | Unit |
|-----------|-------|------|
| PDF → Markdown | $0.002 | per page |
| OCR (image) | $0.003 | per image |
| Image Convert | $0.001 | per image |
| Background Remove | $0.005 | per image |
| Table Extract | $0.003 | per page |
| PDF Tools | $0.001–$0.003 | per file |

All payments in USDC on Base chain via x402 protocol.

---

## 🏷️ $FILX Token (Coming Soon)

- 50% discount on all conversions
- Priority queue (skip ahead of free tier)
- Staking for passive yield from protocol fees
- Governance for new format support

---

## 📜 License

MIT © 2025 FilX.io

---

Built with ❤️ for the x402 ecosystem. Follow [@filx_io](https://twitter.com/filx_io).
