import styles from './BlockPreview.module.scss';

export default function BlockPreview({ type }) {
  switch (type) {
    case 'card':
      return (
        <div className={styles.card}>
          <div className={styles.cardTitle}>Card Title</div>
          <div className={styles.cardBody}>Supporting copy for this card goes here.</div>
        </div>
      );
    case 'navbar':
      return (
        <div className={styles.navbar}>
          <span className={styles.navbarBrand}>Brand</span>
          <div className={styles.navbarLinks}><span>Home</span><span>About</span><span>Services</span></div>
          <span className={styles.navbarBtn}>Sign In</span>
        </div>
      );
    case 'hero':
      return (
        <div className={styles.hero}>
          <div className={styles.heroTitle}>Build Faster</div>
          <p className={styles.heroDesc}>The layout playground for frontend developers.</p>
          <span className={styles.heroBtn}>Get Started</span>
        </div>
      );
    case 'sidebar':
      return (
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Menu</div>
          <div className={`${styles.sidebarItem} ${styles.sidebarItemActive}`}>Dashboard</div>
          <div className={styles.sidebarItem}>Analytics</div>
          <div className={styles.sidebarItem}>Reports</div>
          <div className={styles.sidebarItem}>Settings</div>
        </div>
      );
    case 'stat':
      return (
        <div className={styles.stat}>
          <div className={styles.statNum}>1,284</div>
          <div className={styles.statLabel}>Monthly Visitors</div>
        </div>
      );
    case 'table':
      return (
        <div className={styles.table}>
          <div className={`${styles.tableRow} ${styles.tableHead}`}><span>Name</span><span>Status</span><span>Role</span></div>
          <div className={styles.tableRow}><span>Alice Johnson</span><span className={styles.badge}>Active</span><span>Developer</span></div>
          <div className={styles.tableRow}><span>Bob Chen</span><span className={styles.badge}>Online</span><span>Designer</span></div>
        </div>
      );
    case 'form':
      return (
        <div className={styles.form}>
          <div className={styles.formTitle}>Contact Form</div>
          <div className={styles.formInput} />
          <div className={styles.formInput} />
          <div className={styles.formBtn}>Send Message</div>
        </div>
      );
    case 'image':
      return <div className={styles.image}>🖼</div>;
    case 'button':
      return (
        <div className={styles.buttonRow}>
          <span className={styles.btnPrimary}>Primary</span>
          <span className={styles.btnGhost}>Secondary</span>
        </div>
      );
    default:
      return null;
  }
}
