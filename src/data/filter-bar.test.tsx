import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar, type FilterChip } from './filter-bar'

const filters: FilterChip[] = [
  { id: 'state', label: 'State', value: 'running' },
  { id: 'region', label: 'Region', value: 'west-2' },
]

describe('FilterBar', () => {
  it('renders nothing when there are no filters', () => {
    const { container } = render(
      <FilterBar filters={[]} onRemove={() => {}} onClearAll={() => {}} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('names what removing each chip does', () => {
    render(<FilterBar filters={filters} onRemove={() => {}} />)

    expect(
      screen.getByRole('button', { name: 'Remove filter State: running' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Remove filter Region: west-2' }),
    ).toBeInTheDocument()
  })

  it('reports the removed filter by id', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<FilterBar filters={filters} onRemove={onRemove} />)

    await user.click(screen.getByRole('button', { name: /Region/ }))
    expect(onRemove).toHaveBeenCalledWith('region')
  })

  it('shows clear all only when a handler is supplied', async () => {
    const user = userEvent.setup()
    const onClearAll = vi.fn()

    const { rerender } = render(<FilterBar filters={filters} onRemove={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument()

    rerender(<FilterBar filters={filters} onRemove={() => {}} onClearAll={onClearAll} />)
    await user.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(onClearAll).toHaveBeenCalledTimes(1)
  })

  it('exposes the chips as a labelled list', () => {
    render(<FilterBar filters={filters} onRemove={() => {}} />)

    expect(screen.getByRole('list', { name: 'Active filters' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
