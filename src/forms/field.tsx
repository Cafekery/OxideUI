import { Label } from 'radix-ui'
import { type ReactNode, useId } from 'react'
import { cn } from '../lib/cn'

export type FieldControl = {
  id: string
  labelId: string
  descriptionId: string | undefined
  errorId: string | undefined
  describedBy: string | undefined
  invalid: boolean
}

export type FieldProps = {
  label: string
  description?: ReactNode
  error?: ReactNode
  required?: boolean
  /** Composite controls (radiogroup, listbox) are named with `aria-labelledby`,
   *  because `htmlFor` only associates with labelable elements. */
  group?: boolean
  className?: string
  children: (control: FieldControl) => ReactNode
}

export const CONTROL_BASE =
  'w-full rounded-lg border bg-default text-sans-14 text-default transition-colors placeholder:text-quaternary focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled'

export const controlBorder = (invalid?: boolean) =>
  invalid ? 'border-error' : 'border-default enabled:hover:border-raise'

export function useFieldIds(description?: ReactNode, error?: ReactNode): FieldControl {
  const uid = useId()
  const descriptionId = description ? `${uid}-description` : undefined
  const errorId = error ? `${uid}-error` : undefined

  /* The error is referenced twice on purpose: `aria-errormessage` is the precise
     mapping but support is uneven, so `aria-describedby` guarantees it is read. */
  return {
    id: `${uid}-control`,
    labelId: `${uid}-label`,
    descriptionId,
    errorId,
    describedBy: [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
    invalid: Boolean(error),
  }
}

export function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-error">
      *
    </span>
  )
}

export function FieldDescription({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <span id={id} className="text-sans-12 text-tertiary">
      {children}
    </span>
  )
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <span id={id} className="text-sans-12 text-error">
      {children}
    </span>
  )
}

export function Field({
  label,
  description,
  error,
  required,
  group,
  className,
  children,
}: FieldProps) {
  const control = useFieldIds(description, error)
  const heading = 'text-mono-sm text-default'

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <div className="flex items-center gap-1">
        {group ? (
          <span id={control.labelId} className={heading}>
            {label}
          </span>
        ) : (
          <Label.Root id={control.labelId} htmlFor={control.id} className={heading}>
            {label}
          </Label.Root>
        )}
        {required && <RequiredMark />}
      </div>
      {description && (
        <FieldDescription id={control.descriptionId}>{description}</FieldDescription>
      )}
      {children(control)}
      {error && <FieldError id={control.errorId}>{error}</FieldError>}
    </div>
  )
}
