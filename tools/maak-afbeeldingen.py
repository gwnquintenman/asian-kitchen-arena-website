"""Maakt de webafbeeldingen in src/images uit de originelen in bron/foto-origineel.

Alleen nodig als je een foto vervangt of toevoegt. Vereist Python 3 met Pillow:
    python tools/maak-afbeeldingen.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "bron" / "foto-origineel"
OUT = ROOT / "src" / "images"
OUT.mkdir(parents=True, exist_ok=True)

INK = (20, 20, 20)
RED = (207, 10, 16)


def trim(im):
    """Snijd transparante randen weg."""
    box = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    return im.crop(box) if box else im


def fit(im, longest):
    im = im.copy()
    im.thumbnail((longest, longest), Image.LANCZOS)
    return im


def save_webp(im, name, quality=82):
    path = OUT / name
    im.save(path, "WEBP", quality=quality, method=6)
    print(f"{name:32} {im.size[0]}x{im.size[1]}  {path.stat().st_size // 1024} kB")


# Gerechtfoto's uit de menukaart-pdf (vrijstaand, transparant)
dishes = {
    "nr-11.webp": "pdf-nr11-siu-mai.png",
    "nr-13.webp": "pdf-nr13-loempias.png",
    "nr-14.webp": "pdf-nr14-krokante-garnalen.png",
    "nr-22.webp": "pdf-nr22-kip-szechuan.png",
    "nr-39.webp": "pdf-nr39-nasi-groenten.png",
    "nr-40.webp": "pdf-nr40-noedels-groenten.png",
}
for out, src in dishes.items():
    im = trim(Image.open(SRC / src).convert("RGBA"))
    save_webp(fit(im, 360), out)

# Logo: origineel uit de pdf is rood + wit (voor donkere achtergrond).
logo = trim(Image.open(SRC / "pdf-logo.png").convert("RGBA"))


def recolor(im, white_to=None, red_to=None):
    px = im.load()
    out = im.copy()
    po = out.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            is_white = g > 120 and b > 120
            if is_white and white_to:
                po[x, y] = (*white_to, a)
            elif not is_white and red_to:
                po[x, y] = (*red_to, a)
    return out


logo_light = recolor(logo, white_to=INK)          # rood + zwart, voor witte achtergrond
logo_dark = logo                                   # rood + wit, voor zwarte achtergrond
for name, im in (("logo-licht", logo_light), ("logo-donker", logo_dark)):
    sized = fit(im, 360)
    sized.save(OUT / f"{name}.png", optimize=True)
    print(f"{name}.png {sized.size}")

# Favicon: het teken 名 uit het logo, wit op rood
w, h = logo.size
glyph = logo.crop((int(w * 0.55), 0, w, int(h * 0.42)))
glyph = trim(recolor(glyph, red_to=None))
alpha = glyph.getchannel("A")
white_glyph = Image.new("RGBA", glyph.size, (255, 255, 255, 0))
white_glyph.putalpha(alpha.point(lambda a: a if a > 0 else 0))
# alleen de witte pixels van het teken houden
gpx = glyph.load()
wpx = white_glyph.load()
for y in range(glyph.size[1]):
    for x in range(glyph.size[0]):
        r, g, b, a = gpx[x, y]
        wpx[x, y] = (255, 255, 255, a if (g > 120 and b > 120) else 0)
white_glyph = trim(white_glyph)

for size, name in ((512, "icon-512.png"), (180, "apple-touch-icon.png"), (48, "favicon-48.png")):
    tile = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(tile)
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * 0.18), fill=(*RED, 255))
    g = fit(white_glyph, int(size * 0.74))
    tile.alpha_composite(g, ((size - g.size[0]) // 2, (size - g.size[1]) // 2))
    if name == "apple-touch-icon.png":  # iOS wil geen transparantie
        bg = Image.new("RGBA", (size, size), (*RED, 255))
        bg.alpha_composite(tile)
        tile = bg
    tile.save(OUT / name, optimize=True)
    print(name, tile.size)

# Hoofdfoto: de rode Asian Kitchen-afhaalbox van de oude website
box = Image.open(SRC / "oude-site-afhaalbox.jpg").convert("RGB").crop((745, 40, 1535, 800))
for width, name in ((760, "afhaalbox-760.webp"), (440, "afhaalbox-440.webp")):
    im = box.copy()
    im.thumbnail((width, width * 2), Image.LANCZOS)
    save_webp(im, name, quality=80)

# Deelafbeelding (WhatsApp, Facebook): 1200x630
og = Image.new("RGB", (1200, 630), (255, 255, 255))
b = box.copy()
b.thumbnail((620, 600), Image.LANCZOS)
og.paste(b, (1200 - b.size[0] - 40, (630 - b.size[1]) // 2))
lg = fit(logo_light, 470)
og.paste(lg, (70, (630 - lg.size[1]) // 2), lg)
ImageDraw.Draw(og).rectangle((0, 0, 1199, 13), fill=RED)
og.save(OUT / "deelafbeelding.jpg", quality=85, optimize=True)
print("deelafbeelding.jpg", og.size)
