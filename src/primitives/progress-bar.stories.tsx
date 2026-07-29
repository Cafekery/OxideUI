import type { Meta, StoryObj } from '../../workbench/csf'
import { MeterBar, ProgressBar } from './progress-bar'

const meta = {
  component: ProgressBar,
  args: { value: 40, size: 'base' },
  argTypes: {
    value: { control: 'number' },
    size: { control: 'select', options: ['sm', 'base'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <ProgressBar {...args} label="Upload" />
    </div>
  ),
}

export const Values: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {[0, 25, 50, 75, 100].map((value) => (
        <div key={value} className="flex items-center gap-3">
          <ProgressBar value={value} label={`${value} percent`} />
          <span className="w-10 text-mono-xs text-tertiary">{value}%</span>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <ProgressBar value={60} size="sm" label="Small" />
      <ProgressBar value={60} size="base" label="Base" />
    </div>
  ),
}

export const Clamped: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <ProgressBar value={-40} label="Below zero" />
      <ProgressBar value={260} label="Above one hundred" />
    </div>
  ),
}

export const Meter: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {[20, 74, 75, 90, 91, 100].map((value) => (
        <div key={value} className="flex items-center gap-3">
          <MeterBar value={value} label={`Disk ${value} percent`} />
          <span className="w-10 text-mono-xs text-tertiary">{value}%</span>
        </div>
      ))}
    </div>
  ),
}

export const MeterSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <MeterBar value={95} size="sm" label="Small" />
      <MeterBar value={95} size="base" label="Base" />
    </div>
  ),
}
