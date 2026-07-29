import type { Meta, StoryObj } from '../../workbench/csf'
import { Badge, type BadgeVariant } from './badge'

const VARIANTS: BadgeVariant[] = [
  'default',
  'accent',
  'success',
  'notice',
  'error',
  'info',
  'neutral',
]

const meta = {
  component: Badge,
  args: { children: 'Pending', variant: 'default', size: 'base' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: ['sm', 'base'] },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['base', 'sm'] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          {VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant} size={size}>
              {variant}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col gap-2 text-sans-md text-secondary">
      <div className="flex items-center gap-2">
        db-primary <Badge variant="success">running</Badge>
      </div>
      <div className="flex items-center gap-2">
        db-replica <Badge variant="notice">degraded</Badge>
      </div>
      <div className="flex items-center gap-2">
        db-archive <Badge variant="error">failed</Badge>
      </div>
      <div className="flex items-center gap-2">
        db-scratch <Badge variant="neutral">stopped</Badge>
      </div>
    </div>
  ),
}
