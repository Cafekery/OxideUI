import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { CONTROL_BASE, controlBorder, Field } from './field'

export type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  label: string
  description?: ReactNode
  error?: ReactNode
}

export function Textarea({
  label,
  description,
  error,
  className,
  rows = 4,
  ...rest
}: TextareaProps) {
  return (
    <Field label={label} description={description} error={error} required={rest.required}>
      {({ id, describedBy, errorId, invalid }) => (
        <textarea
          {...rest}
          id={id}
          rows={rows}
          aria-describedby={describedBy}
          aria-errormessage={errorId}
          aria-invalid={invalid || undefined}
          className={cn(
            CONTROL_BASE,
            controlBorder(invalid),
            'min-h-20 resize-y scroll-thin px-3 py-2',
            className,
          )}
        />
      )}
    </Field>
  )
}
