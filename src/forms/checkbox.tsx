import { Checkbox as CheckboxPrimitive, Label } from 'radix-ui'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Check, Minus } from '../icons'
import { cn } from '../lib/cn'
import { useControllable } from '../lib/use-controllable'
import { FieldDescription, FieldError, RequiredMark, useFieldIds } from './field'

export type CheckboxProps = Omit<
  ComponentPropsWithRef<typeof CheckboxPrimitive.Root>,
  'children' | 'asChild'
> & {
  label: ReactNode
  description?: ReactNode
  error?: ReactNode
}

const BOX =
  'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border text-sans-12 transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed'

export function Checkbox({
  label,
  description,
  error,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  ...rest
}: CheckboxProps) {
  const control = useFieldIds(description, error)
  const [state, setState] = useControllable<CheckboxPrimitive.CheckedState>(
    checked,
    defaultChecked ?? false,
    onCheckedChange,
  )

  const box = disabled
    ? 'border-default bg-disabled text-disabled'
    : state === false
      ? cn(
          'bg-default hover:border-raise',
          control.invalid ? 'border-error' : 'border-default',
        )
      : 'border-accent bg-accent-inverse text-inverse'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <CheckboxPrimitive.Root
          {...rest}
          id={control.id}
          checked={state}
          onCheckedChange={setState}
          disabled={disabled}
          aria-describedby={control.describedBy}
          aria-errormessage={control.errorId}
          aria-invalid={control.invalid || undefined}
          className={cn(BOX, box, className)}
        >
          <CheckboxPrimitive.Indicator className="flex">
            {state === 'indeterminate' ? (
              <Minus data-glyph="minus" />
            ) : (
              <Check data-glyph="check" />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <Label.Root
          htmlFor={control.id}
          className={cn('text-sans-14', disabled ? 'text-disabled' : 'text-default')}
        >
          {label}
        </Label.Root>
        {rest.required && <RequiredMark />}
      </div>
      {(description || error) && (
        <div className="flex flex-col gap-1 pl-6">
          {description && (
            <FieldDescription id={control.descriptionId}>{description}</FieldDescription>
          )}
          {error && <FieldError id={control.errorId}>{error}</FieldError>}
        </div>
      )}
    </div>
  )
}
