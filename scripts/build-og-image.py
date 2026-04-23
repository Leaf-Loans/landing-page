#!/usr/bin/env python3
"""
Build the social preview (OG) image for Leaf Loans.
Renders a 1200x630 PNG to assets/img/og-image.png using Manrope + the
brand L mark cropped from the wordmark.

Run:  python3 scripts/build-og-image.py
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"
OUT = ROOT / "assets" / "img" / "og-image.png"

W, H = 1200, 630
INK = (12, 12, 12, 255)
WHITE = (255, 255, 255, 255)
DIM = (200, 204, 205, 255)
MUTE = (140, 148, 150, 255)
HAIRLINE = (255, 255, 255, 28)
GREEN_HI = (132, 188, 152, 255)

PAD_X = 72
PAD_Y = 72


def font(weight: str, size: int) -> ImageFont.FreeTypeFont:
    name = {
        "extrabold": "Manrope-ExtraBold.ttf",
        "semibold": "Manrope-SemiBold.ttf",
        "medium": "Manrope-Medium.ttf",
    }[weight]
    return ImageFont.truetype(str(FONTS / name), size)


def radial_glow(canvas: Image.Image, cx: int, cy: int, radius: int, color: tuple) -> None:
    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    steps = 60
    for i in range(steps, 0, -1):
        t = i / steps
        r = int(radius * t)
        alpha = int(color[3] * (1 - t) ** 2)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color[:3] + (alpha,))
    glow = glow.filter(ImageFilter.GaussianBlur(radius // 6))
    canvas.alpha_composite(glow)


def draw_l_mark(canvas: Image.Image, x: int, y: int, target_h: int) -> int:
    src = Image.open(ROOT / "assets" / "img" / "leafloans-wordmark.png").convert("RGBA")
    l_mark = src.crop((16, 0, 57, 79))
    lw, lh = l_mark.size
    new_size = (int(lw * target_h / lh), target_h)
    canvas.alpha_composite(l_mark.resize(new_size, Image.LANCZOS), dest=(x, y))
    return new_size[0]


def text_width(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> int:
    bbox = draw.textbbox((0, 0), text, font=fnt)
    return bbox[2] - bbox[0]


def draw_pill(draw: ImageDraw.ImageDraw, x: int, y: int, label: str, fnt: ImageFont.FreeTypeFont) -> int:
    pad_x, pad_y = 18, 10
    tw = text_width(draw, label, fnt)
    h = fnt.size + pad_y * 2
    w = tw + pad_x * 2
    draw.rounded_rectangle((x, y, x + w, y + h), radius=h // 2, fill=(255, 255, 255, 14), outline=HAIRLINE, width=1)
    draw.text((x + pad_x, y + pad_y - 2), label, font=fnt, fill=DIM)
    return w


def main() -> None:
    canvas = Image.new("RGBA", (W, H), INK)

    # Layered ambient glows
    radial_glow(canvas, cx=140, cy=H + 80, radius=720, color=(62, 122, 88, 110))
    radial_glow(canvas, cx=W + 100, cy=-80, radius=680, color=(120, 39, 207, 90))

    # Subtle vertical hairlines for "infrastructure" feel
    grid = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grid)
    for i in range(1, 5):
        gx = int(W * i / 5)
        gdraw.line((gx, 0, gx, H), fill=(255, 255, 255, 8), width=1)
    canvas.alpha_composite(grid)

    draw = ImageDraw.Draw(canvas)

    # ── Top: brand lockup ───────────────────────────────
    mark_h = 56
    mark_y = PAD_Y
    mark_w = draw_l_mark(canvas, PAD_X, mark_y, mark_h)

    wordmark_font = font("extrabold", 38)
    wm_x = PAD_X + mark_w + 16
    wm_y = mark_y + (mark_h - wordmark_font.size) // 2 - 2
    draw.text((wm_x, wm_y), "leafloans", font=wordmark_font, fill=WHITE)

    # Top-right meta
    meta_font = font("medium", 18)
    meta_text = "leafloans.ai"
    mt_w = text_width(draw, meta_text, meta_font)
    draw.text((W - PAD_X - mt_w, mark_y + (mark_h - meta_font.size) // 2 - 2), meta_text, font=meta_font, fill=MUTE)

    # ── Eyebrow ─────────────────────────────────────────
    eyebrow = font("semibold", 18)
    eb_y = 220
    dot_r = 5
    draw.ellipse((PAD_X, eb_y + 7, PAD_X + dot_r * 2, eb_y + 7 + dot_r * 2), fill=GREEN_HI)
    draw.text((PAD_X + dot_r * 2 + 12, eb_y), "LENDING OS", font=eyebrow, fill=GREEN_HI)
    eb_w = text_width(draw, "LENDING OS", eyebrow)
    draw.text((PAD_X + dot_r * 2 + 12 + eb_w + 18, eb_y), "·  Pre-integrated. Live now.", font=eyebrow, fill=MUTE)

    # ── Headline (last word accented) ───────────────────
    headline_font = font("extrabold", 76)
    line_h = 88
    hy = 270

    # Line 1
    draw.text((PAD_X, hy), "AI-native infrastructure", font=headline_font, fill=WHITE)
    # Line 2 — split: "for India's B2B " white + "economy." green
    line2_prefix = "for India's B2B "
    line2_accent = "economy."
    draw.text((PAD_X, hy + line_h), line2_prefix, font=headline_font, fill=WHITE)
    prefix_w = text_width(draw, line2_prefix, headline_font)
    draw.text((PAD_X + prefix_w, hy + line_h), line2_accent, font=headline_font, fill=GREEN_HI)

    # ── Bottom: platform pills ──────────────────────────
    pill_font = font("medium", 20)
    pill_y = H - PAD_Y - 50
    px = PAD_X
    for label in ["GEM", "TReDS", "Marketplaces", "Supply Chains"]:
        px += draw_pill(draw, px, pill_y, label, pill_font) + 12

    # ── Bottom-right byline ─────────────────────────────
    byline_font = font("medium", 18)
    bl = "Modern credit infrastructure"
    bw = text_width(draw, bl, byline_font)
    draw.text((W - PAD_X - bw, pill_y + 14), bl, font=byline_font, fill=DIM)

    # Top-left mini accent rule
    draw.line((PAD_X, mark_y + mark_h + 24, PAD_X + 80, mark_y + mark_h + 24), fill=GREEN_HI, width=2)

    canvas.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)}  ({W}x{H})")


if __name__ == "__main__":
    main()
