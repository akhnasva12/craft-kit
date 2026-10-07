import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { animate } from 'framer-motion';

export default function Counter({ to, suffix = '', duration = 1.4, className }) {
  const nodeRef = useRef(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: .5 });

  useEffect(() => {
    if (!inView || !nodeRef.current) return;
    const controls = animate(0, to, {
      duration,
      ease: [.16, 1, .3, 1],
      onUpdate(value) {
        if (nodeRef.current) nodeRef.current.textContent = Math.round(value) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, duration]);

  return <span ref={el => { ref(el); nodeRef.current = el; }} className={className}>0{suffix}</span>;
}
