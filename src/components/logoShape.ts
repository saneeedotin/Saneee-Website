// The logo's S and cursor arrow, in the logo's own coordinates. The arrow is the same shape as the site cursor.
export const LOGO_S = [[470, 500], [724, 500], [724, 570], [503, 570], [712, 695], [724, 715], [724, 755], [690, 808], [425, 808], [425, 768], [452, 740], [655, 740], [440, 615], [425, 590], [425, 545]];
export const LOGO_ARROW = [[755, 357], [868, 465], [800, 465], [755, 508]];
export const ORIGIN = { x: 425, y: 357, size: 451 };

/** The S alone as an SVG path, in a viewBox of `S_VIEWBOX`. */
export const S_PATH = "M" + LOGO_S.map(([x, y]) => `${x - 425} ${y - 500}`).join("L") + "Z";
export const S_VIEWBOX = "0 0 299 308";
