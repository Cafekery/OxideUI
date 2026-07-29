import type { Meta, StoryObj } from '../../workbench/csf'
import { Copy, Filter, Search } from '../icons'
import { IconButton } from '../primitives'
import { Tooltip, TooltipProvider } from './tooltip'

const meta = {
  component: Tooltip,
  title: 'Overlays/Tooltip',
  args: { content: 'Copy to clipboard', side: 'top' },
  argTypes: {
    content: { control: 'text' },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <TooltipProvider>
      <Tooltip content={args.content} side={args.side}>
        <IconButton aria-label="Copy" variant="secondary">
          <Copy className="size-4" />
        </IconButton>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-2">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side} side={side} content={`Opens on the ${side}`}>
            <IconButton aria-label={side} variant="secondary">
              <Search className="size-4" />
            </IconButton>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
}

export const LongContent: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip content="Filters apply to the current page only and reset when you navigate away.">
        <IconButton aria-label="Filter" variant="secondary">
          <Filter className="size-4" />
        </IconButton>
      </Tooltip>
    </TooltipProvider>
  ),
}
