import type { Meta, StoryObj } from '../../workbench/csf'
import { Avatar, type AvatarSize } from './avatar'

const SIZES: AvatarSize[] = ['xs', 'sm', 'base', 'lg']

const NAMES = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Katherine Johnson',
  'Cher',
  'Jane Mary Watson',
]

const meta = {
  component: Avatar,
  args: { name: 'Ada Lovelace', size: 'base' },
  argTypes: {
    name: { control: 'text' },
    src: { control: 'text' },
    size: { control: 'select', options: SIZES },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {SIZES.map((size) => (
        <Avatar key={size} name="Ada Lovelace" size={size} />
      ))}
    </div>
  ),
}

/** Each name hashes to a fixed hue, so the same person keeps their colour. */
export const Tints: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {NAMES.map((name) => (
        <div key={name} className="flex items-center gap-2 text-sans-md text-secondary">
          <Avatar name={name} />
          {name}
        </div>
      ))}
    </div>
  ),
}

export const WithImage: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {SIZES.map((size) => (
        <Avatar
          key={size}
          name="Ada Lovelace"
          size={size}
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'%3E%3Crect width='2' height='2' fill='%23134e4a'/%3E%3Ccircle cx='1' cy='0.8' r='0.4' fill='%235eead4'/%3E%3C/svg%3E"
        />
      ))}
    </div>
  ),
}

export const BrokenImageFallsBack: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="Grace Hopper" src="/does-not-exist.png" />
      <span className="text-sans-md text-tertiary">falls back to initials</span>
    </div>
  ),
}

export const Stack: Story = {
  render: () => (
    <div className="flex items-center">
      {NAMES.slice(0, 4).map((name) => (
        <Avatar key={name} name={name} className="-ml-2 ring-2 ring-default first:ml-0" />
      ))}
    </div>
  ),
}
