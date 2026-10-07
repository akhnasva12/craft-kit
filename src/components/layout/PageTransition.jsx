import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: .6, ease: [.16, 1, .3, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: .35, ease: [.7, 0, .84, 0] } },
};

export default function PageTransition({ children }) {
  return (
    <motion.main
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.main>
  );
}
