import { useMemo, useState } from 'react';
import { Copy, Shuffle, Star } from 'lucide-react';
import PageHero from '../components/ui/PageHero.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useClipboard } from '../hooks/useClipboard.js';
import { useLocalArray } from '../hooks/useLocalArray.js';
import { hexToRgb, getTextColor } from '../lib/color.js';
import styles from './Shadows.module.scss';

const PRESETS = {
  Mac: { x: 0, y: 20, blur: 60, spread: 0, opacity: .22 },
  Float: { x: 0, y: 35, blur: 90, spread: -10, opacity: .35 },
  Tailwind: { x: 0, y: 10, blur: 25, spread: -5, opacity: .18 },
  Neon: { x: 0, y: 0, blur: 40, spread: 5, opacity: .9, color: '#00FFFF' },
  Glass: { x: 0, y: 8, blur: 32, spread: 0, opacity: .18 },
  Modal: { x: 0, y: 50, blur: 120, spread: -20, opacity: .4 },
};

const ELEVATION = [
  { name: 'Elevation 1', css: '0 1px 2px rgba(0,0,0,.24)' },
  { name: 'Elevation 2', css: '0 4px 10px rgba(0,0,0,.28)' },
  { name: 'Elevation 3', css: '0 10px 24px rgba(0,0,0,.32)' },
  { name: 'Elevation 4', css: '0 20px 44px rgba(0,0,0,.38)' },
  { name: 'Elevation 5', css: '0 32px 70px rgba(0,0,0,.44)' },
];
const INSET = [
  { name: 'Inset Soft', css: 'inset 0 1px 3px rgba(0,0,0,.4)' },
  { name: 'Inset Ring', css: 'inset 0 0 0 2px rgba(255,255,255,.12)' },
  { name: 'Pressed', css: 'inset 0 2px 6px rgba(0,0,0,.5)' },
];

export default function Shadows() {
  const { copy, copiedValue } = useClipboard();
  const favorites = useLocalArray('craft_shadow_favorites', 60);

  const [x, setX] = useState(0);
  const [y, setY] = useState(20);
  const [blur, setBlur] = useState(60);
  const [spread, setSpread] = useState(0);
  const [opacity, setOpacity] = useState(.22);
  const [shadowColor, setShadowColor] = useState('#FFFFFF');
  const [glassBlur, setGlassBlur] = useState(20);
  const [glassOpacity, setGlassOpacity] = useState(.55);
  const [borderOpacity, setBorderOpacity] = useState(.6);
  const [bg, setBg] = useState('#1a1c2e');
  const [cardColor, setCardColor] = useState('#FFFFFF');

  const rgb = hexToRgb(shadowColor);
  const cardRgb = hexToRgb(cardColor);
  const boxShadow = `${x}px ${y}px ${blur}px ${spread}px rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;

  const css = useMemo(() => `.glass-card {
  box-shadow: ${boxShadow};
  backdrop-filter: blur(${glassBlur}px) saturate(140%) brightness(1.1);
  -webkit-backdrop-filter: blur(${glassBlur}px) saturate(140%) brightness(1.1);
  background: rgba(${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}, ${glassOpacity});
  border: 1px solid rgba(${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}, ${borderOpacity});
  border-radius: 32px;
}`, [boxShadow, glassBlur, glassOpacity, borderOpacity, cardRgb.r, cardRgb.g, cardRgb.b]);

  function applyPreset(p) {
    setX(p.x); setY(p.y); setBlur(p.blur); setSpread(p.spread); setOpacity(p.opacity);
    if (p.color) setShadowColor(p.color);
  }

  function randomize() {
    setX(Math.floor(Math.random() * 80) - 20);
    setY(Math.floor(Math.random() * 80));
    setBlur(Math.floor(Math.random() * 120) + 10);
    setSpread(Math.floor(Math.random() * 20) - 10);
    setOpacity(Number((Math.random() * .8).toFixed(2)));
  }

  const isFav = favorites.items.some(f => JSON.parse(f).css === css);

  return (
    <div>
      <PageHero
        title="Shadow & Glass Studio"
        desc="Dial in box-shadow, backdrop blur, and border opacity live, start from a preset, then copy the generated CSS straight into your project."
        accent="var(--accent-4)"
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className={styles.layout}>
            <Reveal className={styles.stageWrap} style={{ background: bg }}>
              <div className={styles.bgPickerRow}>
                <span className={styles.bgPickerChip}>
                  Canvas
                  <input type="color" className={styles.bgPicker} value={bg} onChange={e => setBg(e.target.value)} />
                </span>
                <span className={styles.bgPickerChip}>
                  Card
                  <input type="color" className={styles.bgPicker} value={cardColor} onChange={e => setCardColor(e.target.value)} />
                </span>
              </div>
              <div
                className={styles.glassCard}
                style={{
                  boxShadow,
                  backdropFilter: `blur(${glassBlur}px) saturate(140%) brightness(1.1)`,
                  WebkitBackdropFilter: `blur(${glassBlur}px) saturate(140%) brightness(1.1)`,
                  background: `rgba(${cardRgb.r},${cardRgb.g},${cardRgb.b},${glassOpacity})`,
                  border: `1px solid rgba(${cardRgb.r},${cardRgb.g},${cardRgb.b},${borderOpacity})`,
                  color: getTextColor(bg),
                }}
              >
                Glass Card
              </div>
            </Reveal>

            <Reveal delay={.08} className={styles.panel}>
              <div className={styles.panelTitle}>Controls</div>

              <Slider label="Offset X" value={x} min={-60} max={60} unit="px" onChange={setX} />
              <Slider label="Offset Y" value={y} min={-60} max={100} unit="px" onChange={setY} />
              <Slider label="Blur" value={blur} min={0} max={160} unit="px" onChange={setBlur} />
              <Slider label="Spread" value={spread} min={-40} max={40} unit="px" onChange={setSpread} />
              <Slider label="Opacity" value={opacity} min={0} max={1} step={0.01} onChange={setOpacity} />

              <div className={styles.colorRow}>
                <input type="color" className={styles.colorInput} value={shadowColor} onChange={e => setShadowColor(e.target.value)} />
                <span className={styles.colorRowLabel}>Shadow color</span>
              </div>

              <Slider label="Glass blur" value={glassBlur} min={0} max={60} unit="px" onChange={setGlassBlur} />
              <Slider label="Glass opacity" value={glassOpacity} min={0} max={1} step={0.01} onChange={setGlassOpacity} />
              <Slider label="Border opacity" value={borderOpacity} min={0} max={1} step={0.01} onChange={setBorderOpacity} />
              <p className={styles.hint}>Lower opacity blends more of the canvas behind the card (the "glass" look) — raise it toward 1 for a truer, more solid version of the Card color.</p>

              <div className={styles.presetGrid}>
                {Object.entries(PRESETS).map(([name, p]) => (
                  <button key={name} className={styles.presetBtn} onClick={() => applyPreset(p)}>{name}</button>
                ))}
              </div>

              <div className={styles.actionsRow}>
                <button className={styles.presetBtn} style={{ flex: 1 }} onClick={randomize}><Shuffle size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />Randomize</button>
                <button
                  className={styles.presetBtn}
                  style={{ flex: 1, color: isFav ? 'var(--accent-3)' : undefined, borderColor: isFav ? 'var(--accent-3)' : undefined }}
                  onClick={() => favorites.toggle(JSON.stringify({ color: shadowColor, css }))}
                >
                  <Star size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} fill={isFav ? 'currentColor' : 'none'} />Save
                </button>
              </div>

              <div className={styles.codeBlock}>
                <button className={styles.copyCodeBtn} onClick={() => copy(css, 'Glass CSS')}><Copy size={11} /> Copy</button>
                {css}
              </div>

              <span className={styles.favStripLabel}>Favorites</span>
              <div className={styles.favStrip}>
                {favorites.items.length === 0 && <span className={styles.emptyMini}>Save a style to see it here.</span>}
                {favorites.items.slice().reverse().map((f, i) => {
                  const parsed = JSON.parse(f);
                  return (
                    <button
                      key={i}
                      className={styles.favSwatch}
                      style={{ background: parsed.color }}
                      title="Apply"
                      onClick={() => copy(parsed.css, 'Saved CSS')}
                    />
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BONUS: static reference gallery */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className={styles.group}>
            <div className={styles.groupTitle}>Elevation Scale</div>
            <div className={styles.grid}>
              {ELEVATION.map(item => (
                <button key={item.name} className={styles.card} onClick={() => copy(`box-shadow: ${item.css};`, item.name)}>
                  <div className={styles.swatchBox} style={{ boxShadow: item.css }} />
                  <div>
                    <div className={styles.label}>{item.name}</div>
                    <div className={styles.sub}>{item.css.split(' ').slice(0, 3).join(' ')}…</div>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={.06} className={styles.group}>
            <div className={styles.groupTitle}>Inset &amp; Pressed</div>
            <div className={styles.grid}>
              {INSET.map(item => (
                <button key={item.name} className={styles.card} onClick={() => copy(`box-shadow: ${item.css};`, item.name)}>
                  <div className={styles.swatchBox} style={{ boxShadow: item.css }} />
                  <div>
                    <div className={styles.label}>{item.name}</div>
                    <div className={styles.sub}>{item.css.split(' ').slice(0, 3).join(' ')}…</div>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Toast message={copiedValue} />
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div className={styles.sliderRow}>
      <span className={styles.sliderLabel}>{label} <b>{value}{unit}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}