import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ErrorState } from './error-state'

const SECRET = 'connect ECONNREFUSED postgres://admin:hunter2@10.0.0.4:5432'

describe('ErrorState', () => {
  it('never renders the error value by default', () => {
    render(<ErrorState error={new Error(SECRET)} />)

    expect(screen.queryByText(new RegExp(SECRET))).toBeNull()
    expect(document.body.textContent).not.toContain('hunter2')
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('keeps the error hidden when showDetails is omitted but details are asked for elsewhere', () => {
    render(<ErrorState description="Could not load the run." error={SECRET} />)

    expect(document.body.textContent).not.toContain('hunter2')
    expect(screen.queryByText('Technical detail')).toBeNull()
  })

  it('surfaces the error behind a collapsed details element when showDetails is true', () => {
    render(<ErrorState error={new Error(SECRET)} showDetails />)

    const details = screen.getByText('Technical detail').closest('details')
    expect(details).not.toBeNull()
    expect(details).not.toHaveAttribute('open')
    expect(details?.textContent).toContain('hunter2')
  })

  it.each([
    ['a string', 'plain failure text', 'plain failure text'],
    ['a plain object', { code: 502 }, '"code": 502'],
    ['a number', 404, '404'],
    ['null', null, 'null'],
  ])('normalises %s without throwing', (_label, error, expected) => {
    expect(() => render(<ErrorState error={error} showDetails />)).not.toThrow()
    expect(screen.getByText(new RegExp(expected, 's'))).toBeInTheDocument()
  })

  it('normalises a circular value without throwing', () => {
    const circular: Record<string, unknown> = { name: 'loop' }
    circular.self = circular

    expect(() => render(<ErrorState error={circular} showDetails />)).not.toThrow()
    expect(screen.getByText('This value could not be displayed.')).toBeInTheDocument()
  })

  it('normalises a value with a throwing toString without throwing', () => {
    const hostile = {
      toJSON() {
        throw new Error('nope')
      },
    }

    expect(() => render(<ErrorState error={hostile} showDetails />)).not.toThrow()
  })

  it('omits the retry control until onRetry is supplied', () => {
    const { unmount } = render(<ErrorState />)
    expect(screen.queryByRole('button', { name: /retry/i })).toBeNull()
    unmount()

    render(<ErrorState onRetry={() => {}} />)
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })
})
