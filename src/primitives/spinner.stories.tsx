import type { Meta, StoryObj } from '../../workbench/csf'
import { Spinner, type SpinnerSize } from './spinner'

const SIZES: SpinnerSize[] = ['sm', 'base', 'lg']

const meta = {
  component: Spinner,
  args: { size: 'base' },
  argTypes: {
    size: { control: 'select', options: SIZES },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <Spinner {...args} className="text-default" />,
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-default">
      {SIZES.map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  ),
}

/** Colour is inherited, so the spinner matches whatever it sits inside. */
export const InheritsColour: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="text-default" />
      <Spinner className="text-secondary" />
      <Spinner className="text-tertiary" />
      <Spinner className="text-accent" />
      <Spinner className="text-error" />
      <Spinner className="text-notice" />
    </div>
  ),
}

export const OnSurfaces: Story = {
  render: () => (
    <div className="flex gap-3">
      <div className="flex items-center gap-2 rounded-lg bg-raise p-4 text-secondary">
        <Spinner /> loading
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-accent p-4 text-accent">
        <Spinner /> deploying
      </div>
    </div>
  ),
}
