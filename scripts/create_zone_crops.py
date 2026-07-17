"""Create temporary panel images for the 18 marked map zones."""

from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

Image.MAX_IMAGE_PIXELS = None

SOURCE = Path("source-assets/map/Echoes 16K.jpg")
OUTPUT = Path("public/images/locations/zones")
OUTPUT_SIZE = (1200, 750)
SOURCE_CROP_SIZE = (3600, 2250)

ZONES = [
    ("zone-01", 0.429074, 0.035881),
    ("zone-02", 0.466589, 0.073323),
    ("zone-03", 0.588511, 0.074883),
    ("zone-04", 0.028136, 0.198128),
    ("zone-05", 0.226260, 0.252730),
    ("zone-06", 0.407972, 0.201248),
    ("zone-07", 0.703400, 0.237129),
    ("zone-08", 0.309496, 0.319813),
    ("zone-09", 0.502931, 0.305772),
    ("zone-10", 0.214537, 0.427457),
    ("zone-11", 0.321219, 0.485179),
    ("zone-12", 0.379836, 0.472699),
    ("zone-13", 0.567409, 0.446178),
    ("zone-14", 0.148886, 0.638066),
    ("zone-15", 0.440797, 0.606864),
    ("zone-16", 0.325909, 0.687988),
    ("zone-17", 0.406800, 0.723869),
    ("zone-18", 0.124267, 0.929797),
]


def bounded_crop_box(
    center_x: int, center_y: int, image_width: int, image_height: int
) -> tuple[int, int, int, int]:
    crop_width, crop_height = SOURCE_CROP_SIZE
    left = min(max(0, center_x - crop_width // 2), image_width - crop_width)
    top = min(max(0, center_y - crop_height // 2), image_height - crop_height)
    return left, top, left + crop_width, top + crop_height


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    OUTPUT.mkdir(parents=True, exist_ok=True)

    for zone_id, x, y in ZONES:
        center_x = round(x * image.width)
        center_y = round(y * image.height)
        crop = image.crop(
            bounded_crop_box(center_x, center_y, image.width, image.height)
        )
        crop = ImageOps.fit(crop, OUTPUT_SIZE, Image.Resampling.LANCZOS)
        crop = ImageEnhance.Contrast(crop).enhance(1.04)
        crop.save(OUTPUT / f"{zone_id}.webp", "WEBP", quality=86, method=6)
        print(f"Created {zone_id}.webp at ({x:.6f}, {y:.6f})", flush=True)


if __name__ == "__main__":
    main()
