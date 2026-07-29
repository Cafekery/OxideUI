import type { Meta, StoryObj } from '../../workbench/csf'
import { Kbd } from './kbd'

const meta = {
  component: Kbd,
  args: { children: '⌘K' },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Keys: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {['⌘', '⇧', '⌥', '⌃', '↵', '⌫', 'ESC', 'TAB', 'F', '/'].map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </div>
  ),
}

export const Chords: Story = {
  render: () => (
    <div className="flex flex-col gap-2 text-sans-md text-secondary">
      <div className="flex items-center gap-2">
        Command menu
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </div>
      <div className="flex items-center gap-2">
        Dismiss
        <Kbd>ESC</Kbd>
      </div>
    </div>
  ),
}
