import { Label, Switch as SwitchPrimitive } from 'radix-ui'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { FieldDescription, FieldError, RequiredMark, useFieldIds } from './field'

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
  const control = useFieldIds(description, error)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <SwitchPrimitive.Root
          {...rest}
          id={control.id}
          disabled={disabled}
          aria-describedby={control.describedBy}
          aria-errormessage={control.errorId}
          aria-invalid={control.invalid || undefined}
          className={cn(
            TRACK,
            disabled
              ? 'bg-disabled'
              : 'data-[state=unchecked]:bg-tertiary data-[state=checked]:bg-accent-inverse',
            control.invalid && 'ring-2 ring-error',
            className,
          )}
        >
          <SwitchPrimitive.Thumb className="ml-0.5 block h-4 w-4 rounded-full bg-inverse transition-transform data-[state=checked]:translate-x-4" />
        </SwitchPrimitive.Root>
        <Label.Root
          htmlFor={control.id}
          className={cn('text-sans-14', disabled ? 'text-disabled' : 'text-default')}
        >
          {label}
        </Label.Root>
        {rest.required && <RequiredMark />}
      </div>
      {(description || error) && (
        <div className="flex flex-col gap-1 pl-11">
          {description && (
            <FieldDescription id={control.descriptionId}>{description}</FieldDescription>
          )}
          {error && <FieldError id={control.errorId}>{error}</FieldError>}
        </div>
      )}
    </div>
  )
}
