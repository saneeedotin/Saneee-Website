const INF = 1e20;

// One pass of the Felzenszwalb distance transform, along a row or column of the grid.
function pass(grid: Float64Array, offset: number, stride: number, n: number, f: Float64Array, v: Uint32Array, z: Float64Array) {
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  f[0] = grid[offset];
  for (let q = 1, k = 0, s = 0; q < n; q++) {
    f[q] = grid[offset + q * stride];
    const q2 = q * q;
    do {
      const r = v[k];
      s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2;
    } while (s <= z[k] && --k > -1);
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  for (let q = 0, k = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    const r = v[k];
    const d = q - r;
    grid[offset + q * stride] = f[r] + d * d;
  }
}

function transform(grid: Float64Array, width: number, height: number) {
  const size = Math.max(width, height);
  const f = new Float64Array(size);
  const v = new Uint32Array(size);
  const z = new Float64Array(size + 1);
  for (let x = 0; x < width; x++) pass(grid, x, width, height, f, v, z);
  for (let y = 0; y < height; y++) pass(grid, y * width, 1, width, f, v, z);
}

/**
 * Signed distance in pixels from each pixel to the shape's edge: negative inside.
 * Takes canvas RGBA and returns rows bottom-up, ready for a WebGL texture.
 * Antialiased edge pixels seed the transform, so edges stay smooth rather than stepped.
 */
export function signedDistance(rgba: Uint8ClampedArray, width: number, height: number): Float32Array {
  const outer = new Float64Array(width * height);
  const inner = new Float64Array(width * height);
  for (let i = 0; i < outer.length; i++) {
    const a = rgba[i * 4 + 3] / 255;
    outer[i] = a === 1 ? 0 : a === 0 ? INF : Math.max(0, 0.5 - a) ** 2;
    inner[i] = a === 1 ? INF : a === 0 ? 0 : Math.max(0, a - 0.5) ** 2;
  }
  transform(outer, width, height);
  transform(inner, width, height);
  const out = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      out[(height - 1 - y) * width + x] = Math.sqrt(outer[i]) - Math.sqrt(inner[i]);
    }
  }
  return out;
}
