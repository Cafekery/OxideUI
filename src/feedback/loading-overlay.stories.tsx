import { useState } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { Button } from '../primitives'
import { LoadingOverlay } from './loading-overlay'

const meta = { component: LoadingOverlay } satisfies Meta<typeof LoadingOverlay>
export default meta
type Story = StoryObj<typeof meta>

const Panel = ({ active, label }: { active: boolean; label?: string }) => (
  <div className="relative w-80 rounded-lg bg-raise p-4 shadow-border">
    <p className="text-default text-sans-semi-md">Instance limits</p>
    <p className="mt-1 text-sans-14 text-tertiary">
      vCPUs, memory and disk are recalculated whenever the plan changes.
    </p>
    <LoadingOverlay active={active} label={label} />
  </div>
)

export const Default: Story = { render: () => <Panel active /> }

const Toggle = () => {
  const [active, setActive] = useState(false)

  return (
    <div className="flex flex-col items-start gap-3">
      <Panel active={active} />
      <Button onClick={() => setActive((current) => !current)} size="sm">
        {active ? 'Stop loading' : 'Start loading'}
      </Button>
    </div>
  )
}

export const Toggled: Story = { render: () => <Toggle /> }

export const CustomLabel: Story = {
  render: () => <Panel active label="Recalculating limits" />,
}
