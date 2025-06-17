import React from 'react';
import styles from './Loading.module.css';

/**
 * Loading
 * A reusable fancy spinner with optional text and configurable appearance.
 *
 * Props:
 * - text: string (optional) - label displayed beneath the spinner (default: "Loading...")
 * - size: number - diameter of the spinner in px (default: 48)
 * - thickness: number - border thickness in px (default: 6)
 * - color: string - spinner accent color (default: "#2bb3d2")
 * - trackColor: string - spinner track color (default: "#f0f0f0")
 * - speed: number - rotation duration in seconds (default: 1)
 * - className: string - optional wrapper className
 */
export default function Loading({
  text = 'Loading...',
  size = 48,
  thickness = 6,
  color = '#2bb3d2',
  trackColor = '#f0f0f0',
  speed = 1,
  className = '',
}) {
  const spinnerStyle = {
    width: size,
    height: size,
    borderWidth: thickness,
    borderColor: trackColor,
    borderTopColor: color,
    animationDuration: `${speed}s`,
  };

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      <div className={styles.spinner} style={spinnerStyle} />
      {text && <div className={styles.text}>{text}</div>}
    </div>
  );
}