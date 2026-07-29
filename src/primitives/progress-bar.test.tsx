import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MeterBar, ProgressBar } from './progress-bar'

const fillOf = (role: 'progressbar' | 'meter') => screen.getByRole(role).firstElementChild

describe('ProgressBar', () => {
  it('exposes the full value range', () => {
    render(<ProgressBar value={40} label="Upload" />)

    const bar = screen.getByRole('progressbar', { name: 'Upload' })

    expect(bar).toHaveAttribute('aria-valuenow', '40')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(fillOf('progressbar')).toHaveStyle({ width: '40%' })
  })

  it('clamps above the maximum', () => {
    render(<ProgressBar value={150} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(fillOf('progressbar')).toHaveStyle({ width: '100%' })
  })

  it('clamps below the minimum', () => {
    render(<ProgressBar value={-20} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('treats a non-finite value as zero', () => {
    render(<ProgressBar value={Number.NaN} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('keeps one colour regardless of how full it is', () => {
    render(<ProgressBar value={95} />)

    expect(fillOf('progressbar')).toHaveClass('bg-accent-inverse')
  })
})

describe('MeterBar', () => {
  it('is a meter, not a progressbar', () => {
    render(<MeterBar value={10} />)

    expect(screen.getByRole('meter')).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it.each([
    [0, 'bg-accent-inverse'],
    [74, 'bg-accent-inverse'],
    [75, 'bg-notice-inverse'],
    [90, 'bg-notice-inverse'],
    [90.5, 'bg-error-inverse'],
    [100, 'bg-error-inverse'],
  ])('colours %d%% with %s', (value, expected) => {
    render(<MeterBar value={value} />)

    expect(fillOf('meter')).toHaveClass(expected)
  })

  it('picks the threshold colour from the clamped value', () => {
    render(<MeterBar value={400} />)

    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '100')
    expect(fillOf('meter')).toHaveClass('bg-error-inverse')
  })
})
