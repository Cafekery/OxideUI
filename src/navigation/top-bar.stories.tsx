import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { Filter, Search } from '../icons'
import { TopBar } from './top-bar'

const meta = { component: TopBar } satisfies Meta<typeof TopBar>

export default meta
type Story = StoryObj<typeof meta>

const Action = ({ children }: { children: ReactNode }) => (
  <button
    type="button"
    className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-default bg-raise px-2 text-mono-sm text-default transition hover:bg-hover"
  >
    {children}
  </button>
)

export const Default: Story = {
  args: { children: <span className="text-sans-14 text-default">Batches</span> },
}

export const WithSlots: Story = {
  render: () => (
    <TopBar
      leading={<span className="text-mono-sm text-tertiary">Cafekery</span>}
      trailing={
        <>
          <Action>
            <Filter />
            Filter
          </Action>
          <Action>New batch</Action>
        </>
      }
    >
      <span className="inline-flex items-center gap-1.5 text-secondary text-sans-14">
        <Search />
        Search roasts
      </span>
    </TopBar>
  ),
}
