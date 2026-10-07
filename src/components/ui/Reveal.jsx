import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Reveal({ children, delay = 0, y = 28, once = true, className, as: As = motion.div, ...rest }) {
  const [ref, inView] = useInView({ triggerOnce: once, threshold: .15 });

  return (
    <As
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .7, delay, ease: [.16, 1, .3, 1] }}
      {...rest}
    >
      {children}
    </As>
  );
}
