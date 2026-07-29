import type { Meta, StoryObj } from '../../workbench/csf'
import { Breadcrumbs } from './breadcrumbs'

const meta = { component: Breadcrumbs } satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { label: 'Cafekery', to: '/' },
      { label: 'Roasting', to: '/roasting' },
      { label: 'batch-104' },
    ],
  },
}

export const SingleCrumb: Story = {
  args: { items: [{ label: 'Overview' }] },
}

export const Collapsed: Story = {
  args: {
    items: [
      { label: 'Cafekery', to: '/' },
      { label: 'Roasting', to: '/roasting' },
      { label: 'Profiles', to: '/roasting/profiles' },
      { label: 'Ethiopia natural', to: '/roasting/profiles/ethiopia' },
      { label: 'Revision 12' },
    ],
  },
}
