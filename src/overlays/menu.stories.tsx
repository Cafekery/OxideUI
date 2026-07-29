import { useState } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { Copy, DotsHorizontal, ExternalLink, Filter } from '../icons'
import { Button, IconButton } from '../primitives'
import { Menu, MenuCheckboxItem, MenuItem, MenuLabel, MenuSeparator } from './menu'

const meta = {
  component: Menu,
  title: 'Overlays/Menu',
  args: { align: 'start' },
  argTypes: { align: { control: 'select', options: ['start', 'center', 'end'] } },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Menu align={args.align} trigger={<Button variant="secondary">Actions</Button>}>
      <MenuItem icon={<Copy className="size-4" />} shortcut="⌘C">
        Copy ID
      </MenuItem>
      <MenuItem icon={<ExternalLink className="size-4" />}>Open in new tab</MenuItem>
      <MenuItem disabled>Transfer ownership</MenuItem>
      <MenuSeparator />
      <MenuItem destructive shortcut="del">
        Delete instance
      </MenuItem>
    </Menu>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <Menu
      trigger={
        <IconButton aria-label="More" variant="secondary">
          <DotsHorizontal className="size-4" />
        </IconButton>
      }
    >
      <MenuLabel>Instance</MenuLabel>
      <MenuItem icon={<Copy className="size-4" />}>Copy ID</MenuItem>
      <MenuItem icon={<ExternalLink className="size-4" />}>Open serial console</MenuItem>
      <MenuSeparator />
      <MenuLabel>Danger zone</MenuLabel>
      <MenuItem destructive>Stop</MenuItem>
      <MenuItem destructive>Delete</MenuItem>
    </Menu>
  ),
}

function ColumnsDemo() {
  const [columns, setColumns] = useState({ state: true, image: false, created: true })
  return (
    <Menu
      trigger={
        <Button variant="secondary">
          <Filter className="size-4" />
          Columns
        </Button>
      }
    >
      <MenuLabel>Visible columns</MenuLabel>
      {(['state', 'image', 'created'] as const).map((key) => (
        <MenuCheckboxItem
          key={key}
          checked={columns[key]}
          onCheckedChange={(checked) =>
            setColumns((prev) => ({ ...prev, [key]: checked }))
          }
          onSelect={(event) => event.preventDefault()}
        >
          {key}
        </MenuCheckboxItem>
      ))}
    </Menu>
  )
}

export const Checkboxes: Story = { render: () => <ColumnsDemo /> }
