import { useState } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { FilterBar, type FilterChip } from './filter-bar'

const filters: FilterChip[] = [
  { id: 'state', label: 'State', value: 'running' },
  { id: 'region', label: 'Region', value: 'west-2' },
  { id: 'project', label: 'Project', value: 'storefront' },
]

const meta = {
  component: FilterBar,
  args: { filters, onRemove: () => {} },
} satisfies Meta<typeof FilterBar>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithClearAll: Story = {
  name: 'With clear all',
  args: { onClearAll: () => {} },
}

export const SingleFilter: Story = {
  args: { filters: filters.slice(0, 1), onClearAll: () => {} },
}

export const ManyFilters: Story = {
  name: 'Many filters wrap',
  args: {
    onClearAll: () => {},
    filters: [
      ...filters,
      { id: 'image', label: 'Image', value: 'base-linux-12' },
      { id: 'size', label: 'Size', value: '16 vCPU / 128 GiB' },
      { id: 'owner', label: 'Owner', value: 'platform-team' },
      { id: 'created', label: 'Created', value: 'last 7 days' },
    ],
  },
}

export const Empty: Story = {
  name: 'Empty renders nothing',
  args: { filters: [], onClearAll: () => {} },
}

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState(filters)

    return (
      <div className="flex flex-col gap-3">
        <FilterBar
          filters={active}
          onRemove={(id) => setActive((current) => current.filter((f) => f.id !== id))}
          onClearAll={() => setActive([])}
        />
        <p className="text-mono-sm text-tertiary">
          {active.length} active
          {active.length === 0 && ' — reload the story to restore them'}
        </p>
      </div>
    )
  },
}
