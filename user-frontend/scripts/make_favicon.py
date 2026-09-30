"""Generate crisp Food24KH favicons — white bag + gold base on navy."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(r"e:\PROJECT_STANDARD_2026\Food24KH\user-frontend")
NAVY = (0, 0, 139, 255)
GOLD = (255, 184, 28, 255)
WHITE = (255, 255, 255, 255)


def draw_mark(size: int) -> Image.Image:
    hi = min(1024, max(size * 8, 512))
    img = Image.new("RGBA", (hi, hi), NAVY)
    d = ImageDraw.Draw(img)
    u = hi / 64.0

    def box(x0, y0, x1, y1):
        return [x0 * u, y0 * u, x1 * u, y1 * u]

    bag_r = max(2, int(5 * u))
    stroke = max(2, int(round(6 * u)))

    # White bag body
    d.rounded_rectangle(box(15, 27, 49, 49), radius=bag_r, fill=WHITE)

    # Gold base drawn into lower third, then restore rounded bottom corners
    gold_layer = Image.new("RGBA", (hi, hi), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gold_layer)
    gd.rectangle(box(15, 41, 49, 49), fill=GOLD)
    bag_mask = Image.new("L", (hi, hi), 0)
    ImageDraw.Draw(bag_mask).rounded_rectangle(box(15, 27, 49, 49), radius=bag_r, fill=255)
    # Keep only gold where bag mask is set AND y is in lower band
    gp = gold_layer.load()
    mp = bag_mask.load()
    for y in range(hi):
        for x in range(hi):
            if mp[x, y] == 0:
                gp[x, y] = (0, 0, 0, 0)
    img = Image.alpha_composite(img, gold_layer)

    # Handle on top
    d = ImageDraw.Draw(img)
    d.arc(box(21, 10, 51, 40), start=200, end=340, fill=WHITE, width=stroke)

    return img.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    targets = {
        16: ROOT / "public" / "favicon-16x16.png",
        32: ROOT / "public" / "favicon-32x32.png",
        48: ROOT / "public" / "brand" / "favicon-48.png",
        64: ROOT / "public" / "brand" / "favicon-64.png",
        180: ROOT / "public" / "brand" / "favicon-180.png",
        512: ROOT / "public" / "brand" / "favicon-512.png",
    }
    made: dict[int, Image.Image] = {}
    for sz, path in targets.items():
        im = draw_mark(sz)
        made[sz] = im
        im.save(path, format="PNG", optimize=True)
        print("wrote", path.relative_to(ROOT), "center=", im.getpixel((sz // 2, sz // 2)))

    made[32].save(ROOT / "public" / "brand" / "favicon-32.png")
    made[32].save(ROOT / "public" / "favicon.png")
    made[512].save(ROOT / "public" / "brand" / "app-icon.png")
    made[180].save(ROOT / "app" / "apple-icon.png")

    png_icon = ROOT / "app" / "icon.png"
    if png_icon.exists():
        png_icon.unlink()

    svg_src = ROOT / "app" / "icon.svg"
    (ROOT / "public" / "icon.svg").write_text(svg_src.read_text(encoding="utf-8"), encoding="utf-8")

    ico = [made[16], made[32], made[48]]
    for dest in (ROOT / "app" / "favicon.ico", ROOT / "public" / "favicon.ico"):
        ico[0].save(
            dest,
            format="ICO",
            sizes=[(16, 16), (32, 32), (48, 48)],
            append_images=ico[1:],
        )
        print("wrote", dest.relative_to(ROOT))

    made[512].resize((128, 128), Image.Resampling.LANCZOS).save(
        ROOT / "public" / "brand" / "_favicon-preview.png"
    )
    print("done")


if __name__ == "__main__":
    main()
