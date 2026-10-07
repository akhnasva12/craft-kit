import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const COLS = [
  {
    title: 'Modules',
    links: [
      { to: '/icons', label: 'Icons' },
      { to: '/grids', label: 'Grids' },
      { to: '/colors', label: 'Colors' },
      { to: '/shadows', label: 'Shadows' },
      { to: '/motion', label: 'Motion' },
    ],
  },
  {
    title: 'Product',
    links: [
      { to: '/', label: 'Overview' },
      { to: '/', label: 'Changelog' },
      { to: '/', label: 'Docs' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/', label: 'About' },
      { to: '/', label: 'Careers' },
      { to: '/', label: 'Contact' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <h2 className={styles.big}>Let's build<br />something crafted.</h2>
          <div className={styles.cols}>
            {COLS.map(col => (
              <div key={col.title}>
                <span className={styles.colTitle}>{col.title}</span>
                {col.links.map((l, i) => (
                  <Link key={i} to={l.to} className={styles.colLink}>{l.label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.bottom}>
          <span><span className={styles.pulse} />Craft Kit &copy; {year} — All systems ready</span>
        </div>
      </div>
    </footer>
  );
}
