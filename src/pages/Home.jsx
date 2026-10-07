import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Hexagon, LayoutGrid, Droplets, Layers, Zap,
  ArrowUpRight, ArrowDown, MousePointerClick, PaintBucket, ShieldCheck,
} from 'lucide-react';
import Reveal from '../components/ui/Reveal.jsx';
import Counter from '../components/ui/Counter.jsx';
import styles from './Home.module.scss';

const MODULES = [
  { to: '/icons', num: '01', title: 'Icons', sub: 'SVG icon library', icon: Hexagon, ac: 'var(--accent)' },
  { to: '/grids', num: '02', title: 'Grids', sub: 'Layout systems', icon: LayoutGrid, ac: 'var(--accent-2)' },
  { to: '/colors', num: '03', title: 'Colors', sub: 'Palette tokens', icon: Droplets, ac: 'var(--accent-3)' },
  { to: '/shadows', num: '04', title: 'Shadows', sub: 'Depth & elevation', icon: Layers, ac: 'var(--accent-4)' },
  { to: '/motion', num: '05', title: 'Motion', sub: 'Animation presets', icon: Zap, ac: 'var(--accent-5)' },
];

const FEATURES = [
  { icon: MousePointerClick, title: 'Copy-paste ready', desc: 'Every token and snippet is production-ready — drop it straight into your codebase.' },
  { icon: PaintBucket, title: 'Themeable by default', desc: 'Built on CSS variables so dark, light, or a fully custom brand theme just works.' },
  { icon: ShieldCheck, title: 'Accessible foundations', desc: 'Semantic markup, focus states, and contrast-aware color pairs out of the box.' },
];

const MARQUEE = ['Icons', 'Grids', 'Colors', 'Shadows', 'Motion', 'Tokens', 'Primitives', 'Components'];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={`${styles.orb} ${styles.orbA}`} />
        <div className={`${styles.orb} ${styles.orbB}`} />
        <div className="container">
          <div className={styles.heroInner}>
            {/* <span className="pill">v2.0 · Frontend Toolkit</span> */}
            <h1 className={styles.title} style={{ marginTop: 20 }}>
              {['Build.', 'Craft it.', 'Ship fast.'].map((line, i) => (
                <span className={styles.titleLine} key={line}>
                  <motion.span
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: .8, delay: .15 + i * .1, ease: [.16, 1, .3, 1] }}
                    className={i === 1 ? styles.accentWord : ''}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <div className={styles.heroFoot}>
              <div>
                <motion.p
                  className={styles.heroDesc}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .6, delay: .55 }}
                >
                  A curated set of frontend primitives — icons, grids, palettes, shadows, and motion presets. Everything you need to design refined interfaces, faster.
                </motion.p>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statN}><Counter to={5} /></span>
                    <span className={styles.statL}>Modules</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statN}><Counter to={120} suffix="+" /></span>
                    <span className={styles.statL}>Tokens</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statN}>&infin;</span>
                    <span className={styles.statL}>Combinations</span>
                  </div>
                </div>
              </div>
              <motion.div
                className={styles.heroActions}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .6, delay: .7 }}
              >
                <Link to="/icons" className="btn btn--primary">Explore kit <ArrowUpRight size={15} /></Link>
                <Link to="/motion" className="btn btn--ghost">See motion</Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* <div className={styles.scrollCue}>
          <span style={{ fontSize: 9, letterSpacing: '.2em', fontFamily: 'var(--font-mono)' }}>SCROLL</span>
          <span className={styles.scrollLine} />
          <ArrowDown size={12} />
        </div> */}
      </section>

      {/* MARQUEE */}
      {/* <div className={styles.marquee}>
        <div className={styles.marqueeTrack} aria-hidden="true">
          {[...Array(3)].flatMap(() => MARQUEE).map((w, i) => (
            <span key={i}>{w} <em>&middot;</em></span>
          ))}
        </div>
      </div> */}

      {/* MODULES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <Reveal as={motion.h2} className="section-title">Five modules. One design system.</Reveal>
            <Reveal delay={.1} as={motion.p} className="section-desc">
              Each module is a self-contained reference — browse, copy, and build. No dependencies between them.
            </Reveal>
          </div>

          <Reveal delay={.1}>
            <div className={styles.modules}>
              {MODULES.map((m, i) => (
                <ModuleCard key={m.to} {...m} index={i} />
              ))}
              <ComingSoonCard />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.features}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * .08} className={styles.feature}>
                <f.icon className={styles.featureIcon} size={22} />
                <div className={styles.featureTitle}>{f.title}</div>
                <p className={styles.featureDesc}>{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <Reveal className={styles.cta}>
            <h2 className={styles.ctaTitle}>Start crafting your next interface today.</h2>
            <p className={styles.ctaDesc}>Every token in this kit is free to use, remix, and ship in your own products.</p>
            <div className={styles.ctaActions}>
              <Link to="/icons" className="btn btn--primary">Browse the kit <ArrowUpRight size={15} /></Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn--ghost">View on GitHub</a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function ModuleCard({ to, num, title, sub, icon: Icon, ac, index }) {
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <Link
      to={to}
      className={styles.moduleCard}
      style={{ '--ac': ac }}
      onMouseMove={handleMove}
    >
      <span className={styles.moduleGlow} />
      <div className={styles.moduleTop}>
        <span className={styles.moduleNum}>{num}</span>
        <span className={styles.moduleIcon}><Icon size={18} /></span>
      </div>
      <div>
        <h3 className={styles.moduleTitle}>{title}</h3>
        <p className={styles.moduleSub}>{sub}</p>
        <span className={styles.moduleLink}>View module <ArrowUpRight size={13} /></span>
      </div>
    </Link>
  );
}

function ComingSoonCard() {
  return (
    <div className={styles.comingSoonCard}>
      <div className={styles.comingSoonContent}>
        <h3 className={styles.comingSoonTitle}>More modules</h3>
        <p className={styles.comingSoonText}>Coming soon</p>
      </div>
    </div>
  );
}
