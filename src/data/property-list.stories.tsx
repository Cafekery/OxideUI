import type { Meta, StoryObj } from '../../workbench/csf'
import { PropertyItem, PropertyList } from './property-list'

const meta = {
  component: PropertyList,
  argTypes: { columns: { control: 'select', options: [1, 2] } },
} satisfies Meta<typeof PropertyList>
export default meta
type Story = StoryObj<typeof meta>

const items = (
  <>
    <PropertyItem label="Name">web-frontend</PropertyItem>
    <PropertyItem label="State">running</PropertyItem>
    <PropertyItem label="vCPU">4</PropertyItem>
    <PropertyItem label="Memory">16 GiB</PropertyItem>
    <PropertyItem label="Created">2 days ago</PropertyItem>
    <PropertyItem label="Region">west-2</PropertyItem>
  </>
)

export const Default: Story = {
  args: { children: items },
}

export const TwoColumns: Story = {
  name: 'Two columns',
  args: { columns: 2, children: items },
}

export const LongValues: Story = {
  name: 'Long values wrap',
  render: () => (
    <div className="max-w-xs">
      <PropertyList>
        <PropertyItem label="Instance ID">
          i-0a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6071
        </PropertyItem>
        <PropertyItem label="Endpoint">
          https://web-frontend.internal.example.invalid/very/long/path/that/keeps/going
        </PropertyItem>
        <PropertyItem label="Description">
          A long free-text description that wraps onto several lines without pushing the
          surrounding layout wider than it should be.
        </PropertyItem>
      </PropertyList>
    </div>
  ),
}

export const RichValues: Story = {
  name: 'Rich values',
  render: () => (
    <PropertyList columns={2}>
      <PropertyItem label="State">
        <span className="text-success">running</span>
      </PropertyItem>
      <PropertyItem label="Tags">
        <span className="flex flex-wrap gap-1">
          <span className="rounded-lg border border-default bg-secondary px-1.5 text-mono-sm">
            prod
          </span>
          <span className="rounded-lg border border-default bg-secondary px-1.5 text-mono-sm">
            web
          </span>
        </span>
      </PropertyItem>
    </PropertyList>
  ),
}
