import { useState } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { Button } from '../primitives'
import { RouteProgress } from './route-progress'

const meta = { component: RouteProgress } satisfies Meta<typeof RouteProgress>
export default meta
type Story = StoryObj<typeof meta>

const Toggle = () => {
  const [active, setActive] = useState(false)

  return (
    <div className="flex flex-col items-start gap-3">
      <RouteProgress active={active} />
      <Button onClick={() => setActive((current) => !current)} size="sm">
        {active ? 'Finish navigation' : 'Start navigation'}
      </Button>
      <p className="max-w-prose text-sans-14 text-tertiary">
        The bar is fixed to the top edge of the viewport, so watch the very top of the
        window. It runs to roughly 45% and holds, then completes and fades once navigation
        ends.
      </p>
    </div>
  )
}

export const Default: Story = { render: () => <Toggle /> }

export const Holding: Story = { args: { active: true } }
