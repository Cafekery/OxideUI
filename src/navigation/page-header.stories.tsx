import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { PageHeader } from './page-header'

const meta = {
  component: PageHeader,
  args: { title: 'Batches' },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

const Action = ({ children }: { children: ReactNode }) => (
  <button
    type="button"
    className="h-8 rounded-lg border border-default bg-raise px-3 text-mono-sm text-default transition hover:bg-hover"
  >
    {children}
  </button>
)

export const Default: Story = {}

export const WithDescription: Story = {
  args: { description: 'Every roast recorded against the Ethiopia natural profile.' },
}

export const Full: Story = {
  args: {
    title: 'Ethiopia natural',
    description: 'Every roast recorded against this profile, newest first.',
    breadcrumbs: [
      { label: 'Cafekery', to: '/' },
      { label: 'Roasting', to: '/roasting' },
      { label: 'Ethiopia natural' },
    ],
    actions: (
      <>
        <Action>Duplicate</Action>
        <Action>New batch</Action>
      </>
    ),
  },
}
