import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { type BreadcrumbItem, Breadcrumbs } from './breadcrumbs'

const trail: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Cafekery', to: '/cafekery' },
  { label: 'Roasting', to: '/cafekery/roasting' },
  { label: 'Batches', to: '/cafekery/roasting/batches' },
  { label: 'batch-104' },
]

describe('Breadcrumbs', () => {
  it('marks the last crumb as the current page instead of a link', () => {
    render(<Breadcrumbs items={trail.slice(0, 3)} />)

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByText('Roasting')).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Roasting' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  })

  it('keeps every crumb at the collapse threshold', () => {
    render(<Breadcrumbs items={trail.slice(0, 4)} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.queryByText('…')).toBeNull()
  })

  it('collapses the middle of a longer trail', () => {
    render(<Breadcrumbs items={trail} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByText('…')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.queryByText('Cafekery')).toBeNull()
    expect(screen.queryByText('Roasting')).toBeNull()
    expect(screen.getByText('Batches')).toBeInTheDocument()
    expect(screen.getByText('batch-104')).toHaveAttribute('aria-current', 'page')
  })
})
