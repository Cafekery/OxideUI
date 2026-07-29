import type { Meta, StoryObj } from '../../workbench/csf'
import { Divider } from './divider'

const meta = {
  component: Divider,
  args: { orientation: 'horizontal' },
  argTypes: { orientation: { control: 'select', options: ['horizontal', 'vertical'] } },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-64 text-sans-md text-secondary">
      Above
      <Divider {...args} className="my-3" />
      Below
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-stretch gap-3 text-sans-md text-secondary">
      Overview
      <Divider orientation="vertical" />
      Metrics
      <Divider orientation="vertical" />
      Settings
    </div>
  ),
}
