import { Switch as SwitchPrimitive } from 'radix-ui'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { InlineField } from './field'

export type SwitchProps = Omit<
  ComponentPropsWithRef<typeof SwitchPrimitive.Root>,
  'children' | 'asChild'
> & {
  label: ReactNode
  description?: ReactNode
  error?: ReactNode
}

const TRACK =
  'flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed'

export function Switch({
  label,
  description,
  error,
  disabled,
  className,
  ...rest
}: SwitchProps) {
  return (
    <InlineField
      label={label}
      description={description}
      error={error}
      required={rest.required}
      disabled={disabled}
      indent="pl-11"
    >
      {({ id, describedBy, errorId, invalid }) => (
        <SwitchPrimitive.Root
          {...rest}
          id={id}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-errormessage={errorId}
          aria-invalid={invalid || undefined}
          className={cn(
            TRACK,
            disabled
              ? 'bg-disabled'
              : 'data-[state=unchecked]:bg-tertiary data-[state=checked]:bg-accent-inverse',
            invalid && 'ring-2 ring-error',
            className,
          )}
        >
          <SwitchPrimitive.Thumb className="ml-0.5 block h-4 w-4 rounded-full bg-inverse transition-transform data-[state=checked]:translate-x-4" />
        </SwitchPrimitive.Root>
      )}
    </InlineField>
  )
}
