import pikepdf
from pathlib import Path

src = Path("AI-Tamada-Neuro-Fusion.pdf")
dst = Path("AI-Tamada-Neuro-Fusion_compressed.pdf")

with pikepdf.open(src) as pdf:
    pdf.save(
        dst,
        compress_streams=True,
        object_stream_mode=pikepdf.ObjectStreamMode.generate
    )

print("Done:", dst)
