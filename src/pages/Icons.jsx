import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Copy, ChevronDown } from 'lucide-react';
import PageHero from '../components/ui/PageHero.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useClipboard } from '../hooks/useClipboard.js';
import {
  resolveLibraries, getCollectionIcons, searchIcons, fetchSvg,
  CATEGORY_KEYWORDS, matchesCategory, UNAVAILABLE,
} from '../lib/icons.js';
import styles from './Icons.module.scss';

const CATEGORIES = ['All', ...Object.keys(CATEGORY_KEYWORDS)];
const PAGE_SIZE = 120;

export default function Icons() {
  const [libraries, setLibraries] = useState(null);
  const [library, setLibrary] = useState(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('All');
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState(null);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const { copy, copiedValue } = useClipboard();

  // Resolve the library catalog once against the live Iconify index.
  useEffect(() => {
    resolveLibraries().then(list => {
      setLibraries(list);
      if (list.length) setLibrary(list.find(l => l.key === 'lucide') || list[0]);
    });
  }, []);

  // Load icon names for the current library + query (search is server-side, browse is full list).
  useEffect(() => {
    if (!library) return;
    let cancelled = false;
    setLoading(true);
    setVisible(PAGE_SIZE);
    const q = query.trim();
    const task = q
      ? searchIcons(library.prefix, q, 500)
      : getCollectionIcons(library.prefix);
    task.then(list => { if (!cancelled) { setNames(list); setLoading(false); } });
    return () => { cancelled = true; };
  }, [library, query]);

  useEffect(() => { setVisible(PAGE_SIZE); }, [active]);

  const filtered = useMemo(
    () => names.filter(n => matchesCategory(n, active)),
    [names, active]
  );

  const shown = filtered.slice(0, visible);

  return (
    <div>
      <PageHero
        title="Icon Library"
        desc={`Browse ${libraries ? libraries.length : '40+'} open-source icon libraries — Font Awesome, Bootstrap, Lucide, Heroicons, Material Symbols, Tabler, Phosphor, and dozens more — all fetched on demand, so the page stays light no matter how many you browse.`}
        accent="var(--accent)"
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          {!libraries ? (
            <p className={styles.count}>Loading icon libraries…</p>
          ) : (
            <div className={styles.libTabs}>
              {libraries.map(lib => (
                <button
                  key={lib.key}
                  className={`${styles.libTab} ${library?.key === lib.key ? styles.libTabActive : ''}`}
                  onClick={() => { setLibrary(lib); setActive('All'); setQuery(''); }}
                >
                  {lib.label}
                </button>
              ))}
              <button className={styles.libTab} onClick={() => setShowUnavailable(v => !v)}>
                {UNAVAILABLE.length} not available <ChevronDown size={12} style={{ display: 'inline', verticalAlign: -2 }} />
              </button>
            </div>
          )}

          <AnimatePresence>
            {showUnavailable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: 16 }}
              >
                <div className={styles.unavailableBox}>
                  {UNAVAILABLE.map(u => (
                    <div key={u.label} className={styles.unavailableRow}>
                      <b>{u.label}</b> — {u.reason}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.toolbar}>
            <label className={styles.search}>
              <Search size={15} />
              <input
                type="text"
                placeholder={library ? `Search ${library.label} icons…` : 'Search icons…'}
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search icons"
              />
            </label>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.tabs}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`${styles.tab} ${active === cat ? styles.tabActive : ''}`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading || !library ? (
            <div className={styles.empty}>Loading {library?.label || ''} icons…</div>
          ) : (
            <>
              <p className={styles.count}>
                {filtered.length.toLocaleString()} icons {filtered.length > shown.length && `— showing ${shown.length.toLocaleString()}`}
              </p>

              {filtered.length === 0 ? (
                <div className={styles.empty}>No icons match “{query}”.</div>
              ) : (
                <>
                  <div className={styles.grid}>
                    {shown.map(name => (
                      <button
                        key={name}
                        className={styles.cell}
                        onClick={() => setSelected(name)}
                        title={name}
                      >
                        <span className={styles.cellIcon}>
                          <Icon icon={`${library.prefix}:${name}`} width={22} height={22} />
                        </span>
                        <span className={styles.cellName}>{name}</span>
                      </button>
                    ))}
                  </div>
                  {visible < filtered.length && (
                    <button className={styles.loadMore} onClick={() => setVisible(v => v + PAGE_SIZE)}>
                      Load {Math.min(PAGE_SIZE, filtered.length - visible).toLocaleString()} more
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      <IconDetailDrawer name={selected} library={library} onClose={() => setSelected(null)} copy={copy} />
      <Toast message={copiedValue} />
    </div>
  );
}

function IconDetailDrawer({ name, library, onClose, copy }) {
  const [size, setSize] = useState(48);
  const [svgMarkup, setSvgMarkup] = useState('');

  useEffect(() => {
    setSvgMarkup('');
    if (!name || !library) return;
    let cancelled = false;
    fetchSvg(library.prefix, name).then(svg => { if (!cancelled) setSvgMarkup(svg); });
    return () => { cancelled = true; };
  }, [name, library]);

  if (!name || !library) return null;

  const id = `${library.prefix}:${name}`;
  const importCode = `import { Icon } from '@iconify/react';`;
  const jsxCode = `<Icon icon="${id}" width={${size}} height={${size}} />`;
  const htmlTag = `<iconify-icon icon="${id}" width="${size}" height="${size}"></iconify-icon>`;
  const cdnScript = `<script src="https://code.iconify.design/iconify-icon/3.0.2/iconify-icon.min.js"></script>`;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className={styles.overlay}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: .25 }}
        onClick={onClose}
      />
      <motion.div
        key="drawer"
        className={styles.drawer}
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
      >
        <button className={styles.drawerClose} onClick={onClose} aria-label="Close"><X size={16} /></button>

        <div>
          <div className={styles.drawerStage}>
            <Icon icon={id} width={size} height={size} />
          </div>
          <div className={styles.drawerName}>{name}</div>
          <div className={styles.drawerMeta}>{library.label} &middot; {id}</div>
        </div>

        <div className={styles.sliderRow}>
          <span className={styles.sliderLabel}>Size <b>{size}px</b></span>
          <input type="range" min={16} max={128} value={size} onChange={e => setSize(Number(e.target.value))} />
        </div>

        <p className={styles.drawerNote}>
          Not using React? Use the CDN tag below — it works in any plain HTML page, WordPress, Vue, Svelte, anywhere. No build step, no npm install.
        </p>

        <div className={styles.snippetGroup}>
          <span className={styles.snippetLabel}>CDN script (add once per page)</span>
          <div className={styles.snippet}>
            <code className={styles.snippetCode}>{cdnScript}</code>
            <button className={styles.snippetCopy} onClick={() => copy(cdnScript, 'CDN script')}><Copy size={12} /></button>
          </div>
        </div>

        <div className={styles.snippetGroup}>
          <span className={styles.snippetLabel}>HTML tag</span>
          <div className={styles.snippet}>
            <code className={styles.snippetCode}>{htmlTag}</code>
            <button className={styles.snippetCopy} onClick={() => copy(htmlTag, 'HTML tag')}><Copy size={12} /></button>
          </div>
        </div>

        <div className={styles.snippetGroup}>
          <span className={styles.snippetLabel}>Copy as raw SVG</span>
          <div className={styles.snippet}>
            <code className={styles.snippetCode}>{svgMarkup ? svgMarkup.slice(0, 46) + '…' : 'Loading…'}</code>
            <button className={styles.snippetCopy} disabled={!svgMarkup} onClick={() => copy(svgMarkup, 'SVG')}><Copy size={12} /></button>
          </div>
        </div>

        <div className={styles.snippetGroup}>
          <span className={styles.snippetLabel}>React import</span>
          <div className={styles.snippet}>
            <code className={styles.snippetCode}>{importCode}</code>
            <button className={styles.snippetCopy} onClick={() => copy(importCode, 'Import')}><Copy size={12} /></button>
          </div>
        </div>

        <div className={styles.snippetGroup}>
          <span className={styles.snippetLabel}>JSX usage</span>
          <div className={styles.snippet}>
            <code className={styles.snippetCode}>{jsxCode}</code>
            <button className={styles.snippetCopy} onClick={() => copy(jsxCode, 'JSX')}><Copy size={12} /></button>
          </div>
        </div>

        <div className={styles.snippetGroup}>
          <span className={styles.snippetLabel}>Icon ID</span>
          <div className={styles.snippet}>
            <code className={styles.snippetCode}>{id}</code>
            <button className={styles.snippetCopy} onClick={() => copy(id, 'Icon ID')}><Copy size={12} /></button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}