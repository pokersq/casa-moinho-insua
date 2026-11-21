"""Reduz as fotos em fotos/ que sejam demasiado grandes para a web.

Corre no GitHub Actions sempre que uma foto é adicionada (ex.: pelo Pages CMS).
Fotos com mais de MAX_SIDE píxeis ou mais de MAX_BYTES são redimensionadas e
recomprimidas no mesmo ficheiro; as restantes ficam intactas.
"""
from pathlib import Path

from PIL import Image, ImageOps

MAX_SIDE = 1920
MAX_BYTES = 600 * 1024
JPEG_QUALITY = 82
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def optimize(path: Path) -> bool:
    size_before = path.stat().st_size
    with Image.open(path) as img:
        if max(img.size) <= MAX_SIDE and size_before <= MAX_BYTES:
            return False
        fmt = img.format
        # Fotos do telemóvel guardam a rotação no EXIF; aplicá-la antes de a remover
        img = ImageOps.exif_transpose(img)
        img.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        if fmt == "JPEG":
            img.convert("RGB").save(path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        elif fmt == "WEBP":
            img.save(path, "WEBP", quality=JPEG_QUALITY)
        else:
            img.save(path, fmt, optimize=True)
    print(f"{path}: {size_before // 1024} KB -> {path.stat().st_size // 1024} KB")
    return True


def main() -> None:
    changed = [p for p in sorted(Path("fotos").rglob("*")) if p.suffix.lower() in EXTENSIONS and optimize(p)]
    print(f"{len(changed)} foto(s) otimizada(s).")


if __name__ == "__main__":
    main()
