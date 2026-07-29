import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { Calendar, Filter, InfoCircle, Search } from '../icons'
import { AppShell } from './app-shell'
import { NavItem } from './nav-item'
import { PageHeader } from './page-header'
import { Sidebar, SidebarFooter, SidebarSection } from './sidebar'
import { Tabs } from './tabs'
import { TopBar } from './top-bar'

const meta = {
  component: AppShell,
  parameters: { layout: 'fullscreen', bare: true },
} satisfies Meta<typeof AppShell>

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

const Card = ({ title, value }: { title: string; value: string }) => (
  <div className="flex flex-col gap-1 rounded-xl border border-default bg-raise p-4">
    <span className="text-mono-xs text-tertiary">{title}</span>
    <span className="text-sans-22 text-default">{value}</span>
  </div>
)

const Overview = (
  <div className="grid grid-cols-3 gap-3">
    <Card title="Batches" value="128" />
    <Card title="Green stock" value="412 kg" />
    <Card title="Avg. yield" value="84.2%" />
  </div>
)

const nav = (
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

    <SidebarFooter>
      <NavItem to="/docs" icon={<InfoCircle />}>
        Documentation
      </NavItem>
    </SidebarFooter>
  </Sidebar>
)

export const Dashboard: Story = {
  render: () => (
    <AppShell
      sidebar={nav}
      topBar={
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
          <span className="text-sans-14 text-secondary">Roasting</span>
        </TopBar>
      }
    >
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Ethiopia natural"
          description="Every roast recorded against this profile, newest first."
          breadcrumbs={[
            { label: 'Cafekery', to: '/' },
            { label: 'Roasting', to: '/roasting' },
            { label: 'Ethiopia natural' },
          ]}
          actions={<Action>Duplicate</Action>}
        />
        <Tabs
          aria-label="Roast profile"
          items={[
            { value: 'overview', label: 'Overview', content: Overview },
            {
              value: 'batches',
              label: 'Batches',
              content: (
                <p className="text-secondary text-sans-14">Twelve batches logged.</p>
              ),
            },
            {
              value: 'notes',
              label: 'Notes',
              content: (
                <p className="text-secondary text-sans-14">Cupping notes and scores.</p>
              ),
            },
          ]}
        />
      </div>
    </AppShell>
  ),
}

export const WithoutTopBar: Story = {
  render: () => (
    <AppShell sidebar={nav}>
      <PageHeader title="Overview" description="No top bar in this frame." />
    </AppShell>
  ),
}
