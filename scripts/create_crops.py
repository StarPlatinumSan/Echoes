"""Create responsive lore artwork crops from the original project map."""

from pathlib import Path

from PIL import Image, ImageOps


SOURCE = Path("public/assets/world-map-source.png")
CROPS = {
    "glass-archive.webp": (0.18, 0.14, 0.47, 0.61),
    "bell-foundry.webp": (0.44, 0.34, 0.76, 0.82),
    "meridian-station.webp": (0.60, 0.06, 0.94, 0.52),
    "story-salt-memory.webp": (0.03, 0.41, 0.40, 0.92),
    "story-last-bell.webp": (0.35, 0.15, 0.68, 0.63),
    "story-night-index.webp": (0.57, 0.36, 0.98, 0.92),
}


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    width, height = image.size
    image.save(SOURCE.with_suffix(".webp"), "WEBP", quality=90, method=6)

    for filename, (x1, y1, x2, y2) in CROPS.items():
        crop = image.crop(
            (int(x1 * width), int(y1 * height), int(x2 * width), int(y2 * height))
        )
        fitted = ImageOps.fit(
            crop, (1200, 750), method=Image.Resampling.LANCZOS
        )
        fitted.save(SOURCE.parent / filename, "WEBP", quality=88, method=6)


if __name__ == "__main__":
    main()
