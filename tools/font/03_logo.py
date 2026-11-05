"""Make transparent logo SVGs from logo/saneee.in.svg, which has its letters cut out of a page rectangle.

Run: python tools/font/03_logo.py <logo/saneee.in.svg> <output dir>
"""
import pathlib
import re
import sys

src, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
paths = [" ".join(d.split()) for d in re.findall(r'<path d="([^"]+)"', src.read_text())]

# The first subpath is the page rectangle. Removing it leaves the following relative
# move starting from the rectangle's origin, so that origin stays as a bare move.
first = paths[0]
origin = re.match(r"M\s*(-?[\d.]+)\s+(-?[\d.]+)", first)
paths[0] = f"M{origin[1]} {origin[2]} " + first[first.lower().index("z") + 1:].strip()

for name, colour in (("logo-white", "#fff"), ("logo-black", "#080808")):
    (out / f"{name}.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 405 864 190">'
        f'<path fill="{colour}" fill-rule="evenodd" transform="translate(0 1024) scale(.1 -.1)" d="{" ".join(paths)}"/></svg>\n'
    )
print("wrote", out)
