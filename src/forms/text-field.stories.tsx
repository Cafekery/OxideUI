import type { Meta, StoryObj } from '../../workbench/csf'
import { Search } from '../icons'
import { TextField } from './text-field'

const meta = {
  component: TextField,
  args: { label: 'Project name', placeholder: 'acme-web' },
} satisfies Meta<typeof TextField>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  args: { label: 'Slug', description: 'Lowercase letters and dashes only.' },
}

export const Required: Story = {
  args: { required: true },
}

export const WithLeading: Story = {
  args: { label: 'Search', placeholder: 'Find an instance', leading: <Search /> },
}

export const WithTrailing: Story = {
  args: {
    label: 'Memory',
    placeholder: '16',
    trailing: <span className="text-mono-xs text-tertiary">GiB</span>,
  },
}

export const Invalid: Story = {
  args: {
    label: 'Slug',
    defaultValue: 'Acme Web',
    description: 'Lowercase letters and dashes only.',
    error: 'Uppercase letters and spaces are not allowed.',
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'acme-web' },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <TextField label="Default" placeholder="acme-web" />
      <TextField label="Filled" defaultValue="acme-web" />
      <TextField label="With icon" placeholder="Search" leading={<Search />} />
      <TextField label="Invalid" defaultValue="Acme Web" error="Lowercase only." />
      <TextField label="Disabled" defaultValue="acme-web" disabled />
    </div>
  ),
}
