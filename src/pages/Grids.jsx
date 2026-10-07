import { useMemo, useState } from 'react';
import { Copy, Plus, Trash2 } from 'lucide-react';
import PageHero from '../components/ui/PageHero.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Toast from '../components/ui/Toast.jsx';
import BlockPreview from '../components/ui/BlockPreview.jsx';
import { useClipboard } from '../hooks/useClipboard.js';
import { PALETTE, PRESETS, makeBlock, presetToBlocks, buildGridCSS, buildHTML } from '../lib/gridBuilder.js';
import styles from './Grids.module.scss';

const LAYOUTS = [
  {
    name: '12-Column Grid',
    desc: 'The classic responsive foundation — flexible spans for any layout.',
    css: `.grid {\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n  gap: 16px;\n}\n.col-span-4 { grid-column: span 4; }`,
    render: () => (
      <div className={styles.demoGrid} style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
        {[4, 4, 4, 6, 6, 3, 3, 3, 3].map((s, i) => (
          <div key={i} className={styles.demoBox} style={{ gridColumn: `span ${s}` }}>span {s}</div>
        ))}
      </div>
    ),
  },
  {
    name: 'Bento Grid',
    desc: 'Asymmetric feature layout — great for dashboards and marketing sections.',
    css: `.bento {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-auto-rows: 90px;\n  gap: 12px;\n}\n.bento .lg { grid-column: span 2; grid-row: span 2; }`,
    render: () => (
      <div className={styles.demoGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '48px' }}>
        <div className={styles.demoBox} style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>Feature</div>
        <div className={styles.demoBox}>A</div>
        <div className={styles.demoBox}>B</div>
        <div className={styles.demoBox}>C</div>
        <div className={styles.demoBox}>D</div>
        <div className={styles.demoBox} style={{ gridColumn: 'span 2' }}>Wide</div>
      </div>
    ),
  },
  {
    name: 'Holy Grail Layout',
    desc: 'Header, footer, sidebar, and main content — the timeless app shell.',
    css: `.shell {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "side   main"\n    "footer footer";\n  grid-template-columns: 180px 1fr;\n  grid-template-rows: auto 1fr auto;\n}`,
    render: () => (
      <div className={styles.demoGrid} style={{
        gridTemplateAreas: `"header header" "side main" "footer footer"`,
        gridTemplateColumns: '80px 1fr', gridTemplateRows: 'auto 1fr auto',
      }}>
        <div className={styles.demoBox} style={{ gridArea: 'header' }}>Header</div>
        <div className={styles.demoBox} style={{ gridArea: 'side' }}>Nav</div>
        <div className={styles.demoBox} style={{ gridArea: 'main' }}>Main</div>
        <div className={styles.demoBox} style={{ gridArea: 'footer' }}>Footer</div>
      </div>
    ),
  },
  {
    name: 'Masonry (CSS Columns)',
    desc: 'Pinterest-style flow layout using multi-column, no JS required.',
    css: `.masonry {\n  columns: 3;\n  column-gap: 12px;\n}\n.masonry > * {\n  break-inside: avoid;\n  margin-bottom: 12px;\n}`,
    render: () => (
      <div style={{ columns: 3, columnGap: 8 }}>
        {[70, 40, 55, 90, 35, 60].map((h, i) => (
          <div key={i} className={styles.demoBox} style={{ height: h, marginBottom: 8, breakInside: 'avoid' }}>{i + 1}</div>
        ))}
      </div>
    ),
  },
  {
    name: 'Auto-Fit Card Grid',
    desc: 'Self-wrapping responsive cards with no media queries.',
    css: `.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n  gap: 16px;\n}`,
    render: () => (
      <div className={styles.demoGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.demoBox}>Card {i + 1}</div>
        ))}
      </div>
    ),
  },
];

export default function Grids() {
  const { copy, copiedValue } = useClipboard();

  return (
    <div>
      <PageHero
        title="Layout Builder"
        desc="Drop components onto a live CSS Grid canvas, adjust column and row spans per block, then copy the exact grid + HTML it generates."
        accent="var(--accent-2)"
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <GridBuilder copy={copy} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2 className="section-title" style={{ fontSize: 28 }}>Reference Patterns</h2>
            <p className="section-desc">Five battle-tested CSS Grid patterns you can drop straight into a stylesheet.</p>
          </div>
          <div className={styles.list}>
            {LAYOUTS.map((layout, i) => (
              <Reveal key={layout.name} delay={i * .06} className={styles.card}>
                <div className={styles.head}>
                  <div>
                    <div className={styles.headTitle}>{layout.name}</div>
                    <div className={styles.headDesc}>{layout.desc}</div>
                  </div>
                  <button className={styles.copyBtn} onClick={() => copy(layout.css, layout.name)}>
                    <Copy size={13} /> Copy CSS
                  </button>
                </div>
                <div className={styles.body}>
                  {layout.render()}
                  <pre className={styles.code}>{layout.css}</pre>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Toast message={copiedValue} />
    </div>
  );
}

function GridBuilder({ copy }) {
  const [cols, setCols] = useState(12);
  const [gap, setGap] = useState(12);
  const [blocks, setBlocks] = useState(() => presetToBlocks('Landing'));
  const [selectedId, setSelectedId] = useState(null);
  const [codeTab, setCodeTab] = useState('CSS');

  const selected = blocks.find(b => b.id === selectedId) || null;

  function addBlock(type) {
    const b = makeBlock(type);
    setBlocks(prev => [...prev, b]);
    setSelectedId(b.id);
  }

  function updateSelected(patch) {
    setBlocks(prev => prev.map(b => (b.id === selectedId ? { ...b, ...patch } : b)));
  }

  function removeBlock(id) {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function applyPreset(name) {
    const next = presetToBlocks(name);
    setBlocks(next);
    setSelectedId(null);
  }

  const code = useMemo(
    () => (codeTab === 'CSS' ? buildGridCSS(cols, gap, blocks) : buildHTML(blocks)),
    [codeTab, cols, gap, blocks]
  );

  return (
    <div className={styles.builderLayout}>
      {/* PALETTE */}
      <Reveal className={styles.palette}>
        <div className={styles.paletteTitle}>Components</div>
        <div className={styles.paletteGrid}>
          {PALETTE.map(p => (
            <button key={p.type} className={styles.paletteBtn} onClick={() => addBlock(p.type)}>
              {p.label} <Plus size={12} />
            </button>
          ))}
        </div>

        <div className={styles.presetsTitle}>Presets</div>
        {Object.keys(PRESETS).map(name => (
          <button key={name} className={styles.presetBtn} onClick={() => applyPreset(name)}>{name}</button>
        ))}
      </Reveal>

      {/* CANVAS */}
      <Reveal delay={.05} className={styles.canvasArea}>
        <div className={styles.canvasToolbar}>
          <div className={styles.toolbarGroup}>
            <span className={styles.toolbarLabel}>Columns: {cols}</span>
            <input type="range" className={styles.toolbarSlider} min={2} max={12} value={cols} onChange={e => setCols(Number(e.target.value))} />
          </div>
          <div className={styles.toolbarGroup}>
            <span className={styles.toolbarLabel}>Gap: {gap}px</span>
            <input type="range" className={styles.toolbarSlider} min={0} max={40} value={gap} onChange={e => setGap(Number(e.target.value))} />
          </div>
          <button className={styles.clearBtn} onClick={() => { setBlocks([]); setSelectedId(null); }}>
            <Trash2 size={12} /> Clear
          </button>
        </div>

        <div className={styles.canvas} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
          {blocks.length === 0 && (
            <div className={styles.canvasEmpty}>
              <span>Canvas is empty</span>
              <span>Add a component from the palette to get started</span>
            </div>
          )}
          {blocks.map(b => (
            <div
              key={b.id}
              className={`${styles.block} ${selectedId === b.id ? styles.blockSelected : ''}`}
              style={{ gridColumn: `span ${Math.min(b.colSpan, cols)}`, gridRow: `span ${b.rowSpan}` }}
              onClick={() => setSelectedId(b.id)}
            >
              <button className={styles.blockRemove} onClick={e => { e.stopPropagation(); removeBlock(b.id); }} aria-label="Remove block">
                <Trash2 size={11} />
              </button>
              <BlockPreview type={b.type} />
            </div>
          ))}
        </div>
      </Reveal>

      {/* INSPECTOR */}
      <Reveal delay={.1} className={styles.inspector}>
        {selected ? (
          <>
            <div className={styles.inspectorTitle}>{selected.type}</div>
            <div className={styles.inspectorType}>Block settings</div>

            <div className={styles.toolbarGroup} style={{ marginBottom: 14 }}>
              <span className={styles.toolbarLabel}>Column span: {selected.colSpan}</span>
            </div>
            <input
              type="range" className={styles.toolbarSlider} style={{ width: '100%', marginBottom: 16 }}
              min={1} max={cols} value={selected.colSpan}
              onChange={e => updateSelected({ colSpan: Number(e.target.value) })}
            />

            <div className={styles.toolbarGroup} style={{ marginBottom: 14 }}>
              <span className={styles.toolbarLabel}>Row span: {selected.rowSpan}</span>
            </div>
            <input
              type="range" className={styles.toolbarSlider} style={{ width: '100%' }}
              min={1} max={4} value={selected.rowSpan}
              onChange={e => updateSelected({ rowSpan: Number(e.target.value) })}
            />
          </>
        ) : (
          <div className={styles.inspectorEmpty}>Select a block on the canvas to edit its span.</div>
        )}

        <div className={styles.codeTabs}>
          {['CSS', 'HTML'].map(t => (
            <button key={t} className={`${styles.codeTab} ${codeTab === t ? styles.codeTabActive : ''}`} onClick={() => setCodeTab(t)}>{t}</button>
          ))}
        </div>
        <div className={styles.codeOutput}>
          <button className={styles.codeCopy} onClick={() => copy(code, `Grid ${codeTab}`)}><Copy size={11} /> Copy</button>
          {code}
        </div>
      </Reveal>
    </div>
  );
}
