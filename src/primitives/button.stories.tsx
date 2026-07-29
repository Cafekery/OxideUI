import type { Meta, StoryObj } from '../../workbench/csf'
import { Copy, Plus, Search } from '../icons'
import { Button, type ButtonVariant, IconButton } from './button'

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger', 'notice']

const meta = {
  component: Button,
  args: { children: 'Deploy', variant: 'primary', size: 'base', loading: false },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: ['sm', 'base'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['base', 'sm'] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} size={size}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-2">
          <Button variant={variant}>Idle</Button>
          <Button variant={variant} disabled>
            Disabled
          </Button>
          <Button variant={variant} loading>
            Saving
          </Button>
        </div>
      ))}
    </div>
  ),
}

export const WithGlyph: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>
        <Plus />
        New project
      </Button>
      <Button variant="secondary" size="sm">
        <Search />
        Filter
      </Button>
      <Button variant="ghost" size="sm">
        <Copy />
        Duplicate
      </Button>
    </div>
  ),
}

/** The label stays in the DOM while loading, so the button holds its width. */
export const LoadingHoldsWidth: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <Button>Provision instance</Button>
      <Button loading>Provision instance</Button>
    </div>
  ),
}

export const Icons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['base', 'sm'] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          {VARIANTS.map((variant) => (
            <IconButton
              key={variant}
              aria-label={`Add (${variant})`}
              variant={variant}
              size={size}
            >
              <Plus />
            </IconButton>
          ))}
          <IconButton aria-label="Add, disabled" variant="secondary" size={size} disabled>
            <Plus />
          </IconButton>
          <IconButton aria-label="Add, loading" variant="secondary" size={size} loading>
            <Plus />
          </IconButton>
        </div>
      ))}
    </div>
  ),
}
