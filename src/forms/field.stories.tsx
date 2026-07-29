import type { Meta, StoryObj } from '../../workbench/csf'
import { cn } from '../lib/cn'
import { CONTROL_BASE, controlBorder, Field, type FieldControl } from './field'

const meta = { component: Field } satisfies Meta<typeof Field>
export default meta
type Story = StoryObj<typeof meta>

const control = ({ id, describedBy, errorId, invalid }: FieldControl) => (
  <input
    id={id}
    aria-describedby={describedBy}
    aria-errormessage={errorId}
    aria-invalid={invalid || undefined}
    className={cn(CONTROL_BASE, controlBorder(invalid), 'h-10 px-3')}
  />
)

export const Default: Story = {
  args: { label: 'Project name', children: control },
}

export const WithDescription: Story = {
  args: {
    label: 'Slug',
    description: 'Lowercase letters and dashes only.',
    children: control,
  },
}

export const Required: Story = {
  args: { label: 'Slug', required: true, children: control },
}

export const Disabled: Story = {
  args: {
    label: 'Slug',
    children: (field: FieldControl) => (
      <input
        id={field.id}
        disabled
        defaultValue="locked"
        className={cn(CONTROL_BASE, controlBorder(), 'h-10 px-3')}
      />
    ),
  },
}

export const Invalid: Story = {
  args: {
    label: 'Slug',
    description: 'Lowercase letters and dashes only.',
    error: 'That slug is already taken.',
    children: control,
  },
}

export const Group: Story = {
  args: {
    label: 'Deployment size',
    group: true,
    children: ({ labelId }: FieldControl) => (
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="text-sans-14 text-secondary"
      >
        Composite controls are named with aria-labelledby.
      </div>
    ),
  },
}
