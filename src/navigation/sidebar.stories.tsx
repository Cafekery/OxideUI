import type { Meta, StoryObj } from '../../workbench/csf'
import { Calendar, Filter, InfoCircle, Search } from '../icons'
import { NavItem } from './nav-item'
import { Sidebar, SidebarFooter, SidebarSection } from './sidebar'

const meta = {
  component: Sidebar,
  parameters: { bare: true },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="h-[480px]">
      <Sidebar>
        <SidebarSection>
          <NavItem to="/" icon={<Search />} active>
            Overview
          </NavItem>
          <NavItem to="/batches" icon={<Calendar />}>
            Batches
          </NavItem>
        </SidebarSection>

        <SidebarSection title="Roasting">
          <NavItem to="/profiles" icon={<Filter />}>
            Profiles
          </NavItem>
          <NavItem
            to="/queue"
            icon={<Calendar />}
            badge={<span className="text-mono-xs text-tertiary">4</span>}
          >
            Queue
          </NavItem>
          <NavItem to="/green" icon={<Search />}>
            Green stock
          </NavItem>
        </SidebarSection>

        <SidebarSection title="Settings">
          <NavItem to="/team" icon={<Filter />}>
            Team
          </NavItem>
          <NavItem to="/billing" icon={<Calendar />}>
            Billing
          </NavItem>
        </SidebarSection>

        <SidebarFooter>
          <NavItem to="/docs" icon={<InfoCircle />}>
            Documentation
          </NavItem>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
}

export const Untitled: Story = {
  render: () => (
    <div className="h-[240px]">
      <Sidebar aria-label="Compact">
        <SidebarSection>
          <NavItem to="/" active>
            Overview
          </NavItem>
          <NavItem to="/batches">Batches</NavItem>
          <NavItem to="/profiles">Profiles</NavItem>
        </SidebarSection>
      </Sidebar>
    </div>
  ),
}
