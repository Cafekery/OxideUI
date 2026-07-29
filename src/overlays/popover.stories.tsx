import type { Meta, StoryObj } from '../../workbench/csf'
import { Button } from '../primitives'
import { Popover } from './popover'

const meta = {
  component: Popover,
  title: 'Overlays/Popover',
  args: { side: 'bottom', arrow: false },
  argTypes: {
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    arrow: { control: 'boolean' },
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

const Body = () => (
  <div className="flex flex-col gap-1">
    <p className="text-sans-semi-sm text-raise">Rollout paused</p>
    <p className="text-secondary">
      Two of four replicas failed their health check. Resume once the image is fixed.
    </p>
  </div>
)

export const Default: Story = {
  render: (args) => (
    <Popover
      side={args.side}
      arrow={args.arrow}
      trigger={<Button variant="secondary">Open popover</Button>}
    >
      <Body />
    </Popover>
  ),
}

export const Placements: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover
          key={side}
          side={side}
          arrow
          trigger={<Button variant="secondary">{side}</Button>}
        >
          <Body />
        </Popover>
      ))}
    </div>
  ),
}
