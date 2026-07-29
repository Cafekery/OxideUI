import type { Meta, StoryObj } from '../../workbench/csf'
import { Checkbox } from './checkbox'

const meta = {
  component: Checkbox,
  args: { label: 'Email me when the run finishes' },
} satisfies Meta<typeof Checkbox>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Indeterminate: Story = {
  args: { label: 'Select all instances', checked: 'indeterminate' },
}

export const WithDescription: Story = {
  args: {
    label: 'Accept the terms',
    description: 'You can revoke this from project settings later.',
  },
}

export const Required: Story = {
  args: { label: 'Accept the terms', required: true },
}

export const Invalid: Story = {
  args: { label: 'Accept the terms', error: 'You must accept the terms to continue.' },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="Disabled, unchecked" disabled />
      <Checkbox label="Disabled, checked" disabled defaultChecked />
      <Checkbox label="Disabled, indeterminate" disabled checked="indeterminate" />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" checked="indeterminate" />
      <Checkbox label="Invalid" error="Required." />
      <Checkbox label="Disabled" disabled />
    </div>
  ),
}
