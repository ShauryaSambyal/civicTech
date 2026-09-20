import React from 'react';
import { useMagnetic } from '../hooks/useMotion';

/**
 * Wraps a control so it drifts a few pixels toward the pointer. Silently inert
 * on touch devices and under reduced motion.
 */
export default function Magnetic({ as, strength = 6, style, children, ...rest }) {
  const ref = useMagnetic(strength);
  const Tag = as || 'div';

  return (
    <Tag ref={ref} style={{ willChange: 'transform', ...style }} {...rest}>
      {children}
    </Tag>
  );
}
