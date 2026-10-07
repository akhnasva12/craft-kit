import { useEffect, useMemo, useState } from 'react';
import { Copy, Shuffle, Star } from 'lucide-react';
import PageHero from '../components/ui/PageHero.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useClipboard } from '../hooks/useClipboard.js';
import { useLocalArray } from '../hooks/useLocalArray.js';
import {
  hexToRgb, rgbToHsl, rgbToHsv, isValidHex, normalizeHex, randomHex,
  getTextColor, getColorName, generateShades, generateGradients,
  contrastRatio, wcagLabel,
} from '../lib/color.js';
import styles from './Colors.module.scss';

const EXPORT_FORMATS = ['CSS Variables', 'Tailwind Config', 'JSON'];

export default function Colors() {
  const [hex, setHex] = useState('#6366F1');
  const [inputValue, setInputValue] = useState('#6366F1');
  const [exportTab, setExportTab] = useState('CSS Variables');
  const { copy, copiedValue } = useClipboard();
  const history = useLocalArray('craft_color_history', 24);
  const favorites = useLocalArray('craft_color_favorites', 100);

  useEffect(() => { history.push(hex); /* eslint-disable-next-line */ }, [hex]);

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const hsv = useMemo(() => rgbToHsv(rgb), [rgb]);
  const shades = useMemo(() => generateShades(hex), [hex]);
  const gradients = useMemo(() => generateGradients(hex), [hex]);
  const textColor = getTextColor(hex);
  const colorName = getColorName(hex);
  const isFav = favorites.items.some(f => f.toLowerCase() === hex.toLowerCase());

  const crWhite = contrastRatio(hex, '#FFFFFF');
  const crBlack = contrastRatio(hex, '#000000');
  const bestText = crWhite >= crBlack ? '#FFFFFF' : '#000000';
  const bestCR = Math.max(crWhite, crBlack);

  function applyColor(v) {
    const normalized = normalizeHex(v);
    if (!isValidHex(normalized)) return;
    setHex(normalized);
    setInputValue(normalized);
  }

  function handleInputChange(v) {
    setInputValue(v);
    if (isValidHex(v)) applyColor(v);
  }

  const formats = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'HSV', value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
  ];

  const exportCode = useMemo(() => buildExportCode(exportTab, hex, shades), [exportTab, hex, shades]);

  return (
    <div>
      <PageHero
        title="Color Studio"
        desc="Pick a base color and instantly get every format, a full 11-step shade scale, theory-driven gradients, WCAG contrast checks, and ready-to-export tokens."
        accent="var(--accent-3)"
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className={styles.layout}>
            {/* PICKER */}
            <Reveal className={styles.pickerCard}>
              <div className={styles.preview} style={{ background: hex, color: textColor }}>
                <div className={styles.previewHex}>{hex}</div>
                <div className={styles.previewName}>{colorName}</div>
              </div>

              <div className={styles.pickerRow}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={hex}
                  onChange={e => applyColor(e.target.value)}
                  aria-label="Pick a color"
                />
                <input
                  type="text"
                  className={`${styles.hexInput} ${!isValidHex(inputValue) ? styles.invalid : ''}`}
                  value={inputValue}
                  onChange={e => handleInputChange(e.target.value)}
                  spellCheck={false}
                  aria-label="Hex value"
                />
              </div>

              <div className={styles.actionsRow}>
                <button className={styles.iconBtn} onClick={() => applyColor(randomHex())} title="Random color">
                  <Shuffle size={15} />
                </button>
                <button
                  className={`${styles.iconBtn} ${isFav ? styles.starred : ''}`}
                  onClick={() => favorites.toggle(hex)}
                  title={isFav ? 'Remove favorite' : 'Add favorite'}
                >
                  <Star size={15} fill={isFav ? 'currentColor' : 'none'} />
                </button>
                <button className={styles.iconBtn} onClick={() => copy(hex, hex)} title="Copy hex">
                  <Copy size={15} />
                </button>
              </div>

              <span className={styles.swatchStripLabel}>Favorites</span>
              <div className={styles.swatchStrip}>
                {favorites.items.length === 0 && <span className={styles.emptyMini}>No favorites yet — click the star.</span>}
                {favorites.items.slice().reverse().map(c => (
                  <button key={c} className={styles.miniSwatch} style={{ background: c }} onClick={() => applyColor(c)} title={c} />
                ))}
              </div>

              <span className={styles.swatchStripLabel}>Recent</span>
              <div className={styles.swatchStrip}>
                {history.items.length === 0 && <span className={styles.emptyMini}>No recent colors yet.</span>}
                {history.items.slice().reverse().slice(0, 18).map((c, i) => (
                  <button key={c + i} className={styles.miniSwatch} style={{ background: c }} onClick={() => applyColor(c)} title={c} />
                ))}
              </div>
            </Reveal>

            {/* RIGHT COLUMN */}
            <div>
              <Reveal className={styles.group}>
                <div className={styles.groupTitle}>Formats</div>
                <div className={styles.formatsGrid}>
                  {formats.map(f => (
                    <button key={f.label} className={styles.formatCard} onClick={() => copy(f.value, f.label)}>
                      <div>
                        <span className={styles.formatLabel}>{f.label}</span>
                        <div className={styles.formatValue}>{f.value}</div>
                      </div>
                      <Copy size={14} />
                    </button>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={.05} className={styles.group}>
                <div className={styles.groupTitle}>Shade Scale</div>
                <div className={styles.shadesList}>
                  {shades.map(s => (
                    <button key={s.n} className={styles.shadeRow} onClick={() => copy(s.hex, `Shade ${s.n}`)}>
                      <span className={styles.shadeNum}>{s.n}</span>
                      <span className={styles.shadeSwatch} style={{ background: s.hex }} />
                      <span className={styles.shadeHex}>{s.hex}</span>
                      <Copy size={13} className={styles.shadeCopy} />
                    </button>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={.1} className={styles.group}>
                <div className={styles.groupTitle}>Gradients</div>
                <div className={styles.gradientsGrid}>
                  {gradients.map(g => (
                    <div key={g.label} className={styles.gradientCard}>
                      <div className={styles.gradientPreview} style={{ background: g.css }} />
                      <div className={styles.gradientInfo}>
                        <div>
                          <div className={styles.gradientLabel}>{g.label}</div>
                          <div className={styles.gradientCode}>{g.css}</div>
                        </div>
                        <button className={styles.iconBtn} style={{ flex: 'none', width: 32, height: 32 }} onClick={() => copy(`background: ${g.css};`, g.label)}>
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={.15} className={styles.group}>
                <div className={styles.groupTitle}>Accessibility</div>
                <div className={styles.a11yGrid}>
                  <A11yCard label="Contrast vs White" value={`${crWhite.toFixed(2)}:1`} badge={wcagLabel(crWhite)} />
                  <A11yCard label="Contrast vs Black" value={`${crBlack.toFixed(2)}:1`} badge={wcagLabel(crBlack)} />
                  <A11yCard label="Best Text" value={bestText === '#FFFFFF' ? 'White' : 'Black'} sub={`Ratio ${bestCR.toFixed(2)}:1`} badge={wcagLabel(bestCR, 'AAA')} />
                  <A11yCard label="Color Name" value={colorName} sub={hex} />
                </div>
                <div className={styles.textPreviewRow} style={{ background: hex, color: bestText }}>
                  The quick brown fox jumps over the lazy dog.
                </div>
              </Reveal>

              <Reveal delay={.2} className={styles.group}>
                <div className={styles.groupTitle}>Export</div>
                <div className={styles.exportTabs}>
                  {EXPORT_FORMATS.map(f => (
                    <button
                      key={f}
                      className={`${styles.exportTab} ${exportTab === f ? styles.exportTabActive : ''}`}
                      onClick={() => setExportTab(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className={styles.exportCode}>
                  <button className={styles.exportCopy} onClick={() => copy(exportCode, exportTab)}>
                    <Copy size={12} /> Copy
                  </button>
                  {exportCode}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Toast message={copiedValue} />
    </div>
  );
}

function A11yCard({ label, value, sub, badge }) {
  return (
    <div className={styles.a11yCard}>
      <span className={styles.a11yLabel}>{label}</span>
      <div className={styles.a11yValue}>{value}</div>
      {sub && <div className={styles.a11ySmall}>{sub}</div>}
      {badge && (
        <span className={`${styles.badge} ${styles['badge' + capitalize(badge.tone)]}`}>{badge.text}</span>
      )}
    </div>
  );
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function buildExportCode(format, hex, shades) {
  if (format === 'CSS Variables') {
    return `:root {\n  --color-primary: ${hex};\n${shades.map(s => `  --color-${s.n}: ${s.hex};`).join('\n')}\n}`;
  }
  if (format === 'Tailwind Config') {
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        primary: {\n${shades.map(s => `          ${s.n}: '${s.hex}',`).join('\n')}\n        },\n      },\n    },\n  },\n};`;
  }
  const obj = { primary: hex, shades: Object.fromEntries(shades.map(s => [s.n, s.hex])) };
  return JSON.stringify(obj, null, 2);
}
