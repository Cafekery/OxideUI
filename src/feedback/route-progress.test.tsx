import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RouteProgress } from './route-progress'

const bar = (container: HTMLElement) =>
  container.querySelector('[data-phase]') as HTMLElement

describe('RouteProgress', () => {
  it('completes and announces when active flips false', () => {
    const { container, rerender } = render(<RouteProgress active />)
    expect(bar(container)).toHaveAttribute('data-phase', 'loading')
    expect(screen.getByText('Loading page')).toBeInTheDocument()

    rerender(<RouteProgress active={false} />)
    expect(bar(container)).toHaveAttribute('data-phase', 'done')
    expect(screen.getByText('Page loaded')).toBeInTheDocument()
  })

  it('stays idle and silent when it never became active', () => {
    const { container } = render(<RouteProgress active={false} />)

    expect(bar(container)).toHaveAttribute('data-phase', 'idle')
    expect(screen.queryByText('Page loaded')).toBeNull()
    expect(screen.queryByText('Loading page')).toBeNull()
  })

  it('hides the bar from assistive tech and pairs it with a polite live region', () => {
    const { container } = render(<RouteProgress active />)

    expect(bar(container)).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('Loading page')).toHaveAttribute('aria-live', 'polite')
  })
})
