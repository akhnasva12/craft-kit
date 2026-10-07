import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import styles from './Navbar.module.scss';

const NAV_ITEMS = [
  { to: '/icons', label: 'Icons', num: '01' },
  { to: '/grids', label: 'Grids', num: '02' },
  { to: '/colors', label: 'Colors', num: '03' },
  { to: '/shadows', label: 'Shadows', num: '04' },
  { to: '/motion', label: 'Motion', num: '05' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
            <span className={styles.logoMark}>CRAFT</span>
            <span className={styles.logoRest}>/ KIT</span>
          </Link>

          <nav className={styles.links} aria-label="Primary">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle color theme">
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <button
              className={`${styles.iconBtn} ${styles.menuBtn}`}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobilePanel}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: .55, ease: [.16, 1, .3, 1] }}
          >
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .1 + i * .06, duration: .5, ease: [.16, 1, .3, 1] }}
              >
                <NavLink to={item.to} className={styles.mobileLink} onClick={() => setOpen(false)}>
                  <span>{item.label}</span>
                  <span>{item.num} <ArrowUpRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></span>
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
