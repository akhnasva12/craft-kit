import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, ease: [.16, 1, .3, 1] }}
        >
          <span className="eyebrow">Error 404</span>
          <h1 style={{ fontSize: 'clamp(60px, 14vw, 180px)', lineHeight: .9, margin: '16px 0' }}>Lost.</h1>
          <p style={{ color: 'var(--text-dim)', maxWidth: 380, margin: '0 auto 32px', fontWeight: 300 }}>
            The page you're looking for doesn't exist, or it wandered off somewhere else in the kit.
          </p>
          <Link to="/" className="btn btn--primary"><ArrowLeft size={15} /> Back home</Link>
        </motion.div>
      </div>
    </section>
  );
}
