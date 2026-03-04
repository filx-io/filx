"""
FilX.io — Real file processing implementations.
All processors download input from URL, process in /tmp, return download URL.
"""
from __future__ import annotations

import os
import subprocess
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import httpx
from PIL import Image, ImageDraw, ImageFont

# ── Config ────────────────────────────────────────────────────────────────────

UPLOADS_DIR = Path("/tmp/uploads")
OUTPUTS_DIR = Path("/tmp/outputs")
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

API_BASE_URL = os.getenv("API_BASE_URL", "https://api.filx.io")


# ── File helpers ──────────────────────────────────────────────────────────────

async def download_file(url: str, suffix: str = "") -> Path:
    """Download file from URL into /tmp/uploads. Returns local path."""
    if not suffix:
        # Try to guess extension from URL
        url_path = url.split("?")[0]
        suffix = Path(url_path).suffix or ".bin"
    dest = UPLOADS_DIR / f"{uuid.uuid4().hex}{suffix}"
    async with httpx.AsyncClient(timeout=60, follow_redirects=True) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        dest.write_bytes(resp.content)
    return dest


def make_output(suffix: str) -> Tuple[Path, str]:
    """Create output path and its public download URL."""
    fname = f"{uuid.uuid4().hex}{suffix}"
    path = OUTPUTS_DIR / fname
    url = f"{API_BASE_URL}/files/{fname}"
    return path, url


def _parse_page_range(pages_str: str, total: int) -> List[int]:
    """Parse '1-5,7,9-11' → [0,1,2,3,4,6,8,9,10] (0-indexed)."""
    result: List[int] = []
    for part in pages_str.split(","):
        part = part.strip()
        if "-" in part:
            a, b = part.split("-", 1)
            start = int(a) - 1 if a.strip() else 0
            end = int(b) - 1 if b.strip() else total - 1
            result.extend(range(max(0, start), min(total, end + 1)))
        elif part.isdigit():
            idx = int(part) - 1
            if 0 <= idx < total:
                result.append(idx)
    return result


# ── PDF Operations ────────────────────────────────────────────────────────────

async def proc_pdf_to_markdown(url: str, pages: Optional[str] = None) -> Dict[str, Any]:
    import fitz  # pymupdf
    src = await download_file(url, ".pdf")
    try:
        doc = fitz.open(str(src))
        page_nums = _parse_page_range(pages, len(doc)) if pages else list(range(len(doc)))
        parts: List[str] = []
        for i in page_nums:
            if i < len(doc):
                text = doc[i].get_text("markdown")
                if text.strip():
                    parts.append(text.strip())
        doc.close()
        content = "\n\n---\n\n".join(parts) if parts else ""
        return {
            "content": content,
            "pages_processed": len(page_nums),
            "cost_usdc": "0.002",
        }
    finally:
        src.unlink(missing_ok=True)


async def proc_pdf_ocr(url: str, lang: str = "eng") -> Dict[str, Any]:
    """OCR a scanned PDF via pdf2image + tesseract."""
    import pytesseract
    from pdf2image import convert_from_path
    src = await download_file(url, ".pdf")
    try:
        images = convert_from_path(str(src), dpi=200)
        pages_text: List[str] = []
        for img in images:
            text = pytesseract.image_to_string(img, lang=lang)
            pages_text.append(text.strip())
        content = "\n\n---\n\n".join(pages_text)
        return {
            "content": content,
            "pages_processed": len(images),
            "cost_usdc": "0.004",
        }
    finally:
        src.unlink(missing_ok=True)


async def proc_pdf_compress(url: str, quality: str = "medium") -> Dict[str, Any]:
    src = await download_file(url, ".pdf")
    out_path, out_url = make_output(".pdf")
    quality_map = {"low": "/screen", "medium": "/ebook", "high": "/printer"}
    gs_setting = quality_map.get(quality, "/ebook")
    try:
        subprocess.run(
            [
                "gs", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
                f"-dPDFSETTINGS={gs_setting}", "-dNOPAUSE", "-dQUIET", "-dBATCH",
                f"-sOutputFile={out_path}", str(src),
            ],
            check=True, timeout=120,
        )
        orig_size = src.stat().st_size
        out_size = out_path.stat().st_size
        reduction = round((1 - out_size / max(orig_size, 1)) * 100, 1)
        return {
            "download_url": out_url,
            "original_size_bytes": orig_size,
            "compressed_size_bytes": out_size,
            "reduction_percent": reduction,
        }
    finally:
        src.unlink(missing_ok=True)


async def proc_pdf_merge(urls: List[str]) -> Dict[str, Any]:
    from pypdf import PdfWriter
    writer = PdfWriter()
    srcs: List[Path] = []
    for url in urls:
        src = await download_file(url, ".pdf")
        srcs.append(src)
        writer.append(str(src))
    out_path, out_url = make_output(".pdf")
    try:
        with open(out_path, "wb") as f:
            writer.write(f)
        return {"download_url": out_url, "page_count": len(writer.pages)}
    finally:
        for s in srcs:
            s.unlink(missing_ok=True)


async def proc_pdf_split(
    url: str,
    ranges: Optional[str] = None,
    every: Optional[int] = None,
) -> Dict[str, Any]:
    from pypdf import PdfReader, PdfWriter
    src = await download_file(url, ".pdf")
    try:
        reader = PdfReader(str(src))
        n = len(reader.pages)

        if ranges:
            groups = [_parse_page_range(r, n) for r in ranges.split(",")]
        elif every:
            groups = [list(range(i, min(i + every, n))) for i in range(0, n, every)]
        else:
            groups = [[i] for i in range(n)]

        output_files: List[Dict[str, str]] = []
        for group in groups:
            writer = PdfWriter()
            for p in group:
                if 0 <= p < n:
                    writer.add_page(reader.pages[p])
            out_path, out_url = make_output(".pdf")
            with open(out_path, "wb") as f:
                writer.write(f)
            label = f"{group[0]+1}-{group[-1]+1}" if len(group) > 1 else str(group[0]+1)
            output_files.append({"download_url": out_url, "pages": label})
        return {"files": output_files}
    finally:
        src.unlink(missing_ok=True)


async def proc_pdf_rotate(
    url: str, angle: int, pages: Optional[str] = None
) -> Dict[str, Any]:
    from pypdf import PdfReader, PdfWriter
    src = await download_file(url, ".pdf")
    try:
        reader = PdfReader(str(src))
        writer = PdfWriter()
        n = len(reader.pages)
        rotate_set = set(_parse_page_range(pages, n)) if pages else set(range(n))
        for i, page in enumerate(reader.pages):
            if i in rotate_set:
                page.rotate(angle)
            writer.add_page(page)
        out_path, out_url = make_output(".pdf")
        with open(out_path, "wb") as f:
            writer.write(f)
        return {"download_url": out_url}
    finally:
        src.unlink(missing_ok=True)


async def proc_pdf_unlock(url: str, password: Optional[str] = None) -> Dict[str, Any]:
    import pikepdf
    src = await download_file(url, ".pdf")
    out_path, out_url = make_output(".pdf")
    try:
        with pikepdf.open(str(src), password=password or "") as pdf:
            pdf.save(str(out_path))
        return {"download_url": out_url}
    finally:
        src.unlink(missing_ok=True)


async def proc_pdf_to_image(
    url: str,
    dpi: int = 150,
    fmt: str = "png",
    pages: Optional[str] = None,
) -> Dict[str, Any]:
    from pdf2image import convert_from_path
    src = await download_file(url, ".pdf")
    try:
        first_page = last_page = None
        if pages:
            nums = _parse_page_range(pages, 9999)
            if nums:
                first_page = nums[0] + 1
                last_page = nums[-1] + 1
        pil_images = convert_from_path(
            str(src), dpi=dpi,
            first_page=first_page, last_page=last_page,
        )
        images: List[Dict[str, Any]] = []
        for i, img in enumerate(pil_images):
            out_path, out_url = make_output(f".{fmt}")
            img.save(str(out_path), format=fmt.upper().replace("JPG", "JPEG"))
            images.append({"page": (first_page or 1) + i, "download_url": out_url})
        return {"images": images}
    finally:
        src.unlink(missing_ok=True)


async def proc_html_to_pdf(
    url: Optional[str],
    html: Optional[str],
    page_size: str = "A4",
    margin: str = "20px",
    header_html: Optional[str] = None,
    footer_html: Optional[str] = None,
) -> Dict[str, Any]:
    import weasyprint
    out_path, out_url = make_output(".pdf")
    css = weasyprint.CSS(string=f"@page {{ size: {page_size}; margin: {margin}; }}")
    if url:
        doc = weasyprint.HTML(url=url)
    else:
        doc = weasyprint.HTML(string=html or "")
    doc.write_pdf(str(out_path), stylesheets=[css])
    return {"download_url": out_url, "page_count": 1}


async def proc_markdown_to_pdf(markdown: str, theme: str = "default") -> Dict[str, Any]:
    import markdown as md_lib
    import weasyprint
    html_body = md_lib.markdown(markdown, extensions=["tables", "fenced_code"])
    themes = {
        "github": (
            "body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.6}"
            "code{background:#f6f8fa;padding:2px 6px;border-radius:3px}"
            "pre{background:#f6f8fa;padding:16px;border-radius:6px;overflow:auto}"
            "h1,h2,h3{border-bottom:1px solid #eaecef;padding-bottom:.3em}"
        ),
        "minimal": "body{font-family:Georgia,serif;max-width:680px;margin:60px auto;font-size:18px;line-height:1.7}",
        "default": "body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.6}",
    }
    css_text = themes.get(theme, themes["default"])
    full_html = f"<html><head><style>{css_text}</style></head><body>{html_body}</body></html>"
    out_path, out_url = make_output(".pdf")
    weasyprint.HTML(string=full_html).write_pdf(str(out_path))
    return {"download_url": out_url, "page_count": 1}


# ── Image Operations ──────────────────────────────────────────────────────────

async def proc_image_resize(
    url: str,
    width: Optional[int],
    height: Optional[int],
    scale: Optional[float],
    fit: str = "contain",
) -> Dict[str, Any]:
    src = await download_file(url)
    try:
        img = Image.open(src)
        orig_w, orig_h = img.size
        suffix = Path(src.name).suffix or ".jpg"
        if scale:
            new_w, new_h = int(orig_w * scale), int(orig_h * scale)
        elif width and height:
            new_w, new_h = width, height
        elif width:
            new_w = width
            new_h = int(orig_h * (width / orig_w))
        elif height:
            new_h = height
            new_w = int(orig_w * (height / orig_h))
        else:
            new_w, new_h = orig_w, orig_h
        img = img.resize((new_w, new_h), Image.LANCZOS)
        out_path, out_url = make_output(suffix)
        img.save(str(out_path))
        return {"download_url": out_url, "width": new_w, "height": new_h}
    finally:
        src.unlink(missing_ok=True)


async def proc_image_compress(
    url: str, quality: int = 80, lossless: bool = False
) -> Dict[str, Any]:
    src = await download_file(url)
    try:
        img = Image.open(src)
        orig_size = src.stat().st_size
        suffix = Path(src.name).suffix or ".jpg"
        out_path, out_url = make_output(suffix)
        save_kwargs: Dict[str, Any] = {"quality": quality}
        if lossless:
            save_kwargs["lossless"] = True
        # Ensure RGB for JPEG
        fmt = suffix.lstrip(".").upper().replace("JPG", "JPEG")
        if fmt == "JPEG" and img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        img.save(str(out_path), format=fmt, **save_kwargs)
        out_size = out_path.stat().st_size
        return {
            "download_url": out_url,
            "original_size_bytes": orig_size,
            "compressed_size_bytes": out_size,
        }
    finally:
        src.unlink(missing_ok=True)


async def proc_image_convert(url: str, fmt: str) -> Dict[str, Any]:
    src = await download_file(url)
    try:
        img = Image.open(src)
        target = fmt.upper().replace("JPG", "JPEG")
        if target == "JPEG" and img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        ext = "jpg" if fmt.lower() == "jpg" else fmt.lower()
        out_path, out_url = make_output(f".{ext}")
        img.save(str(out_path), format=target)
        return {"download_url": out_url, "format": fmt.lower()}
    finally:
        src.unlink(missing_ok=True)


async def proc_image_crop(
    url: str,
    x: Optional[int],
    y: Optional[int],
    width: int,
    height: int,
    smart: bool = False,
) -> Dict[str, Any]:
    src = await download_file(url)
    try:
        img = Image.open(src)
        suffix = Path(src.name).suffix or ".jpg"
        if smart:
            img_w, img_h = img.size
            left = max(0, img_w // 2 - width // 2)
            top = max(0, img_h // 2 - height // 2)
        else:
            left = x or 0
            top = y or 0
        box = (left, top, left + width, top + height)
        img = img.crop(box)
        out_path, out_url = make_output(suffix)
        img.save(str(out_path))
        return {"download_url": out_url}
    finally:
        src.unlink(missing_ok=True)


async def proc_image_bg_remove(url: str) -> Dict[str, Any]:
    from rembg import remove
    src = await download_file(url)
    try:
        img = Image.open(src)
        result = remove(img)
        out_path, out_url = make_output(".png")
        result.save(str(out_path))
        return {"download_url": out_url}
    finally:
        src.unlink(missing_ok=True)


async def proc_image_upscale(url: str, scale: int = 2) -> Dict[str, Any]:
    src = await download_file(url)
    try:
        img = Image.open(src)
        orig_w, orig_h = img.size
        new_w, new_h = orig_w * scale, orig_h * scale
        img = img.resize((new_w, new_h), Image.LANCZOS)
        suffix = Path(src.name).suffix or ".jpg"
        out_path, out_url = make_output(suffix)
        img.save(str(out_path))
        return {"download_url": out_url, "width": new_w, "height": new_h}
    finally:
        src.unlink(missing_ok=True)


async def proc_image_watermark(
    url: str,
    text: Optional[str],
    watermark_url: Optional[str],
    position: str = "bottom-right",
    opacity: float = 0.5,
    rotation: int = 0,
) -> Dict[str, Any]:
    src = await download_file(url)
    try:
        img = Image.open(src).convert("RGBA")
        suffix = Path(src.name).suffix or ".png"
        overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        if text:
            font_size = max(img.width // 20, 16)
            try:
                font = ImageFont.truetype(
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size
                )
            except Exception:
                font = ImageFont.load_default()
            bbox = draw.textbbox((0, 0), text, font=font)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            pos_map = {
                "center": ((img.width - tw) // 2, (img.height - th) // 2),
                "top-left": (10, 10),
                "top-right": (img.width - tw - 10, 10),
                "bottom-left": (10, img.height - th - 10),
                "bottom-right": (img.width - tw - 10, img.height - th - 10),
            }
            px, py = pos_map.get(position, (10, 10))
            draw.text((px, py), text, font=font, fill=(255, 255, 255, int(opacity * 255)))

        elif watermark_url:
            wm_src = await download_file(watermark_url)
            wm = Image.open(wm_src).convert("RGBA")
            wm.putalpha(Image.fromarray(
                __import__("numpy").array(wm.split()[3]) * opacity, "L"  # type: ignore[misc]
            ))
            overlay.paste(wm, (0, 0), wm)
            wm_src.unlink(missing_ok=True)

        if rotation:
            overlay = overlay.rotate(rotation)
        img = Image.alpha_composite(img, overlay)
        if suffix.lower() in (".jpg", ".jpeg"):
            img = img.convert("RGB")
        out_path, out_url = make_output(suffix)
        img.save(str(out_path))
        return {"download_url": out_url}
    finally:
        src.unlink(missing_ok=True)


async def proc_image_rotate(
    url: str, angle: Optional[int], flip: Optional[str]
) -> Dict[str, Any]:
    src = await download_file(url)
    try:
        img = Image.open(src)
        suffix = Path(src.name).suffix or ".jpg"
        if flip == "horizontal":
            img = img.transpose(Image.FLIP_LEFT_RIGHT)
        elif flip == "vertical":
            img = img.transpose(Image.FLIP_TOP_BOTTOM)
        if angle:
            img = img.rotate(-angle, expand=True)  # PIL is CCW; callers expect CW
        out_path, out_url = make_output(suffix)
        img.save(str(out_path))
        return {"download_url": out_url}
    finally:
        src.unlink(missing_ok=True)


# ── Extraction ────────────────────────────────────────────────────────────────

async def proc_table_extract(
    url: str, fmt: str = "json", pages: Optional[str] = None
) -> Dict[str, Any]:
    import pdfplumber
    src = await download_file(url, ".pdf")
    try:
        all_tables: List[Dict[str, Any]] = []
        with pdfplumber.open(str(src)) as pdf:
            page_nums = (
                _parse_page_range(pages, len(pdf.pages)) if pages else list(range(len(pdf.pages)))
            )
            for i in page_nums:
                if i >= len(pdf.pages):
                    continue
                for tbl in pdf.pages[i].extract_tables() or []:
                    all_tables.append({"page": i + 1, "rows": tbl, "format": fmt})
        return {"tables": all_tables, "pages_processed": len(page_nums)}
    finally:
        src.unlink(missing_ok=True)


async def proc_ocr_image(
    url: str, lang: str = "eng", structured: bool = False
) -> Dict[str, Any]:
    import pytesseract
    src = await download_file(url)
    try:
        img = Image.open(src)
        if structured:
            data = pytesseract.image_to_data(
                img, lang=lang, output_type=pytesseract.Output.DICT
            )
            words = [
                {
                    "text": data["text"][i],
                    "confidence": data["conf"][i],
                    "bbox": {
                        "x": data["left"][i], "y": data["top"][i],
                        "w": data["width"][i], "h": data["height"][i],
                    },
                }
                for i in range(len(data["text"]))
                if str(data["text"][i]).strip()
            ]
            content = " ".join(str(t) for t in data["text"]).strip()
            confidence = sum(w["confidence"] for w in words) / max(len(words), 1)
            return {"content": content, "words": words, "confidence": round(confidence, 2)}
        else:
            content = pytesseract.image_to_string(img, lang=lang).strip()
            return {"content": content, "confidence": 0.85}
    finally:
        src.unlink(missing_ok=True)
