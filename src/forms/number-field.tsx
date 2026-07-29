import { useState } from 'react'
import { Minus, Plus } from '../icons'
import { cn } from '../lib/cn'
import { useControllable } from '../lib/use-controllable'
import { IconButton } from '../primitives'
import { TextField, type TextFieldProps } from './text-field'

export type NumberFieldProps = Omit<
  TextFieldProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'leading'
  | 'trailing'
  | 'min'
  | 'max'
  | 'step'
  | 'type'
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export function NumberField({
  label,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  disabled,
  className,
  ...rest
}: NumberFieldProps) {
  const [current, setCurrent] = useControllable<number>(
    value,
    defaultValue ?? min ?? 0,
    onValueChange,
  )

  /* The draft keeps in-progress text such as "0." or "-" alive, but only while it
     still describes `current`. A value the parent refused, or one clamping
     corrected, leaves it stale and the resolved number wins. */
  const [draft, setDraft] = useState<{ text: string; value: number } | null>(null)

  const commit = (next: number) => {
    const bounded = Math.min(
      max ?? Number.POSITIVE_INFINITY,
      Math.max(min ?? Number.NEGATIVE_INFINITY, next),
    )
    setCurrent(bounded)
    return bounded
  }

  const nudge = (direction: 1 | -1) => {
    setDraft(null)
    /* Rounding to the step's own precision stops repeated 0.1 steps from
       drifting into 0.30000000000000004. */
    const decimals = (String(step).split('.')[1] ?? '').length
    commit(Number((current + direction * step).toFixed(decimals)))
  }

  return (
    <TextField
      {...rest}
      label={label}
      disabled={disabled}
      role="spinbutton"
      inputMode="numeric"
      autoComplete="off"
      aria-valuenow={current}
      aria-valuemin={min}
      aria-valuemax={max}
      value={draft?.value === current ? draft.text : String(current)}
      onChange={(event) => {
        const raw = event.target.value
        const parsed = Number(raw)
        if (raw.trim() === '' || Number.isNaN(parsed)) {
          setDraft({ text: raw, value: current })
          return
        }
        const resolved = commit(parsed)
        setDraft(resolved === parsed ? { text: raw, value: resolved } : null)
      }}
      onBlur={(event) => {
        setDraft(null)
        rest.onBlur?.(event)
      }}
      onKeyDown={(event) => {
        rest.onKeyDown?.(event)
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          nudge(1)
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          nudge(-1)
        }
      }}
      leading={
        <IconButton
          type="button"
          aria-label={`Decrease ${label}`}
          variant="ghost"
          size="sm"
          className="text-sans-16"
          disabled={disabled || current <= (min ?? Number.NEGATIVE_INFINITY)}
          onClick={() => nudge(-1)}
        >
          <Minus />
        </IconButton>
      }
      trailing={
        <IconButton
          type="button"
          aria-label={`Increase ${label}`}
          variant="ghost"
          size="sm"
          className="text-sans-16"
          disabled={disabled || current >= (max ?? Number.POSITIVE_INFINITY)}
          onClick={() => nudge(1)}
        >
          <Plus />
        </IconButton>
      }
      className={cn('text-center', className)}
    />
  )
}
