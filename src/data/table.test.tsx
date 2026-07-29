import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ColumnDef, Table } from './table'

type Row = { name: string; size: number }

const data: Row[] = [
  { name: 'beta', size: 2 },
  { name: 'alpha', size: 3 },
  { name: 'gamma', size: 1 },
]

const columns: ColumnDef<Row, string | number>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'size', header: 'Size' },
]

const nameHeader = () => screen.getByRole('columnheader', { name: /name/i })
const bodyNames = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.children[0]?.textContent)

describe('Table sorting', () => {
  it('starts unsorted with aria-sort none on every sortable header', () => {
    render(<Table data={data} columns={columns} />)

    expect(nameHeader()).toHaveAttribute('aria-sort', 'none')
    expect(screen.getByRole('columnheader', { name: /size/i })).toHaveAttribute(
      'aria-sort',
      'none',
    )
  })

  it('cycles aria-sort and row order as the header button is pressed', async () => {
    const user = userEvent.setup()
    render(<Table data={data} columns={columns} />)

    expect(bodyNames()).toEqual(['beta', 'alpha', 'gamma'])

    await user.click(screen.getByRole('button', { name: /name/i }))
    expect(nameHeader()).toHaveAttribute('aria-sort', 'ascending')
    expect(bodyNames()).toEqual(['alpha', 'beta', 'gamma'])

    await user.click(screen.getByRole('button', { name: /name/i }))
    expect(nameHeader()).toHaveAttribute('aria-sort', 'descending')
    expect(bodyNames()).toEqual(['gamma', 'beta', 'alpha'])

    await user.click(screen.getByRole('button', { name: /name/i }))
    expect(nameHeader()).toHaveAttribute('aria-sort', 'none')
    expect(bodyNames()).toEqual(['beta', 'alpha', 'gamma'])
  })

  it('leaves aria-sort off a column that cannot be sorted', () => {
    render(
      <Table
        data={data}
        columns={[{ id: 'actions', header: 'Actions', cell: () => 'edit' }]}
      />,
    )

    expect(screen.getByRole('columnheader')).not.toHaveAttribute('aria-sort')
  })
})

describe('Table states', () => {
  it('renders the empty state across the full row when there is no data', () => {
    render(<Table data={[]} columns={columns} emptyState="Nothing here" />)

    const cell = screen.getByRole('cell', { name: 'Nothing here' })
    expect(cell).toHaveAttribute('colspan', '2')
  })

  it('falls back to a default empty message', () => {
    render(<Table data={[]} columns={columns} />)

    expect(screen.getByRole('cell', { name: 'No results' })).toBeInTheDocument()
  })

  it('renders skeleton rows matching the column count instead of data', () => {
    const { container } = render(<Table data={data} columns={columns} loading />)

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('beta')).not.toBeInTheDocument()

    const bodyRows = container.querySelectorAll('tbody tr')
    expect(bodyRows).toHaveLength(5)
    for (const row of bodyRows) expect(row.children).toHaveLength(2)
  })

  it('prefers the skeleton over the empty state while loading', () => {
    render(<Table data={[]} columns={columns} loading />)

    expect(screen.queryByText('No results')).not.toBeInTheDocument()
  })
})

describe('Table rows', () => {
  it('leaves rows inert without onRowClick', () => {
    render(<Table data={data} columns={columns} />)

    expect(screen.queryAllByRole('button')).toHaveLength(2)
    for (const row of screen.getAllByRole('row')) {
      expect(row).not.toHaveAttribute('tabindex')
    }
  })

  it('activates a clickable row by pointer, Enter and Space', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<Table data={data} columns={columns} onRowClick={onRowClick} />)

    const rows = screen.getAllByRole('button').filter((el) => el.tagName === 'TR')
    expect(rows).toHaveLength(3)
    const first = rows[0] as HTMLElement
    expect(first).toHaveAttribute('tabindex', '0')

    await user.click(first)
    expect(onRowClick).toHaveBeenLastCalledWith(data[0])

    first.focus()
    expect(first).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(onRowClick).toHaveBeenCalledTimes(2)
    expect(onRowClick).toHaveBeenLastCalledWith(data[0])

    await user.keyboard(' ')
    expect(onRowClick).toHaveBeenCalledTimes(3)
    expect(onRowClick).toHaveBeenLastCalledWith(data[0])
  })

  it('puts every clickable row in the tab order', async () => {
    const user = userEvent.setup()
    render(<Table data={data} columns={columns} onRowClick={() => {}} />)

    const rows = screen.getAllByRole('button').filter((el) => el.tagName === 'TR')

    await user.tab()
    await user.tab()
    await user.tab()
    expect(rows[0]).toHaveFocus()
  })

  it('ignores activation that came from a control inside the row', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    const onAction = vi.fn()

    render(
      <Table
        data={[data[0] as Row]}
        columns={[
          { accessorKey: 'name', header: 'Name' },
          {
            id: 'actions',
            header: 'Actions',
            cell: () => (
              <button type="button" onClick={onAction}>
                Edit
              </button>
            ),
          },
        ]}
        onRowClick={onRowClick}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it('keys rows by getRowId', () => {
    const getRowId = vi.fn((row: Row) => row.name)
    render(<Table data={data} columns={columns} getRowId={getRowId} />)

    expect(getRowId).toHaveBeenCalled()
    expect(getRowId.mock.results.map((result) => result.value)).toContain('alpha')
  })
})
