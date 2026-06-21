import fitz
from pathlib import Path
from PIL import Image
import io

src = Path("AI-Tamada-Neuro-Fusion.pdf")
dst = Path("AI-Tamada-Neuro-Fusion_compressed.pdf")

dpi = 150
quality = 65

doc = fitz.open(src)
out_pdf = fitz.open()

for i, page in enumerate(doc):
    print("Processing page", i + 1)

    pix = page.get_pixmap(
        matrix=fitz.Matrix(dpi / 72, dpi / 72),
        alpha=False
    )

    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")

    jpg_bytes = io.BytesIO()
    img.save(jpg_bytes, format="JPEG", quality=quality, optimize=True)
    jpg_bytes.seek(0)

    rect = fitz.Rect(0, 0, page.rect.width, page.rect.height)
    new_page = out_pdf.new_page(width=page.rect.width, height=page.rect.height)
    new_page.insert_image(rect, stream=jpg_bytes.read())

out_pdf.save(dst, deflate=True, garbage=4, clean=True)
out_pdf.close()
doc.close()

print("Done:", dst)
print("DPI:", dpi)
print("JPEG quality:", quality)
