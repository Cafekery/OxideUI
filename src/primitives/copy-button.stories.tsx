import type { Meta, StoryObj } from '../../workbench/csf'
import { CopyButton } from './copy-button'

const meta = {
  component: CopyButton,
  args: { value: 'inst-7f3a91c0' },
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    copiedLabel: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger', 'notice'],
    },
    size: { control: 'select', options: ['sm', 'base'] },
  },
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NextToAValue: Story = {
  render: () => (
    <div className="flex items-center gap-1 text-mono-code text-secondary">
      inst-7f3a91c0
      <CopyButton value="inst-7f3a91c0" label="Copy instance ID" />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['base', 'sm'] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          {(['primary', 'secondary', 'ghost', 'danger', 'notice'] as const).map(
            (variant) => (
              <CopyButton key={variant} value={variant} variant={variant} size={size} />
            ),
          )}
          <CopyButton value="disabled" variant="secondary" size={size} disabled />
        </div>
      ))}
    </div>
  ),
}
