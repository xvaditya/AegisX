/* ── AegisMascot — Animated SVG Mascot ── */

import { motion, AnimatePresence } from 'framer-motion';
import type { MascotState } from '../../types';
import { MASCOT_STATE_CONFIGS } from './MascotStates';
import styles from './mascot.module.css';

interface AegisMascotProps {
  state: MascotState;
  size?: number;
  showLabel?: boolean;
}

export function AegisMascot({ state, size = 120, showLabel = true }: AegisMascotProps) {
  const config = MASCOT_STATE_CONFIGS[state];
  const stateClass = `state${state.charAt(0).toUpperCase() + state.slice(1)}` as keyof typeof styles;

  return (
    <div className={styles.mascotContainer} style={{ width: size, position: 'relative' }}>
      <div className={styles[stateClass] || ''}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glow circle */}
          <motion.circle
            cx="60"
            cy="68"
            r="45"
            fill={config.glowColor}
            animate={{ r: [43, 47, 43] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Sprout stem */}
          <motion.path
            d="M60 35 Q58 25 55 18"
            stroke={config.sproutColor}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            animate={{ d: ['M60 35 Q58 25 55 18', 'M60 35 Q62 25 65 18', 'M60 35 Q58 25 55 18'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Sprout leaves */}
          <motion.ellipse
            cx="52"
            cy="16"
            rx="8"
            ry="5"
            fill={config.sproutColor}
            transform="rotate(-30 52 16)"
            animate={{ rotate: [-30, -25, -30] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.ellipse
            cx="62"
            cy="14"
            rx="7"
            ry="4.5"
            fill={config.sproutColor}
            opacity={0.8}
            transform="rotate(20 62 14)"
            animate={{ rotate: [20, 25, 20] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />

          {/* Body — rock shape */}
          <motion.path
            d="M25 75 Q20 55 30 42 Q40 30 60 30 Q80 30 90 42 Q100 55 95 75 Q90 95 60 98 Q30 95 25 75Z"
            fill={config.bodyColor}
            stroke={config.sproutColor}
            strokeWidth="1.5"
            strokeOpacity={0.3}
            animate={{
              fill: config.bodyColor,
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Body texture lines */}
          <path d="M35 60 Q40 58 45 62" stroke="#6b728050" strokeWidth="1" fill="none" />
          <path d="M75 55 Q80 58 82 65" stroke="#6b728050" strokeWidth="1" fill="none" />
          <path d="M50 80 Q55 82 62 80" stroke="#6b728050" strokeWidth="1" fill="none" />

          {/* Left eye */}
          {config.expression === 'sleeping' ? (
            <path d="M42 58 Q47 62 52 58" stroke={config.eyeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <motion.ellipse
              cx="47"
              cy="58"
              rx={config.expression === 'alert' ? 5.5 : 4.5}
              ry={config.expression === 'alert' ? 6.5 : 5}
              fill={config.eyeColor}
              animate={
                config.expression === 'excited'
                  ? { ry: [5, 5, 1, 5], scaleY: [1, 1, 0.2, 1] }
                  : { ry: [5, 5, 1, 5] }
              }
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
            />
          )}

          {/* Right eye */}
          {config.expression === 'sleeping' ? (
            <path d="M68 58 Q73 62 78 58" stroke={config.eyeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <motion.ellipse
              cx="73"
              cy="58"
              rx={config.expression === 'alert' ? 5.5 : 4.5}
              ry={config.expression === 'alert' ? 6.5 : 5}
              fill={config.eyeColor}
              animate={
                config.expression === 'excited'
                  ? { ry: [5, 5, 1, 5], scaleY: [1, 1, 0.2, 1] }
                  : { ry: [5, 5, 1, 5] }
              }
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1], delay: 0.1 }}
            />
          )}

          {/* Eye pupils (when not sleeping) */}
          {config.expression !== 'sleeping' && (
            <>
              <motion.circle
                cx="47"
                cy="58"
                r="2"
                fill="#1f2937"
                animate={
                  state === 'scanning'
                    ? { cx: [45, 49, 45] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle
                cx="73"
                cy="58"
                r="2"
                fill="#1f2937"
                animate={
                  state === 'scanning'
                    ? { cx: [71, 75, 71] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              />
            </>
          )}

          {/* Mouth */}
          {config.expression === 'happy' || config.expression === 'excited' ? (
            <path d="M52 72 Q60 80 68 72" stroke={config.eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : config.expression === 'worried' ? (
            <path d="M52 74 Q60 70 68 74" stroke={config.eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : config.expression === 'alert' ? (
            <ellipse cx="60" cy="74" rx="5" ry="4" fill={config.eyeColor} opacity={0.6} />
          ) : config.expression === 'sleeping' ? (
            <path d="M55 72 Q60 74 65 72" stroke={config.eyeColor} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.5} />
          ) : (
            <path d="M53 72 Q60 76 67 72" stroke={config.eyeColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          )}

          {/* Cheek blush for happy states */}
          {(config.expression === 'happy' || config.expression === 'excited') && (
            <>
              <circle cx="37" cy="68" r="5" fill="#f87171" opacity={0.2} />
              <circle cx="83" cy="68" r="5" fill="#f87171" opacity={0.2} />
            </>
          )}

          {/* Exclamation for alert */}
          {state === 'alert' && (
            <motion.text
              x="92"
              y="35"
              fontSize="18"
              fill="#f97316"
              fontWeight="bold"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              !
            </motion.text>
          )}

          {/* Double exclamation for critical */}
          {state === 'critical' && (
            <motion.text
              x="88"
              y="32"
              fontSize="20"
              fill="#ef4444"
              fontWeight="bold"
              animate={{ opacity: [1, 0, 1], y: [32, 28, 32] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              !!
            </motion.text>
          )}
        </svg>

        {/* Zzz for sleeping */}
        {state === 'sleeping' && (
          <>
            <span className={styles.zzz}>z</span>
            <span className={styles.zzz}>z</span>
            <span className={styles.zzz}>z</span>
          </>
        )}

        {/* Stars for success */}
        {state === 'success' && (
          <>
            <span className={styles.stars} style={{ top: -5, left: 5, animationDelay: '0s' }}>✨</span>
            <span className={styles.stars} style={{ top: 0, right: 5, animationDelay: '0.3s' }}>⭐</span>
            <span className={styles.stars} style={{ top: -10, left: '50%', animationDelay: '0.6s' }}>✨</span>
          </>
        )}
      </div>

      {/* State label */}
      <AnimatePresence mode="wait">
        {showLabel && (
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            style={{
              position: 'absolute',
              bottom: -24,
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              fontSize: 11,
              color: config.sproutColor,
              fontWeight: 500,
            }}
          >
            {config.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
