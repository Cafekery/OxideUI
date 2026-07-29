import type { Meta, StoryObj } from '../../workbench/csf'
import { Select, type SelectOption } from './select'

const regions: SelectOption[] = [
  { value: 'us-west', label: 'US West (Oregon)' },
  { value: 'us-east', label: 'US East (Virginia)' },
  { value: 'eu-central', label: 'EU Central (Frankfurt)' },
  { value: 'ap-south', label: 'AP South (Singapore) — no capacity', disabled: true },
]

const meta = {
  component: Select,
  args: { label: 'Region', options: regions, placeholder: 'Pick a region' },
} satisfies Meta<typeof Select>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: 'eu-central' },
}

export const WithDescription: Story = {
  args: { description: 'Latency is lowest closest to your users.' },
}

export const Required: Story = {
  args: { required: true },
}

export const Invalid: Story = {
  args: { error: 'Pick a region before continuing.' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'us-west' },
}

export const Long: Story = {
  args: {
    label: 'Image',
    placeholder: 'Pick an image',
    options: Array.from({ length: 24 }, (_, index) => ({
      value: `image-${index}`,
      label: `ubuntu-24.04-build-${String(index).padStart(3, '0')}`,
    })),
  },
}
