import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: .3, ease: [.16, 1, .3, 1] }}
          style={{
            position: 'fixed', left: '50%', bottom: 28, zIndex: 900,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 999,
            background: 'var(--text)', color: 'var(--bg)',
            fontFamily: 'DM Mono, monospace', fontSize: 12,
          }}
        >
          <Check size={14} /> {message} copied
        </motion.div>
      )}
    </AnimatePresence>
  );
}