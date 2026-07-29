import type { Meta, StoryObj } from '../../workbench/csf'
import { Textarea } from './textarea'

const meta = {
  component: Textarea,
  args: { label: 'Description', placeholder: 'What is this project for?' },
} satisfies Meta<typeof Textarea>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  args: { description: 'Markdown is supported.' },
}

export const Required: Story = {
  args: { required: true },
}

export const Invalid: Story = {
  args: { defaultValue: 'x', error: 'Give at least 20 characters of context.' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Locked while the run is in flight.' },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Textarea label="Default" placeholder="Notes" />
      <Textarea label="Tall" rows={8} placeholder="Eight rows, still resizable" />
      <Textarea label="Invalid" defaultValue="x" error="Too short." />
      <Textarea label="Disabled" defaultValue="Locked" disabled />
    </div>
  ),
}
