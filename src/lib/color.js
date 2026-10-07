export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function rgbToHsv({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max, v = max;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

export function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function isValidHex(v) { return /^#?[0-9a-fA-F]{6}$/.test(v.trim()); }

export function normalizeHex(v) {
  v = v.trim();
  if (!v.startsWith('#')) v = '#' + v;
  return v.toUpperCase();
}

export function randomHex() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
}

function luminance({ r, g, b }) {
  const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(hex1, hex2) {
  const l1 = luminance(hexToRgb(hex1));
  const l2 = luminance(hexToRgb(hex2));
  const [lo, hi] = l1 < l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function getTextColor(hex) {
  return luminance(hexToRgb(hex)) > 0.179 ? '#000000' : '#FFFFFF';
}

export function getColorName(hex) {
  const { h, s, l } = rgbToHsl(hexToRgb(hex));
  if (s < 8) return l > 80 ? 'White' : l < 20 ? 'Black' : 'Gray';
  if (h < 15 || h >= 345) return l < 30 ? 'Dark Red' : l > 70 ? 'Light Red' : 'Red';
  if (h < 40) return l < 30 ? 'Dark Orange' : 'Orange';
  if (h < 65) return l < 40 ? 'Dark Yellow' : 'Yellow';
  if (h < 150) return l < 30 ? 'Dark Green' : l > 70 ? 'Light Green' : 'Green';
  if (h < 185) return 'Cyan';
  if (h < 255) return l < 30 ? 'Dark Blue' : l > 70 ? 'Light Blue' : 'Blue';
  if (h < 285) return l < 30 ? 'Dark Indigo' : 'Indigo';
  if (h < 325) return l < 30 ? 'Dark Violet' : 'Violet';
  return l < 30 ? 'Dark Pink' : 'Pink';
}

/** Tailwind-style 11-step shade scale generated from a single base color. */
export function generateShades(hex) {
  const rgb = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(rgb);
  const steps = [
    { n: 50, lTarget: 97, sScale: 0.08 },
    { n: 100, lTarget: 94, sScale: 0.15 },
    { n: 200, lTarget: 88, sScale: 0.3 },
    { n: 300, lTarget: 78, sScale: 0.55 },
    { n: 400, lTarget: 65, sScale: 0.8 },
    { n: 500, lTarget: null, sScale: 1 },
    { n: 600, lTarget: null, lDelta: -10, sScale: 1.05 },
    { n: 700, lTarget: null, lDelta: -20, sScale: 1.1 },
    { n: 800, lTarget: null, lDelta: -32, sScale: 1.0 },
    { n: 900, lTarget: null, lDelta: -42, sScale: 0.9 },
    { n: 950, lTarget: null, lDelta: -50, sScale: 0.75 },
  ];
  return steps.map(({ n, lTarget, lDelta, sScale }) => {
    const newL = lTarget != null ? lTarget : (lDelta != null ? clamp(l + lDelta, 2, 97) : l);
    let newS = clamp(s * sScale, 0, 100);
    if (s < 10 && n >= 200 && n <= 800) newS = Math.max(newS, s);
    return { n, hex: rgbToHex(hslToRgb(h, newS, newL)) };
  });
}

/** Color-theory-driven gradient suggestions for a base color. */
export function generateGradients(hex) {
  const { h, s, l } = rgbToHsl(hexToRgb(hex));
  const compH = (h + 180) % 360;
  const anaH1 = (h + 30) % 360;
  const anaH2 = (h - 30 + 360) % 360;
  const triH = (h + 120) % 360;

  const comp = rgbToHex(hslToRgb(compH, clamp(s, 40, 90), clamp(l, 35, 65)));
  const ana1 = rgbToHex(hslToRgb(anaH1, clamp(s, 40, 90), clamp(l, 35, 65)));
  const ana2 = rgbToHex(hslToRgb(anaH2, clamp(s, 40, 90), clamp(l, 35, 65)));
  const tri = rgbToHex(hslToRgb(triH, clamp(s, 40, 90), clamp(l, 35, 65)));
  const white = '#FFFFFF';
  const dark = rgbToHex(hslToRgb(h, clamp(s * .7, 0, 80), clamp(l - 30, 5, 25)));

  return [
    { label: 'Complementary', css: `linear-gradient(135deg, ${hex}, ${comp})` },
    { label: 'Analogous', css: `linear-gradient(135deg, ${ana2}, ${hex}, ${ana1})` },
    { label: 'Horizontal', css: `linear-gradient(90deg, ${hex}, ${comp})` },
    { label: 'Vertical Fade', css: `linear-gradient(180deg, ${hex}, ${dark})` },
    { label: 'To White', css: `linear-gradient(135deg, ${hex}, ${white})` },
    { label: 'Radial Glow', css: `radial-gradient(circle at 40% 50%, ${hex}, ${dark})` },
    { label: 'Triadic', css: `linear-gradient(135deg, ${hex}, ${tri})` },
    { label: 'Diagonal Fade', css: `linear-gradient(45deg, ${dark}, ${hex}, ${ana1})` },
  ];
}

export function wcagLabel(ratio, level = 'AA') {
  const minRatio = level === 'AA' ? 4.5 : 7;
  if (ratio >= minRatio) return { text: `${level} Pass`, tone: 'pass' };
  if (ratio >= minRatio * 0.67) return { text: `${level} Large`, tone: 'warn' };
  return { text: `${level} Fail`, tone: 'fail' };
}
