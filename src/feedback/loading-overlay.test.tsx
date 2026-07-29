import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoadingOverlay } from './loading-overlay'

const Host = ({ active }: { active: boolean }) => (
  <div className="relative" data-testid="host">
    <button type="button">Focusable</button>
    <LoadingOverlay active={active} />
  </div>
)

describe('LoadingOverlay', () => {
  it('renders nothing while inactive so it cannot trap focus or reach a reader', () => {
    const { getByTestId } = render(<Host active={false} />)
    const host = getByTestId('host')

    expect(host.querySelector('[role="status"]')).toBeNull()
    expect(host).not.toHaveAttribute('aria-busy')
  })

  it('marks the covered container busy only while active', () => {
    const { getByTestId, rerender } = render(<Host active />)
    const host = getByTestId('host')
    expect(host).toHaveAttribute('aria-busy', 'true')

    rerender(<Host active={false} />)
    expect(host).not.toHaveAttribute('aria-busy')
  })

  it('restores a busy value the container was already managing', () => {
    const { getByTestId, rerender } = render(
      <div aria-busy="false" data-testid="host">
        <LoadingOverlay active />
      </div>,
    )
    const host = getByTestId('host')
    expect(host).toHaveAttribute('aria-busy', 'true')

    rerender(
      <div aria-busy="false" data-testid="host">
        <LoadingOverlay active={false} />
      </div>,
    )
    expect(host).toHaveAttribute('aria-busy', 'false')
  })
})
