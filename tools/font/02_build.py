"""Build Saneee Brand (one weight) from logo/type.png and logo/saneee.in.svg.

Letters and digits are traced from the specimen, then straightened and snapped to
metric lines. The dot comes from the logo; other punctuation is drawn here.

Needs: opencv, numpy, fonttools, brotli, potracer (`pip install potracer`).
Run:   python tools/font/02_build.py <logo dir> <output dir> [potracer lib dir]
"""
import pathlib
import re
import sys

import cv2
import numpy as np
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.svgLib.path import parse_path
from fontTools.ttLib import TTFont

if len(sys.argv) > 3:
    sys.path.append(sys.argv[3])
import potrace  # noqa: E402

UPM = 1000
CAP = 700
XH = 595
SIDE = 42  # default sidebearing
UP = 10  # specimen upscale before tracing
SNAP = 16  # units within which a point joins a metric line

# (characters, band top, band bottom, baseline in image, source cap or x height in px, target height)
ROWS = [
    ("ABCDEFGHIJKLMN", 440, 530, 520, 63.5, CAP),
    ("OPQRSTUVWXYZ", 540, 630, 614, 61.5, CAP),
    ("abcdefghijklmn", 680, 795, 769, 54.0, XH),
    ("opqrstuvwxyz", 795, 895, 863, 54.0, XH),
    ("0123456789", 950, 1045, 1032, 68.0, CAP),
]
MERGE_PARTS = {"abcdefghijklmn": [(7, 8)]}  # the h traces as stem + arch
TIGHT = {  # diagonal or open sides sit closer; (left, right)
    "A": (8, 8), "V": (8, 8), "W": (8, 8), "Y": (8, 8), "T": (20, 20), "X": (12, 12), "Z": (28, 28),
    "L": (SIDE, 8), "K": (SIDE, 8), "v": (8, 8), "w": (8, 8), "y": (8, 8), "x": (12, 12), "z": (28, 28),
    "k": (SIDE, 8), "f": (24, 8), "t": (16, 16), "r": (SIDE, 10), "j": (4, SIDE), "1": (30, 30), "7": (20, 16),
}


def coverage(bgr):
    """0..1 ink per pixel. Keeps antialiasing so the upscale stays smooth."""
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    dark = np.clip((190 - bgr.max(axis=2).astype(np.float32)) / 160, 0, 1)
    green = np.clip((hsv[..., 1] - 60) / 110, 0, 1) * (hsv[..., 2] > 110)
    return np.maximum(dark, green)


def find_boxes(cov, chars, top, bottom):
    band = (cov[top:bottom] > 0.5).astype(np.uint8)
    n, _, stats, _ = cv2.connectedComponentsWithStats(band, connectivity=8)
    parts = sorted((list(stats[i][:4]) for i in range(1, n) if stats[i][4] > 25), key=lambda s: s[0])
    merged = []
    for x, y, w, h in parts:
        if merged and x < merged[-1][0] + merged[-1][2] - 2:
            m = merged[-1]
            x2, y1, y2 = max(m[0] + m[2], x + w), min(m[1], y), max(m[1] + m[3], y + h)
            merged[-1] = [m[0], y1, x2 - m[0], y2 - y1]
        else:
            merged.append([x, y, w, h])
    for a, b in reversed(MERGE_PARTS.get(chars, [])):
        m, o = merged[a], merged[b]
        x2, y1, y2 = max(m[0] + m[2], o[0] + o[2]), min(m[1], o[1]), max(m[1] + m[3], o[1] + o[3])
        merged[a] = [m[0], y1, x2 - m[0], y2 - y1]
        del merged[b]
    assert len(merged) == len(chars), (chars, len(merged))
    return merged


def trace_bitmap(mask, alphamax=0.9, opt=0.6):
    """Returns contours as lists of ('L', p) / ('C', c1, c2, p), in mask pixel coordinates."""
    # potracer treats False as ink, so the mask goes in inverted.
    path = potrace.Bitmap(~mask).trace(turdsize=30, alphamax=alphamax, opticurve=True, opttolerance=opt)
    contours = []
    for curve in path:
        sp = curve.start_point
        ops = [("M", (sp.x, sp.y))]
        for s in curve.segments:
            if s.is_corner:
                ops.append(("L", (s.c.x, s.c.y)))
                ops.append(("L", (s.end_point.x, s.end_point.y)))
            else:
                ops.append(("C", (s.c1.x, s.c1.y), (s.c2.x, s.c2.y), (s.end_point.x, s.end_point.y)))
        contours.append(ops)
    return contours


def map_points(contours, fn):
    return [[(op[0], *[fn(p) for p in op[1:]]) for op in c] for c in contours]


def straighten(contours, tol=9):
    """Near-horizontal and near-vertical straight runs become exact. Most of the tidy look comes from this."""
    out = []
    for c in contours:
        pts = [list(op[-1]) for op in c]
        n = len(pts)
        for i in range(n):
            if c[(i + 1) % n][0] == "C":
                continue
            a, b = pts[i], pts[(i + 1) % n]
            dx, dy = abs(a[0] - b[0]), abs(a[1] - b[1])
            if dy < tol and dx > 3 * max(dy, 1):
                a[1] = b[1] = (a[1] + b[1]) / 2
            elif dx < tol and dy > 3 * max(dx, 1):
                a[0] = b[0] = (a[0] + b[0]) / 2
        new = []
        for i, op in enumerate(c):
            if op[0] == "C":
                prev = pts[i - 1]
                # Bezier handles move with the anchors they belong to.
                old_prev = c[i - 1][-1]
                d1 = (prev[0] - old_prev[0], prev[1] - old_prev[1])
                d2 = (pts[i][0] - op[3][0], pts[i][1] - op[3][1])
                new.append(("C", (op[1][0] + d1[0], op[1][1] + d1[1]), (op[2][0] + d2[0], op[2][1] + d2[1]), tuple(pts[i])))
            else:
                new.append((op[0], tuple(pts[i])))
        out.append(new)
    return out


def snap_lines(contours, lines):
    def snap(p):
        for line in lines:
            if abs(p[1] - line) < SNAP:
                return (p[0], line)
        return p

    out = []
    for c in contours:
        new = []
        for i, op in enumerate(c):
            if op[0] == "C":
                old_prev, end = c[i - 1][-1], op[3]
                sp, se = snap(old_prev), snap(end)
                new.append(("C", (op[1][0], op[1][1] + sp[1] - old_prev[1]), (op[2][0], op[2][1] + se[1] - end[1]), se))
            else:
                new.append((op[0], snap(op[1])))
        out.append(new)
    return out


def bounds(contours):
    pts = [p for c in contours for op in c for p in op[1:]]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def flatten(contour):
    pts = []
    cur = None
    for op in contour:
        if op[0] == "C":
            for t in np.linspace(0, 1, 9)[1:]:
                u = 1 - t
                pts.append((u**3 * cur[0] + 3 * u * u * t * op[1][0] + 3 * u * t * t * op[2][0] + t**3 * op[3][0],
                            u**3 * cur[1] + 3 * u * u * t * op[1][1] + 3 * u * t * t * op[2][1] + t**3 * op[3][1]))
            cur = op[3]
        else:
            cur = op[1]
            pts.append(cur)
    return np.array(pts, dtype=np.float32)


def area(poly):
    x, y = poly[:, 0], poly[:, 1]
    return 0.5 * float(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))


def reverse(contour):
    pts = [op[-1] for op in contour]
    new = [("M", pts[-1])]
    for i in range(len(contour) - 1, 0, -1):
        op = contour[i]
        new.append(("C", op[2], op[1], pts[i - 1]) if op[0] == "C" else ("L", pts[i - 1]))
    return new


def fix_winding(contours):
    """CFF fill is non-zero: outers counter-clockwise, counters clockwise."""
    polys = [flatten(c) for c in contours]
    out = []
    for i, c in enumerate(contours):
        depth = sum(cv2.pointPolygonTest(polys[j], tuple(map(float, polys[i][0])), False) > 0
                    for j in range(len(contours)) if j != i)
        ccw = area(polys[i]) > 0
        out.append(c if (depth % 2 == 0) == ccw else reverse(c))
    return out


def logo_glyphs(logo_svg):
    """Letter contours from the logo, keyed by reading position. Y is already up in its path units."""
    svg = pathlib.Path(logo_svg).read_text()
    contours = []
    for d in re.findall(r'<path d="([^"]+)"', svg):
        pen = RecordingPen()
        parse_path(d.replace("\n", " "), pen)
        cur = []
        for name, args in pen.value:
            if name == "moveTo":
                cur = [("M", args[0])]
            elif name == "lineTo":
                cur.append(("L", args[0]))
            elif name == "curveTo":
                cur.append(("C", *args))
            elif name in ("closePath", "endPath"):
                contours.append(cur)
    contours = [c for c in contours if bounds([c])[2] - bounds([c])[0] < 9000]  # drop the page rectangle
    # Parts mostly stacked over each other are one letter (counters, the i arrow).
    # Neighbours only touch at the edges: the logo's s and a overlap slightly.
    contours.sort(key=lambda c: bounds([c])[0])
    letters = []
    for c in contours:
        x0, _, x1, _ = bounds([c])
        if letters:
            overlap = letters[-1]["x1"] - x0
            if overlap > 0.5 * min(x1 - x0, letters[-1]["x1"] - letters[-1]["x0"]):
                letters[-1]["c"].append(c)
                letters[-1]["x1"] = max(letters[-1]["x1"], x1)
                continue
        letters.append({"c": [c], "x0": x0, "x1": x1})
    return [g["c"] for g in letters]


def build_from_logo(logo_svg):
    letters = logo_glyphs(logo_svg)
    order = "saneee.in"
    print("logo letters found:", len(letters), [round(bounds(c)[0]) for c in letters])
    assert len(letters) >= len(order), len(letters)  # anything after the n is the registered mark
    base = bounds(letters[2])[1]
    height = bounds(letters[2])[3] - base  # the n sets x-height
    k = XH / height
    out = {}
    for ch, c in zip(order, letters):
        if ch not in out:
            out[ch] = map_points(c, lambda p: (p[0] * k, (p[1] - base) * k))
    return out


# Hand-drawn punctuation: centrelines in font units, stroked at this weight, then traced like the rest.
STEM = 170


def draw_mark(polys, dots=(), width=None, stem=STEM, ascent=900, descent=300):
    """Rasterise strokes and dots at 2px per unit, returning traced contours in font units."""
    scale = 2
    w = int((width or 800) * scale)
    h = (ascent + descent) * scale
    img = np.zeros((h, w), np.uint8)
    to_px = lambda p: (int(p[0] * scale), int((ascent - p[1]) * scale))
    for poly in polys:
        pts = [to_px(p) for p in poly]
        for a, b in zip(pts, pts[1:]):
            cv2.line(img, a, b, 255, int(stem * scale), cv2.LINE_AA)
    for (x, y, r) in dots:
        cv2.circle(img, to_px((x, y)), int(r * scale), 255, -1, cv2.LINE_AA)
    contours = trace_bitmap(img > 127, alphamax=1.0, opt=0.8)
    return map_points(contours, lambda p: (p[0] / scale, ascent - p[1] / scale))


MARKS = {
    ",": ([[(90, 70), (40, -130)]], [(90, 90, 95)], 200, 150),
    ":": ([], [(100, 95, 95), (100, 500, 95)], 200, STEM),
    ";": ([[(100, 70), (50, -130)]], [(100, 95, 95), (100, 500, 95)], 210, 150),
    "!": ([[(110, 700), (110, 290)]], [(110, 95, 95)], 220, STEM),
    "?": ([[(70, 640), (340, 640), (400, 580), (400, 470), (340, 410), (225, 410), (225, 280)]], [(225, 95, 95)], 480, 150),
    "'": ([[(70, 700), (70, 490)]], [], 140, 110),
    "’": ([[(90, 720), (50, 500)]], [], 140, 110),
    "‘": ([[(50, 720), (90, 500)]], [], 140, 110),
    '"': ([[(70, 700), (70, 490)], [(230, 700), (230, 490)]], [], 300, 110),
    "“": ([[(50, 720), (90, 500)], [(210, 720), (250, 500)]], [], 300, 110),
    "”": ([[(90, 720), (50, 500)], [(250, 720), (210, 500)]], [], 300, 110),
    "-": ([[(40, 300), (340, 300)]], [], 380, 130),
    "–": ([[(40, 300), (480, 300)]], [], 520, 130),
    "—": ([[(40, 300), (760, 300)]], [], 800, 130),
    "/": ([[(60, -40), (400, 740)]], [], 460, 140),
    "(": ([[(220, 760), (110, 640), (110, 60), (220, -60)]], [], 260, 130),
    ")": ([[(40, 760), (150, 640), (150, 60), (40, -60)]], [], 260, 130),
    "+": ([[(40, 300), (480, 300)], [(260, 80), (260, 520)]], [], 520, 130),
    "&": ([[(560, 70), (200, 500), (200, 620), (260, 670), (370, 670), (430, 620), (430, 520), (120, 300), (120, 130), (190, 70), (370, 70), (560, 300)]], [], 640, 130),
    "%": ([[(120, 640), (120, 520), (250, 520), (250, 640), (120, 640)], [(470, 180), (470, 60), (600, 60), (600, 180), (470, 180)], [(130, 0), (590, 700)]], [], 720, 90),
    "#": ([[(180, 690), (120, 10)], [(440, 690), (380, 10)], [(50, 480), (510, 480)], [(40, 220), (500, 220)]], [], 560, 90),
    "@": ([[(560, 150), (620, 200), (680, 240), (680, 560), (580, 660), (200, 660), (90, 560), (90, 150), (200, 40), (560, 40)],
           [(500, 180), (280, 180), (230, 240), (230, 400), (300, 470), (500, 470), (500, 180)]], [], 780, 90),
    "→": ([[(50, 300), (560, 300)], [(360, 520), (580, 300), (360, 80)]], [], 650, 110),
    "↗": ([[(90, 90), (480, 480)], [(180, 560), (560, 560), (560, 180)]], [], 640, 110),
    "←": ([[(610, 300), (100, 300)], [(300, 520), (80, 300), (300, 80)]], [], 650, 110),
}


def to_charstring(contours, width):
    pen = T2CharStringPen(width, None)
    for c in contours:
        for op in c:
            if op[0] == "M":
                pen.moveTo(op[1])
            elif op[0] == "L":
                pen.lineTo(op[1])
            else:
                pen.curveTo(op[1], op[2], op[3])
        pen.closePath()
    return pen.getCharString()


def place(contours, left, right):
    x0, _, x1, _ = bounds(contours)
    moved = map_points(contours, lambda p: (round(p[0] - x0 + left), round(p[1])))
    return moved, round(x1 - x0 + left + right)


def main(logo_dir, out_dir):
    logo_dir, out_dir = pathlib.Path(logo_dir), pathlib.Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    bgr = cv2.imread(str(logo_dir / "type.png"))
    cov = coverage(bgr)
    glyphs = {}
    for chars, top, bottom, baseline, src_h, target in ROWS:
        boxes = find_boxes(cov, chars, top, bottom)
        k = target / src_h
        for ch, (x, y, w, h) in zip(chars, boxes):
            pad = 3
            y0 = top + y - pad
            crop = cov[y0:top + y + h + pad, x - pad:x + w + pad]
            big = cv2.resize(crop, None, fx=UP, fy=UP, interpolation=cv2.INTER_CUBIC)
            big = cv2.GaussianBlur(big, (0, 0), UP * 0.35)
            contours = trace_bitmap(big > 0.5)
            # potracer reports y as array row; font y is up from the baseline.
            contours = map_points(contours, lambda p: (p[0] / UP * k, (baseline - (y0 + p[1] / UP)) * k))
            lines = (0, XH, CAP, 830) if target == XH else (0, CAP)
            glyphs[ch] = snap_lines(straighten(contours), lines)

    # Only the dot comes from the logo: its letters are lighter than the specimen and would look patchy in text.
    glyphs["."] = build_from_logo(logo_dir / "saneee.in.svg")["."]

    built = {}
    metrics = {}
    cmap = {}
    names = [".notdef", "space"]
    for ch, c in glyphs.items():
        left, right = TIGHT.get(ch, (SIDE, SIDE))
        moved, adv = place(fix_winding(c), left, right)
        name = f"u{ord(ch):04X}"
        built[name], metrics[name] = moved, adv
        cmap[ord(ch)] = name
        names.append(name)
    for ch, (polys, dots, width, stem) in MARKS.items():
        c = draw_mark(polys, dots, width + 300, stem)
        moved, adv = place(fix_winding(c), 34, 34)
        name = f"u{ord(ch):04X}"
        built[name], metrics[name] = moved, adv
        cmap[ord(ch)] = name
        names.append(name)

    fb = FontBuilder(UPM, isTTF=False)
    fb.setupGlyphOrder(names)
    fb.setupCharacterMap({**cmap, 32: "space", 160: "space"})
    empty = T2CharStringPen(500, None).getCharString()
    space = T2CharStringPen(250, None).getCharString()
    charstrings = {".notdef": empty, "space": space}
    for n, c in built.items():
        charstrings[n] = to_charstring(c, metrics[n])
    fb.setupCFF("SaneeeBrand-Regular", {"FullName": "Saneee Brand Regular"}, charstrings, {})
    hm = {".notdef": (500, 0), "space": (250, 0)}
    for n, c in built.items():
        hm[n] = (metrics[n], round(bounds(c)[0]))
    fb.setupHorizontalMetrics(hm)
    fb.setupHorizontalHeader(ascent=900, descent=-250)
    fb.setupNameTable({"familyName": "Saneee Brand", "styleName": "Regular"})
    fb.setupOS2(sTypoAscender=900, sTypoDescender=-250, usWinAscent=950, usWinDescent=300, sxHeight=XH, sCapHeight=CAP, usWeightClass=400)
    fb.setupPost()
    otf = out_dir / "saneee-brand-regular.otf"
    fb.save(otf)
    font = TTFont(otf)
    font.flavor = "woff2"
    font.save(out_dir / "saneee-brand-regular.woff2")
    print("glyphs:", len(names), "->", out_dir)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
