import { useState } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { type ColumnDef, Table } from './table'

type Instance = {
  name: string
  state: 'running' | 'stopped' | 'failed'
  vcpu: number
  memory: string
  created: string
}

const STATE_TONE: Record<Instance['state'], string> = {
  running: 'text-success',
  stopped: 'text-tertiary',
  failed: 'text-error',
}

const instances: Instance[] = [
  {
    name: 'web-frontend',
    state: 'running',
    vcpu: 4,
    memory: '16 GiB',
    created: '2 days ago',
  },
  {
    name: 'db-primary',
    state: 'running',
    vcpu: 16,
    memory: '128 GiB',
    created: '3 weeks ago',
  },
  {
    name: 'batch-worker',
    state: 'stopped',
    vcpu: 2,
    memory: '8 GiB',
    created: '6 hours ago',
  },
  {
    name: 'edge-cache',
    state: 'failed',
    vcpu: 2,
    memory: '4 GiB',
    created: '1 hour ago',
  },
  {
    name: 'metrics-agent',
    state: 'running',
    vcpu: 1,
    memory: '2 GiB',
    created: '5 months ago',
  },
]

const columns: ColumnDef<Instance, string | number>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'state',
    header: 'State',
    cell: ({ row }) => (
      <span className={STATE_TONE[row.original.state]}>{row.original.state}</span>
    ),
  },
  { accessorKey: 'vcpu', header: 'vCPU' },
  { accessorKey: 'memory', header: 'Memory' },
  { accessorKey: 'created', header: 'Created' },
]

const meta = { component: Table } satisfies Meta<typeof Table>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Table data={instances} columns={columns} />,
}

export const Sortable: Story = {
  name: 'Sortable headers',
  render: () => (
    <div className="flex flex-col gap-3">
      <p className="text-sans-14 text-secondary">
        Every accessor column sorts. Press a header to cycle ascending, descending,
        unsorted.
      </p>
      <Table data={instances} columns={columns} />
    </div>
  ),
}

export const Loading: Story = {
  render: () => <Table data={[]} columns={columns} loading />,
}

export const Empty: Story = {
  render: () => <Table data={[]} columns={columns} />,
}

export const EmptyCustom: Story = {
  name: 'Empty with custom state',
  render: () => (
    <Table
      data={[]}
      columns={columns}
      emptyState={
        <span className="text-sans-14 text-secondary">
          No instances in this project yet.
        </span>
      }
    />
  ),
}

export const PinnedColumn: Story = {
  name: 'Pinned first column',
  render: () => (
    <div className="max-w-100">
      <Table data={instances} columns={columns} pinFirstColumn />
    </div>
  ),
}

export const ClickableRows: Story = {
  name: 'Clickable rows',
  render: () => {
    const [selected, setSelected] = useState<string>()

    return (
      <div className="flex flex-col gap-3">
        <Table
          data={instances}
          columns={columns}
          getRowId={(row) => row.name}
          onRowClick={(row) => setSelected(row.name)}
        />
        <p className="text-mono-sm text-tertiary">
          {selected ? `Opened ${selected}` : 'Tab to a row, then press Enter or Space'}
        </p>
      </div>
    )
  },
}

export const RowsWithActions: Story = {
  name: 'Clickable rows with a nested control',
  render: () => {
    const [log, setLog] = useState('nothing yet')

    return (
      <div className="flex flex-col gap-3">
        <Table
          data={instances.slice(0, 3)}
          columns={[
            ...columns.slice(0, 2),
            {
              id: 'actions',
              header: 'Actions',
              cell: ({ row }) => (
                <button
                  type="button"
                  onClick={() => setLog(`stopped ${row.original.name}`)}
                  className="rounded-lg border border-default px-2 py-0.5 text-mono-sm text-secondary transition-colors hover:bg-hover hover:text-default focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Stop
                </button>
              ),
            },
          ]}
          onRowClick={(row) => setLog(`opened ${row.name}`)}
        />
        <p className="text-mono-sm text-tertiary">{log}</p>
      </div>
    )
  },
}
