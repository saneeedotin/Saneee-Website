// Run: node --experimental-strip-types tools/check-sdf.ts
import assert from "node:assert";
import { signedDistance } from "../src/components/sdf.ts";

// An 11x11 image with a solid 3x3 square in the middle, at x and y 4..6.
const size = 11;
const rgba = new Uint8ClampedArray(size * size * 4);
for (let y = 4; y <= 6; y++) for (let x = 4; x <= 6; x++) rgba[(y * size + x) * 4 + 3] = 255;
const d = signedDistance(rgba, size, size);
const at = (x: number, y: number) => d[(size - 1 - y) * size + x]; // Output rows are bottom-up.

assert.ok(at(5, 5) < 0, "the centre is inside");
assert.ok(at(0, 0) > 0, "the corner is outside");
assert.strictEqual(at(1, 5), 3, "three pixels left of the square's edge pixel");
assert.strictEqual(at(5, 1), 3, "three pixels above it");
assert.strictEqual(at(5, 5), -2, "two pixels from the nearest pixel outside");
assert.ok(Math.abs(at(1, 1) - Math.hypot(3, 3)) < 1e-6, "corners measure straight-line distance");

// Rows come back flipped: a mark on the image's top row lands on the output's last row.
const top = new Uint8ClampedArray(size * size * 4);
top[3] = 255;
assert.ok(signedDistance(top, size, size)[(size - 1) * size] <= 0, "rows are flipped for WebGL");

console.log("sdf ok");
