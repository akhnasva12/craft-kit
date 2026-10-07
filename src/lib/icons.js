/**
 * Icon browsing is backed by the Iconify API (api.iconify.design), which hosts
 * ~150 open-source icon sets (Font Awesome, Bootstrap, Lucide, Heroicons,
 * Material Symbols, Tabler, Phosphor, and dozens more) under one interface.
 * Icons are fetched on demand and cached — nothing is bundled into the app,
 * which keeps the JS payload small no matter how many libraries are offered.
 */

const API = 'https://api.iconify.design';

// Requested library -> candidate Iconify prefixes, tried in order until one exists.
const CANDIDATES = [
  { label: 'Font Awesome', guesses: ['fa6-solid', 'fa-solid'] },
  { label: 'Bootstrap Icons', guesses: ['bi'] },
  { label: 'Lucide', guesses: ['lucide'] },
  { label: 'Heroicons', guesses: ['heroicons'] },
  { label: 'Material Icons', guesses: ['ic'] },
  { label: 'Material Symbols', guesses: ['material-symbols'] },
  { label: 'Ionicons', guesses: ['ion'] },
  { label: 'Remix Icon', guesses: ['ri'] },
  { label: 'Tabler Icons', guesses: ['tabler'] },
  { label: 'Feather Icons', guesses: ['feather'] },
  { label: 'Phosphor Icons', guesses: ['ph'] },
  { label: 'Boxicons', guesses: ['bx', 'boxicons'] },
  { label: 'Eva Icons', guesses: ['eva'] },
  { label: 'Line Awesome', guesses: ['la', 'line-awesome'] },
  { label: 'Themify Icons', guesses: ['themify'] },
  { label: 'Simple Line Icons', guesses: ['simple-line-icons'] },
  { label: 'Typicons', guesses: ['typcn'] },
  { label: 'Octicons', guesses: ['octicon'] },
  { label: 'Zondicons', guesses: ['zondicons'] },
  { label: 'CSS.gg', guesses: ['gg', 'css-gg'] },
  { label: 'Iconoir', guesses: ['iconoir'] },
  { label: 'Radix Icons', guesses: ['radix-icons'] },
  { label: 'Fluent UI System Icons', guesses: ['fluent'] },
  { label: 'Carbon Icons', guesses: ['carbon'] },
  { label: 'Ant Design Icons', guesses: ['ant-design'] },
  { label: 'Clarity Icons', guesses: ['clarity'] },
  { label: 'CoreUI Icons', guesses: ['coreui', 'cil'] },
  { label: 'IconPark', guesses: ['icon-park-outline', 'icon-park'] },
  { label: 'Streamline Icons', guesses: ['streamline'] },
  { label: 'Unicons', guesses: ['uil'] },
  { label: 'IcoMoon', guesses: ['icomoon-free'] },
  { label: 'Solar Icons', guesses: ['solar'] },
  { label: 'Devicon', guesses: ['devicon'] },
  { label: 'Simple Icons', guesses: ['simple-icons'] },
  { label: 'VS Code Codicons', guesses: ['codicon'] },
  { label: 'Academicons', guesses: ['academicons'] },
  { label: 'Flag Icons', guesses: ['flag', 'circle-flags'] },
  { label: 'Weather Icons', guesses: ['wi'] },
  { label: 'Open Iconic', guesses: ['open-iconic'] },
  { label: 'Jam Icons', guesses: ['jam'] },
  { label: 'Material Design Icons (MDI)', guesses: ['mdi'] },
  { label: 'Pixelarticons', guesses: ['pixelarticons'] },
  { label: 'MingCute Icons', guesses: ['mingcute'] },
  { label: 'Hugeicons', guesses: ['hugeicons'] },
];

// These are marketplaces, animation formats, or commercial sets with no open
// static-SVG collection on Iconify — listed honestly rather than faked.
export const UNAVAILABLE = [
  { label: 'Lordicon', reason: 'Animated Lottie icons, not static SVG — different technology entirely.' },
  { label: 'Lottie Icons', reason: 'Animated JSON format, not static SVG.' },
  { label: 'IconScout', reason: 'A marketplace aggregating many paid + free sets, not a single icon set.' },
  { label: 'SVG Repo', reason: 'A search engine over other icon sets, not its own set.' },
  { label: 'SVG Box', reason: 'A search engine over other icon sets, not its own set.' },
  { label: 'Iconduck', reason: 'A search engine over other icon sets (itself built on Iconify).' },
  { label: 'Nucleo Icons', reason: 'Commercial, closed-license icon set.' },
  { label: 'Iconsax', reason: 'Commercial, closed-license icon set.' },
  { label: 'Chakra Icons', reason: 'Chakra UI does not ship its own icon set.' },
  { label: 'PaymentFont', reason: 'Not published as an open icon set.' },
];

let resolvedPromise = null;

/** Fetches the Iconify collections index once, matches each candidate to a real prefix. */
export function resolveLibraries() {
  if (resolvedPromise) return resolvedPromise;
  resolvedPromise = fetch(`${API}/collections`)
    .then(r => r.json())
    .then(collections => {
      const resolved = [];
      for (const { label, guesses } of CANDIDATES) {
        const prefix = guesses.find(g => collections[g]);
        if (!prefix) continue;
        const info = collections[prefix];
        resolved.push({ key: prefix, label, prefix, total: info.total, title: info.name });
      }
      return resolved;
    })
    .catch(() => []);
  return resolvedPromise;
}

const collectionCache = {};

/** Fetches the full icon name list for a prefix (lightweight — names only, no SVG data). */
export async function getCollectionIcons(prefix) {
  if (collectionCache[prefix]) return collectionCache[prefix];
  const res = await fetch(`${API}/collection?prefix=${prefix}`);
  const data = await res.json();
  const names = new Set(data.uncategorized || []);
  if (data.categories) {
    for (const list of Object.values(data.categories)) list.forEach(n => names.add(n));
  }
  const list = [...names].sort();
  collectionCache[prefix] = list;
  return list;
}

export function iconifyId(prefix, name) {
  return `${prefix}:${name}`;
}

export function svgUrl(prefix, name) {
  return `${API}/${prefix}/${name}.svg`;
}

export async function fetchSvg(prefix, name) {
  const res = await fetch(svgUrl(prefix, name));
  return res.text();
}

/** Server-side search within one icon set — much lighter than fetching a full huge collection. */
export async function searchIcons(prefix, query, limit = 300) {
  const res = await fetch(`${API}/search?query=${encodeURIComponent(query)}&prefix=${prefix}&limit=${limit}`);
  const data = await res.json();
  return (data.icons || []).map(id => id.split(':')[1]);
}

export const CATEGORY_KEYWORDS = {
  Arrows: ['arrow', 'chevron', 'caret', 'corner'],
  Interface: ['menu', 'setting', 'filter', 'grid', 'layout', 'slider', 'toggle', 'list', 'square', 'circle', 'plus', 'minus', 'check'],
  Files: ['file', 'folder', 'document', 'clipboard', 'archive', 'save', 'download', 'upload'],
  Users: ['user', 'person', 'people', 'account', 'contact'],
  Communication: ['mail', 'message', 'chat', 'send', 'phone', 'bell', 'inbox'],
  Media: ['play', 'pause', 'music', 'video', 'camera', 'image', 'film', 'mic', 'volume', 'headphone'],
  Alerts: ['alert', 'warning', 'info', 'shield', 'error', 'exclamation'],
  Charts: ['chart', 'bar', 'trending', 'pie', 'activity', 'graph'],
  Weather: ['cloud', 'sun', 'moon', 'rain', 'snow', 'wind', 'thermometer', 'umbrella'],
  Devices: ['laptop', 'monitor', 'tablet', 'watch', 'printer', 'battery', 'wifi', 'bluetooth', 'cpu', 'server'],
  Commerce: ['cart', 'shop', 'credit-card', 'wallet', 'tag', 'gift', 'dollar', 'percent', 'coin', 'receipt'],
  Brands: ['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'google', 'youtube', 'apple', 'spotify', 'discord', 'slack', 'figma'],
};

export function matchesCategory(name, category) {
  if (category === 'All') return true;
  const terms = CATEGORY_KEYWORDS[category] || [];
  return terms.some(term => name.includes(term));
}