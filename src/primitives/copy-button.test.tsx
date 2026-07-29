import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CopyButton } from './copy-button'

const writeText = vi.fn<(value: string) => Promise<void>>()

Object.defineProperty(navigator, 'clipboard', {
  value: { writeText },
  configurable: true,
})

const click = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole('button'))
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  writeText.mockReset()
  writeText.mockResolvedValue(undefined)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('CopyButton', () => {
  it('writes the value to the clipboard', async () => {
    render(<CopyButton value="oxide" />)

    await click()

    expect(writeText).toHaveBeenCalledWith('oxide')
  })

  it('confirms the copy, then reverts', async () => {
    render(<CopyButton value="oxide" />)

    await click()

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    expect(screen.getByText('Copied')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    expect(screen.queryByText('Copied')).not.toBeInTheDocument()
  })

  it('restarts the confirmation when copied again mid-flash', async () => {
    render(<CopyButton value="oxide" />)

    await click()
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    await click()
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('stays quiet when the clipboard rejects', async () => {
    writeText.mockRejectedValue(new Error('denied'))
    render(<CopyButton value="oxide" />)

    await click()

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    expect(screen.queryByText('Copied')).not.toBeInTheDocument()
  })

  it('survives an unmount mid-confirmation', async () => {
    const { unmount } = render(<CopyButton value="oxide" />)

    await click()
    unmount()

    expect(() => {
      act(() => {
        vi.advanceTimersByTime(1500)
      })
    }).not.toThrow()
  })
})
