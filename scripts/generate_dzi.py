"""Create an OpenSeadragon-compatible Deep Zoom pyramid from a source image.

Usage: python scripts/generate_dzi.py input.png public/map/world-map
Requires Pillow. The output is world-map.dzi plus world-map_files/.
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image

# This project intentionally processes trusted, very large cartographic sources.
Image.MAX_IMAGE_PIXELS = None


def build_pyramid(source: Path, output_stem: Path, tile_size: int, overlap: int) -> None:
    image = Image.open(source).convert("RGB")
    width, height = image.size
    max_level = math.ceil(math.log2(max(width, height)))
    tiles_root = output_stem.parent / f"{output_stem.name}_files"

    for level in range(max_level + 1):
        scale = 2 ** (max_level - level)
        level_width = max(1, math.ceil(width / scale))
        level_height = max(1, math.ceil(height / scale))
        level_image = (
            image
            if scale == 1
            else image.resize((level_width, level_height), Image.Resampling.LANCZOS)
        )
        level_dir = tiles_root / str(level)
        level_dir.mkdir(parents=True, exist_ok=True)
        columns = math.ceil(level_width / tile_size)
        rows = math.ceil(level_height / tile_size)
        print(
            f"Level {level}/{max_level}: {level_width}x{level_height}, "
            f"{columns * rows} tiles",
            flush=True,
        )

        for row in range(rows):
            for column in range(columns):
                left = max(0, column * tile_size - (overlap if column else 0))
                top = max(0, row * tile_size - (overlap if row else 0))
                right = min(
                    level_width,
                    (column + 1) * tile_size
                    + (overlap if column < columns - 1 else 0),
                )
                bottom = min(
                    level_height,
                    (row + 1) * tile_size + (overlap if row < rows - 1 else 0),
                )
                tile = level_image.crop((left, top, right, bottom))
                tile.save(
                    level_dir / f"{column}_{row}.jpg",
                    "JPEG",
                    quality=86,
                    optimize=True,
                )

    descriptor = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<Image xmlns="http://schemas.microsoft.com/deepzoom/2008" '
        f'Format="jpg" Overlap="{overlap}" TileSize="{tile_size}">'
        f'<Size Width="{width}" Height="{height}"/></Image>\n'
    )
    output_stem.with_suffix(".dzi").write_text(descriptor, encoding="utf-8")
    print(f"Created {width}x{height} DZI pyramid with levels 0–{max_level}.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output_stem", type=Path)
    parser.add_argument("--tile-size", type=int, default=256)
    parser.add_argument("--overlap", type=int, default=1)
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_args()
    build_pyramid(
        arguments.source,
        arguments.output_stem,
        arguments.tile_size,
        arguments.overlap,
    )
