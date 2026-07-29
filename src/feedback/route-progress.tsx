import { motion, type TargetAndTransition, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'

export type RouteProgressProps = {
  active: boolean
  className?: string
}

/** `done` exists so deactivating runs the bar out to full width before it fades;
 *  it is never entered from a cold mount, which would announce a load that
 *  never happened. */
type Phase = 'idle' | 'loading' | 'done'

const TRAVEL: Record<Phase, TargetAndTransition> = {
  idle: { scaleX: 0, opacity: 0, transition: { duration: 0 } },
  loading: {
    scaleX: 0.45,
    opacity: 1,
    transition: {
      scaleX: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.1 },
    },
  },
  done: {
    scaleX: 1,
    opacity: 0,
    transition: {
      scaleX: { duration: 0.2, ease: 'easeOut' },
      opacity: { duration: 0.25, delay: 0.2 },
    },
  },
}

/** Reduced motion holds the bar at full width and pulses it, so the eye is never
 *  dragged across the viewport. */
const PULSE: Record<Phase, TargetAndTransition> = {
  idle: { scaleX: 1, opacity: 0, transition: { duration: 0 } },
  loading: {
    scaleX: 1,
    opacity: [0.25, 1],
    transition: {
      duration: 1,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: 'reverse',
    },
  },
  done: { scaleX: 1, opacity: 0, transition: { duration: 0.2 } },
}

const ANNOUNCEMENT: Record<Phase, string> = {
  idle: '',
  loading: 'Loading page',
  done: 'Page loaded',
}

export function RouteProgress({ active, className }: RouteProgressProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const reduced = useReducedMotion()

  useEffect(() => {
    setPhase((current) => (active ? 'loading' : current === 'loading' ? 'done' : current))
  }, [active])

  return (
    <>
      <motion.div
        animate={(reduced ? PULSE : TRAVEL)[phase]}
        aria-hidden
        className={cn(
          'pointer-events-none fixed top-0 left-0 z-[var(--z-toast)] h-0.5 w-full origin-left transform-gpu bg-accent-inverse',
          className,
        )}
        data-phase={phase}
        initial={false}
      />
      <span aria-live="polite" className="sr-only">
        {ANNOUNCEMENT[phase]}
      </span>
    </>
  )
}
