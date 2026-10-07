import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RotateCw } from 'lucide-react';
import PageHero from '../components/ui/PageHero.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useClipboard } from '../hooks/useClipboard.js';
import { PRESET_NAMES, buildFrames, buildFullCSS } from '../lib/motionPresets.js';
import styles from './Motion.module.scss';

const EASINGS = ['ease', 'ease-in-out', 'ease-in', 'ease-out', 'linear', 'cubic-bezier(.34,1.56,.64,1)'];

const GALLERY = [
  { name: 'Fade In', desc: 'opacity 0 → 1', anim: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: .6 } } },
  { name: 'Slide Up', desc: 'y: 40 → 0, fade', anim: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: .6, ease: [.16, 1, .3, 1] } } },
  { name: 'Scale Pop', desc: 'spring scale 0.6 → 1', anim: { initial: { opacity: 0, scale: .6 }, animate: { opacity: 1, scale: 1 }, transition: { type: 'spring', stiffness: 260, damping: 18 } } },
  { name: 'Rotate In', desc: 'rotate -20° → 0°', anim: { initial: { opacity: 0, rotate: -25, scale: .8 }, animate: { opacity: 1, rotate: 0, scale: 1 }, transition: { duration: .65, ease: [.34, 1.56, .64, 1] } } },
  { name: 'Slide + Blur', desc: 'x: -50, blur → sharp', anim: { initial: { opacity: 0, x: -50, filter: 'blur(6px)' }, animate: { opacity: 1, x: 0, filter: 'blur(0px)' }, transition: { duration: .7, ease: [.16, 1, .3, 1] } } },
  { name: 'Bounce', desc: 'elastic spring drop', anim: { initial: { opacity: 0, y: -60 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring', stiffness: 320, damping: 12 } } },
  { name: 'Flip In', desc: 'rotateX -90° → 0°', anim: { initial: { opacity: 0, rotateX: -90 }, animate: { opacity: 1, rotateX: 0 }, transition: { duration: .6, ease: [.16, 1, .3, 1] } } },
  { name: 'Swing In', desc: 'pendulum rotate settle', anim: { initial: { opacity: 0, rotate: -15, y: -20 }, animate: { opacity: 1, rotate: [-15, 8, -4, 0], y: 0 }, transition: { duration: .8, ease: 'easeOut' } } },
];

/** Pretty-prints a Framer Motion anim config object as JS source, e.g. `{ opacity: 0, y: 40 }`. */
function stringifyProps(obj) {
  const parts = Object.entries(obj).map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : JSON.stringify(v)}`);
  return `{ ${parts.join(', ')} }`;
}

function presetToJSX(preset) {
  return `<motion.div
  initial={${stringifyProps(preset.anim.initial)}}
  animate={${stringifyProps(preset.anim.animate)}}
  transition={${stringifyProps(preset.anim.transition)}}
>
  {/* your content */}
</motion.div>`;
}

export default function Motion() {
  const { copy, copiedValue } = useClipboard();

  const [preset, setPreset] = useState('Floating');
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [radius, setRadius] = useState(20);
  const [speed, setSpeed] = useState(2);
  const [easing, setEasing] = useState('ease-in-out');

  const state = { x, y, scale, rotate, opacity, radius, speed, easing };
  const frames = useMemo(() => buildFrames(preset, state), [preset, x, y, scale, rotate]);
  const css = useMemo(() => buildFullCSS(preset, state), [preset, x, y, scale, rotate, opacity, radius, speed, easing]);

  const keyframesRule = useMemo(() => {
    const body = frames.map(f => `${f.pct}% { transform: ${f.transform}; }`).join(' ');
    return `@keyframes craftAnimLive { ${body} }`;
  }, [frames]);

  return (
    <div>
      <PageHero
        title="Motion Playground"
        desc="Shape a live CSS keyframe animation — translate, scale, rotate, and timing — then copy the exact @keyframes rule into your stylesheet."
        accent="var(--accent-5)"
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className={styles.layout}>
            <Reveal className={styles.stageWrap}>
              <style>{keyframesRule}</style>
              <div
                className={styles.previewEl}
                style={{
                  borderRadius: radius,
                  opacity,
                  animation: `craftAnimLive ${speed}s ${easing} infinite`,
                }}
              >
                Motion
              </div>
            </Reveal>

            <Reveal delay={.08} className={styles.panel}>
              <div className={styles.panelTitle}>Controls</div>

              <div className={styles.presetGrid}>
                {PRESET_NAMES.map(name => (
                  <button
                    key={name}
                    className={`${styles.presetBtn} ${preset === name ? styles.presetActive : ''}`}
                    onClick={() => setPreset(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <Slider label="Translate X" value={x} min={-80} max={80} unit="px" onChange={setX} />
              <Slider label="Translate Y" value={y} min={-80} max={80} unit="px" onChange={setY} />
              <Slider label="Scale" value={scale} min={.5} max={2} step={.05} onChange={setScale} />
              <Slider label="Rotate" value={rotate} min={-180} max={180} unit="°" onChange={setRotate} />
              <Slider label="Opacity" value={opacity} min={0} max={1} step={.05} onChange={setOpacity} />
              <Slider label="Radius" value={radius} min={0} max={50} unit="px" onChange={setRadius} />
              <Slider label="Duration" value={speed} min={.3} max={6} step={.1} unit="s" onChange={setSpeed} />

              <div className={styles.row2}>
                <select className={styles.select} value={easing} onChange={e => setEasing(e.target.value)}>
                  {EASINGS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div className={styles.codeBlock}>
                <button className={styles.copyCodeBtn} onClick={() => copy(css, `${preset} keyframes`)}><Copy size={11} /> Copy</button>
                {css}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BONUS: Framer Motion presets gallery */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className={styles.group}>
            <div className={styles.groupTitle}>Framer Motion Entrance Presets</div>
            <p className={styles.gallerySubtext}>
              Ready-to-use entrance animations for React components — click ↻ to replay, or the copy icon to get the exact <code>&lt;motion.div&gt;</code> code for that effect.
            </p>
            <div className={styles.grid}>
              {GALLERY.map((p, i) => (
                <Reveal key={p.name} delay={i * .05} className={styles.card}>
                  <PresetCard preset={p} copy={copy} />
                </Reveal>
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

function PresetCard({ preset, copy }) {
  const [key, setKey] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const jsx = presetToJSX(preset);

  return (
    <>
      <div className={styles.stage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            className={styles.demoBox}
            initial={preset.anim.initial}
            animate={preset.anim.animate}
            transition={preset.anim.transition}
          />
        </AnimatePresence>
      </div>
      <div className={styles.foot}>
        <div>
          <div className={styles.name}>{preset.name}</div>
          <div className={styles.desc}>{preset.desc}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className={styles.replay} onClick={() => setShowCode(v => !v)} aria-label={`Show code for ${preset.name}`}>
            <Copy size={12} />
          </button>
          <button className={styles.replay} onClick={() => setKey(k => k + 1)} aria-label={`Replay ${preset.name}`}>
            <RotateCw size={13} />
          </button>
        </div>
      </div>
      {showCode && (
        <div className={styles.codeBlock} style={{ margin: '0 18px 16px', maxHeight: 180 }}>
          <button className={styles.copyCodeBtn} onClick={() => copy(jsx, `${preset.name} code`)}><Copy size={11} /> Copy</button>
          {jsx}
        </div>
      )}
    </>
  );
}