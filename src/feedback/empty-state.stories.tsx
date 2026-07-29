import type { Meta, StoryObj } from '../../workbench/csf'
import { Filter, Search } from '../icons'
import { Button } from '../primitives'
import { EmptyState } from './empty-state'

const meta = { component: EmptyState } satisfies Meta<typeof EmptyState>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { title: 'No instances' } }

export const WithDescription: Story = {
  args: {
    title: 'No instances',
    description: 'Nothing is running in this project yet.',
  },
}

export const WithIconAndAction: Story = {
  args: {
    title: 'No matching instances',
    description:
      'No instance matches the current filter. Clear it to see everything in this project.',
    icon: <Filter />,
    action: (
      <Button size="sm" variant="secondary">
        Clear filter
      </Button>
    ),
  },
}

export const OnAContainerBackground: Story = {
  render: () => (
    <div className="rounded-lg bg-raise shadow-border">
      <EmptyState
        description="Try a different search term."
        icon={<Search />}
        title="No results"
      />
    </div>
  ),
}
