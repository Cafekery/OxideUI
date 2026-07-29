import { useEffect, useState } from 'react'
import { Check, Copy } from '../icons'
import { IconButton, type IconButtonProps } from './button'

export type CopyButtonProps = Omit<
  IconButtonProps,
  'aria-label' | 'children' | 'onClick'
> & {
  value: string
  label?: string
  copiedLabel?: string
}

export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  ...rest
}: CopyButtonProps) {
  /** A timestamp rather than a flag so copying again mid-flash restarts the
   *  countdown instead of inheriting the tail of the previous one. */
  const [copiedAt, setCopiedAt] = useState(0)
  const copied = copiedAt !== 0

  useEffect(() => {
    if (copiedAt === 0) return
    const timer = setTimeout(() => setCopiedAt(0), 1500)
    return () => clearTimeout(timer)
  }, [copiedAt])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
    setCopiedAt(Date.now())
  }

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        {...rest}
        aria-label={copied ? copiedLabel : label}
        onClick={() => void copy()}
      >
        {copied ? (
          <span className="text-accent">
            <Check />
          </span>
        ) : (
          <Copy />
        )}
      </IconButton>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ''}
      </span>
    </>
  )
}
