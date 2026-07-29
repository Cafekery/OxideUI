import { Tabs as RadixTabs } from 'radix-ui'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type TabItem = { value: string; label: ReactNode; content: ReactNode }

export type TabsProps = Omit<ComponentPropsWithRef<typeof RadixTabs.Root>, 'children'> & {
  items: TabItem[]
}

/** The negative bottom margin drops the trigger onto the list's border so the
 *  active inset shadow replaces that 1px rather than stacking above it. */
const TRIGGER =
  '-mb-px h-9 px-3 text-mono-sm text-secondary transition hover:text-default data-[state=active]:text-accent data-[state=active]:shadow-[inset_0_-2px_0_0_var(--stroke-accent)]'

export function Tabs({
  items,
  className,
  defaultValue,
  'aria-label': label,
  ...rest
}: TabsProps) {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue ?? items[0]?.value}
      className={cn('flex flex-col', className)}
      {...rest}
    >
      <RadixTabs.List
        aria-label={label}
        className="flex items-end gap-1 border-default border-b"
      >
        {items.map((item) => (
          <RadixTabs.Trigger key={item.value} value={item.value} className={TRIGGER}>
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className="pt-4">
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}
