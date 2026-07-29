import { useState } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { NumberField } from './number-field'

const meta = {
  component: NumberField,
  args: { label: 'Instances', defaultValue: 3 },
} satisfies Meta<typeof NumberField>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Bounded: Story = {
  args: { min: 1, max: 5, description: 'Between 1 and 5 instances.' },
}

export const FractionalStep: Story = {
  args: { label: 'CPU share', defaultValue: 0.5, step: 0.1, min: 0.1, max: 2 },
}

export const Required: Story = {
  args: { required: true },
}

export const Invalid: Story = {
  args: { error: 'Your quota allows at most 2 instances.' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Controlled: Story = {
  render: () => {
    const [count, setCount] = useState(2)
    return (
      <div className="flex w-64 flex-col gap-2">
        <NumberField
          label="Instances"
          value={count}
          onValueChange={setCount}
          min={0}
          max={8}
        />
        <span className="text-mono-xs text-tertiary">value: {count}</span>
      </div>
    )
  },
}
