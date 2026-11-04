"""Cut logo/type.png into one mask per glyph, so each can be checked by eye.

Run: python tools/font/01_segment.py <path to type.png> <output dir>
"""
import json
import pathlib
import sys

import cv2
import numpy as np

# Rows of the specimen, in reading order. Ink rows only; the wordmark and sample words are skipped.
ROWS = [
    ("ABCDEFGHIJKLMN", 440, 530),
    ("OPQRSTUVWXYZ", 540, 630),
    ("abcdefghijklmn", 680, 795),
    ("opqrstuvwxyz", 795, 895),
    ("0123456789", 950, 1045),
]


def ink_mask(bgr):
    # Black ink is dark; the green S/s are saturated. The pale grid and rings are neither.
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    dark = bgr.max(axis=2) < 120
    green = (hsv[..., 1] > 110) & (hsv[..., 2] > 120)
    return dark | green


def main(src, out):
    out = pathlib.Path(out)
    out.mkdir(parents=True, exist_ok=True)
    bgr = cv2.imread(src)
    mask = ink_mask(bgr).astype(np.uint8)
    report = {}
    for chars, top, bottom in ROWS:
        band = mask[top:bottom]
        n, labels, stats, _ = cv2.connectedComponentsWithStats(band, connectivity=8)
        boxes = [stats[i] for i in range(1, n) if stats[i][4] > 25]
        boxes.sort(key=lambda s: s[0])
        # Parts that overlap horizontally belong to one glyph (the i dot, the j arrow).
        merged = []
        for x, y, w, h, _ in boxes:
            if merged and x < merged[-1][0] + merged[-1][2] - 2:
                m = merged[-1]
                x2 = max(m[0] + m[2], x + w)
                y1, y2 = min(m[1], y), max(m[1] + m[3], y + h)
                merged[-1] = [m[0], y1, x2 - m[0], y2 - y1]
            else:
                merged.append([x, y, w, h])
        report[chars] = {"found": len(merged), "expected": len(chars), "boxes": merged}
        print(chars, "found", len(merged), "expected", len(chars))
    (out / "rows.json").write_text(json.dumps(report, default=int, indent=1))
    cv2.imwrite(str(out / "mask.png"), mask * 255)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
