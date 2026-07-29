import { useState } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { Button } from '../primitives'
import { Sheet, SheetBody, SheetFooter, type SheetSide } from './sheet'

const meta = {
  component: Sheet,
  title: 'Overlays/Sheet',
  args: { side: 'right' },
  argTypes: { side: { control: 'select', options: ['right', 'left'] } },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

const FACTS = [
  ['State', 'running'],
  ['vCPU', '4'],
  ['Memory', '16 GiB'],
  ['Image', 'debian-12'],
  ['Created', '2026-05-14'],
]

function Demo({ side = 'right', label }: { side?: SheetSide; label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      side={side}
      title="Instance details"
      description="atlas-prod / us-west-1"
      trigger={<Button variant="secondary">{label}</Button>}
    >
      <SheetBody>
        <dl className="flex flex-col gap-3">
          {FACTS.map(([term, value]) => (
            <div key={term} className="flex justify-between gap-4">
              <dt className="text-mono-xs text-tertiary">{term}</dt>
              <dd className="text-sans-12 text-default">{value}</dd>
            </div>
          ))}
        </dl>
      </SheetBody>
      <SheetFooter>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setOpen(false)}>Save</Button>
      </SheetFooter>
    </Sheet>
  )
}

export const Default: Story = {
  render: (args) => <Demo side={args.side} label="Open sheet" />,
}

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      <Demo side="left" label="From left" />
      <Demo side="right" label="From right" />
    </div>
  ),
}
