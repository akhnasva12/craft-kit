export const BLOCK_TYPES = {
  card: { label: 'Card', defaultCol: 4, defaultRow: 1 },
  navbar: { label: 'Navbar', defaultCol: 12, defaultRow: 1 },
  hero: { label: 'Hero', defaultCol: 12, defaultRow: 2 },
  sidebar: { label: 'Sidebar', defaultCol: 3, defaultRow: 3 },
  stat: { label: 'Stat', defaultCol: 3, defaultRow: 1 },
  table: { label: 'Table', defaultCol: 8, defaultRow: 2 },
  form: { label: 'Form', defaultCol: 5, defaultRow: 2 },
  image: { label: 'Image', defaultCol: 4, defaultRow: 2 },
  button: { label: 'Button', defaultCol: 2, defaultRow: 1 },
};

export const PALETTE = Object.entries(BLOCK_TYPES).map(([type, def]) => ({ type, ...def }));

export const PRESETS = {
  Dashboard: [
    { type: 'navbar', colSpan: 12, rowSpan: 1 },
    { type: 'sidebar', colSpan: 3, rowSpan: 3 },
    { type: 'stat', colSpan: 3, rowSpan: 1 },
    { type: 'stat', colSpan: 3, rowSpan: 1 },
    { type: 'stat', colSpan: 3, rowSpan: 1 },
    { type: 'table', colSpan: 9, rowSpan: 2 },
  ],
  Landing: [
    { type: 'navbar', colSpan: 12, rowSpan: 1 },
    { type: 'hero', colSpan: 12, rowSpan: 2 },
    { type: 'card', colSpan: 4, rowSpan: 1 },
    { type: 'card', colSpan: 4, rowSpan: 1 },
    { type: 'card', colSpan: 4, rowSpan: 1 },
  ],
  Pricing: [
    { type: 'card', colSpan: 4, rowSpan: 2 },
    { type: 'card', colSpan: 4, rowSpan: 2 },
    { type: 'card', colSpan: 4, rowSpan: 2 },
  ],
  'Split Form': [
    { type: 'image', colSpan: 6, rowSpan: 3 },
    { type: 'form', colSpan: 6, rowSpan: 3 },
  ],
};

let counter = 0;
export function makeBlock(type) {
  const def = BLOCK_TYPES[type];
  counter += 1;
  return { id: `b${counter}-${Date.now()}`, type, colSpan: def.defaultCol, rowSpan: def.defaultRow };
}

export function presetToBlocks(name) {
  counter += 1;
  return PRESETS[name].map((b, i) => ({ id: `preset-${counter}-${i}`, ...b }));
}

export function buildGridCSS(cols, gap, blocks) {
  const container = `.layout {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  gap: ${gap}px;
}`;
  const items = blocks.map((b, i) =>
    `.layout > :nth-child(${i + 1}) {\n  grid-column: span ${Math.min(b.colSpan, cols)};\n  grid-row: span ${b.rowSpan};\n}`
  ).join('\n\n');
  return items ? `${container}\n\n${items}` : container;
}

export function buildHTML(blocks) {
  const tags = blocks.map(b => `  <div class="${b.type}">${BLOCK_TYPES[b.type].label}</div>`).join('\n');
  return `<div class="layout">\n${tags}\n</div>`;
}
