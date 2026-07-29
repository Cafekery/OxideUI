import { Select as SelectPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode, Ref } from 'react'
import { Check, ChevronDown } from '../icons'
import { cn } from '../lib/cn'
import { CONTROL_BASE, controlBorder, Field } from './field'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SelectProps = Omit<
  ComponentProps<typeof SelectPrimitive.Root>,
  'children'
> & {
  label: string
  options: SelectOption[]
  placeholder?: string
  description?: ReactNode
  error?: ReactNode
  className?: string
  ref?: Ref<HTMLButtonElement>
}

const ITEM =
  'flex h-8 cursor-default select-none items-center gap-2 rounded-md px-2 text-sans-14 text-default outline-none data-[highlighted]:bg-hover data-[disabled]:pointer-events-none data-[disabled]:text-disabled'

export function Select({
  label,
  options,
  placeholder,
  description,
  error,
  className,
  ref,
  ...rest
}: SelectProps) {
  return (
    <Field label={label} description={description} error={error} required={rest.required}>
      {({ id, describedBy, errorId, invalid }) => (
        <SelectPrimitive.Root {...rest}>
          <SelectPrimitive.Trigger
            ref={ref}
            id={id}
            aria-describedby={describedBy}
            aria-errormessage={errorId}
            aria-invalid={invalid || undefined}
            className={cn(
              CONTROL_BASE,
              controlBorder(invalid),
              'flex h-10 items-center justify-between gap-2 px-3 text-left data-[placeholder]:text-quaternary',
              className,
            )}
          >
            <SelectPrimitive.Value className="truncate" placeholder={placeholder} />
            <SelectPrimitive.Icon className="flex shrink-0 text-tertiary">
              <ChevronDown />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={4}
              className="z-[var(--z-popover)] max-h-60 min-w-[var(--radix-select-trigger-width)] overflow-y-auto scroll-thin rounded-lg border border-default bg-raise shadow-menu"
            >
              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={ITEM}
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="ml-auto flex text-accent">
                      <Check />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      )}
    </Field>
  )
}
