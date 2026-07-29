import type { Meta, StoryObj } from '../../workbench/csf'
import { Calendar, Filter, Search } from '../icons'
import { NavItem } from './nav-item'

const meta = {
  component: NavItem,
  args: { to: '/batches', children: 'Batches' },
  argTypes: { active: { control: 'boolean' } },
} satisfies Meta<typeof NavItem>

export default meta
type Story = StoryObj<typeof meta>

const Count = ({ children }: { children: string }) => (
  <span className="text-mono-xs text-tertiary">{children}</span>
)

export const Default: Story = {}

export const States: Story = {
  render: () => (
    <div className="flex w-[var(--sidebar-width)] flex-col gap-0.5 rounded-lg border border-default bg-default p-2">
      <NavItem to="/overview" icon={<Search />}>
        Resting
      </NavItem>
      <NavItem to="/overview" icon={<Filter />} className="bg-hover text-default!">
        Hover
      </NavItem>
      <NavItem to="/overview" icon={<Calendar />} active>
        Active
      </NavItem>
      <NavItem to="/overview" icon={<Search />} badge={<Count>12</Count>}>
        With badge
      </NavItem>
      <NavItem to="/overview">Without icon</NavItem>
      <NavItem to="/overview" icon={<Calendar />} badge={<Count>3</Count>}>
        A label long enough to truncate
      </NavItem>
    </div>
  ),
}
