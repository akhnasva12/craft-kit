import { motion } from 'framer-motion';
import styles from './PageHero.module.scss';

export default function PageHero({ title, desc, accent }) {
  return (
    <section className={styles.hero} style={{ '--ac': accent }}>
      <div className="container">
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7, ease: [.16, 1, .3, 1] }}
        >
          {title}
        </motion.h1>
        <motion.p
          className={styles.desc}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, delay: .12, ease: [.16, 1, .3, 1] }}
        >
          {desc}
        </motion.p>
      </div>
    </section>
  );
}
