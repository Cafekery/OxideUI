import type { Meta, StoryObj } from '../../workbench/csf'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta = {
  component: RadioGroup,
  args: { label: 'Deployment size', defaultValue: 'small' },
} satisfies Meta<typeof RadioGroup>
export default meta
type Story = StoryObj<typeof meta>

const sizes = (
  <>
    <RadioGroupItem value="small" label="Small — 2 vCPU, 8 GiB" />
    <RadioGroupItem value="medium" label="Medium — 4 vCPU, 16 GiB" />
    <RadioGroupItem value="large" label="Large — 8 vCPU, 32 GiB" />
  </>
)

export const Default: Story = {
  args: { children: sizes },
}

export const WithDescription: Story = {
  args: {
    description: 'You can resize an instance after it is created.',
    children: sizes,
  },
}

export const Required: Story = {
  args: { required: true, children: sizes },
}

export const Invalid: Story = {
  args: {
    defaultValue: undefined,
    error: 'Pick a size before continuing.',
    children: sizes,
  },
}

export const DisabledItem: Story = {
  args: {
    children: (
      <>
        <RadioGroupItem value="small" label="Small — 2 vCPU, 8 GiB" />
        <RadioGroupItem value="medium" label="Medium — 4 vCPU, 16 GiB" />
        <RadioGroupItem value="large" label="Large — out of capacity" disabled />
      </>
    ),
  },
}

export const Disabled: Story = {
  args: { disabled: true, children: sizes },
}
