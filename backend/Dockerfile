# ============================================================
# FilX.io Backend — Dockerfile
# Python 3.12 + FastAPI + Celery
# ============================================================

FROM python:3.12-slim AS base

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    # PDF tools
    ghostscript \
    poppler-utils \
    # OCR
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-ind \
    # Image processing
    libvips \
    libmagic1 \
    # HTML/CSS → PDF (weasyprint)
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libffi-dev \
    shared-mime-info \
    # Build tools
    gcc \
    g++ \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Create temp dirs
RUN mkdir -p /tmp/uploads /tmp/outputs

# Non-root user for security
RUN adduser --disabled-password --gecos '' filxuser && \
    chown -R filxuser:filxuser /app /tmp/uploads /tmp/outputs
USER filxuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Default: run API server
# Railway sets $PORT automatically
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
