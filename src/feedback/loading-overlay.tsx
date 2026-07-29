import { motion, useReducedMotion } from 'motion/react'
import { cn } from '../lib/cn'
import { Spinner } from '../primitives'

export type LoadingOverlayProps = {
  active: boolean
  label?: string
  className?: string
}

export function LoadingOverlay({
  active,
  label = 'Loading',
  className,
}: LoadingOverlayProps) {
  const reduced = useReducedMotion()

  if (!active) return null

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center bg-scrim',
        className,
      )}
      initial={{ opacity: reduced ? 1 : 0 }}
      // The covered container is our parent, and `active` is the only prop
      // describing it, so busy state is written there and restored verbatim —
      // a host managing its own `aria-busy` must get its value back.
      ref={(node) => {
        const host = node?.parentElement
        if (!host) return
        const previous = host.getAttribute('aria-busy')
        host.setAttribute('aria-busy', 'true')
        return () => {
          if (previous === null) host.removeAttribute('aria-busy')
          else host.setAttribute('aria-busy', previous)
        }
      }}
      transition={{ duration: reduced ? 0 : 0.15 }}
    >
      <Spinner className="text-secondary" label={label} size="lg" />
    </motion.div>
  )
}
