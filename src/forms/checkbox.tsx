import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Check, Minus } from '../icons'
import { cn } from '../lib/cn'
import { useControllable } from '../lib/use-controllable'
import { InlineField } from './field'

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
  const [state, setState] = useControllable<CheckboxPrimitive.CheckedState>(
    checked,
    defaultChecked ?? false,
    onCheckedChange,
  )

  const box = (invalid: boolean) =>
    disabled
      ? 'border-default bg-disabled text-disabled'
      : state === false
        ? cn('bg-default hover:border-raise', invalid ? 'border-error' : 'border-default')
        : 'border-accent bg-accent-inverse text-inverse'

  return (
    <InlineField
      label={label}
      description={description}
      error={error}
      required={rest.required}
      disabled={disabled}
      indent="pl-6"
    >
      {({ id, describedBy, errorId, invalid }) => (
        <CheckboxPrimitive.Root
          {...rest}
          id={id}
          checked={state}
          onCheckedChange={setState}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-errormessage={errorId}
          aria-invalid={invalid || undefined}
          className={cn(BOX, box(invalid), className)}
        >
          <CheckboxPrimitive.Indicator className="flex">
            {state === 'indeterminate' ? (
              <Minus data-glyph="minus" />
            ) : (
              <Check data-glyph="check" />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      )}
    </InlineField>
  )
}
