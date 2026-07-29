import type { Meta, StoryObj } from '../../workbench/csf'
import { Switch } from './switch'

const meta = {
  component: Switch,
  args: { label: 'Automatic snapshots' },
} satisfies Meta<typeof Switch>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const WithDescription: Story = {
  args: { description: 'A snapshot is taken every night at 02:00 UTC.' },
}

export const Invalid: Story = {
  args: { error: 'Snapshots require a mounted volume.' },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch label="Disabled, off" disabled />
      <Switch label="Disabled, on" disabled defaultChecked />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Invalid" error="Requires a mounted volume." />
      <Switch label="Disabled" disabled />
    </div>
  ),
}
