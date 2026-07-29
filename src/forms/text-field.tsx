import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { CONTROL_BASE, controlBorder, Field } from './field'

export type TextFieldProps = ComponentPropsWithRef<'input'> & {
  label: string
  description?: ReactNode
  error?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
}

const SLOT = 'absolute inset-y-0 flex w-9 items-center justify-center text-tertiary'

export function TextField({
  label,
  description,
  error,
  leading,
  trailing,
  className,
  ...rest
}: TextFieldProps) {
  return (
    <Field label={label} description={description} error={error} required={rest.required}>
      {({ id, describedBy, errorId, invalid }) => (
        <div className="relative">
          {leading && <span className={cn(SLOT, 'left-0')}>{leading}</span>}
          <input
            {...rest}
            id={id}
            aria-describedby={describedBy}
            aria-errormessage={errorId}
            aria-invalid={invalid || undefined}
            className={cn(
              CONTROL_BASE,
              controlBorder(invalid),
              'h-10',
              leading ? 'pl-9' : 'pl-3',
              trailing ? 'pr-9' : 'pr-3',
              className,
            )}
          />
          {trailing && <span className={cn(SLOT, 'right-0')}>{trailing}</span>}
        </div>
      )}
    </Field>
  )
}
