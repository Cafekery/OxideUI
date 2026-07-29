import { Label, RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { type ComponentPropsWithRef, type ReactNode, useId } from 'react'
import { cn } from '../lib/cn'
import { Field } from './field'

export type RadioGroupProps = ComponentPropsWithRef<typeof RadioGroupPrimitive.Root> & {
  label: string
  description?: ReactNode
  error?: ReactNode
}

export type RadioGroupItemProps = Omit<
  ComponentPropsWithRef<typeof RadioGroupPrimitive.Item>,
  'children' | 'asChild'
> & {
  label: ReactNode
}

export function RadioGroup({
  label,
  description,
  error,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  return (
    <Field
      label={label}
      description={description}
      error={error}
      required={rest.required}
      group
    >
      {({ labelId, describedBy, errorId, invalid }) => (
        <RadioGroupPrimitive.Root
          {...rest}
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          aria-errormessage={errorId}
          aria-invalid={invalid || undefined}
          className={cn('flex flex-col gap-2', className)}
        >
          {children}
        </RadioGroupPrimitive.Root>
      )}
    </Field>
  )
}

const CIRCLE =
  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-accent'

const CIRCLE_ENABLED =
  'data-[state=unchecked]:border-default data-[state=unchecked]:bg-default data-[state=unchecked]:hover:border-raise data-[state=checked]:border-accent data-[state=checked]:bg-accent-inverse'

export function RadioGroupItem({
  label,
  disabled,
  className,
  ...rest
}: RadioGroupItemProps) {
  const id = useId()

  return (
    <div className="flex items-center gap-2">
      <RadioGroupPrimitive.Item
        {...rest}
        id={id}
        disabled={disabled}
        className={cn(
          CIRCLE,
          disabled ? 'cursor-not-allowed border-default bg-disabled' : CIRCLE_ENABLED,
          className,
        )}
      >
        <RadioGroupPrimitive.Indicator className="h-1.5 w-1.5 rounded-full bg-default" />
      </RadioGroupPrimitive.Item>
      <Label.Root
        htmlFor={id}
        className={cn('text-sans-14', disabled ? 'text-disabled' : 'text-default')}
      >
        {label}
      </Label.Root>
    </div>
  )
}
