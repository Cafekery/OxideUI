import { useState } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { Tabs } from './tabs'

const meta = { component: Tabs } satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const Panel = ({ children }: { children: string }) => (
  <p className="text-secondary text-sans-14">{children}</p>
)

const items = [
  {
    value: 'overview',
    label: 'Overview',
    content: <Panel>Roast curve and yield.</Panel>,
  },
  { value: 'batches', label: 'Batches', content: <Panel>Twelve batches logged.</Panel> },
  { value: 'notes', label: 'Notes', content: <Panel>Cupping notes and scores.</Panel> },
]

export const Default: Story = {
  args: { items, 'aria-label': 'Roast profile' },
}

const ControlledTabs = () => {
  const [value, setValue] = useState('batches')

  return (
    <div className="flex flex-col gap-3">
      <Tabs
        items={items}
        value={value}
        onValueChange={setValue}
        aria-label="Roast profile"
      />
      <span className="text-mono-xs text-tertiary">selected: {value}</span>
    </div>
  )
}

export const Controlled: Story = { render: () => <ControlledTabs /> }
