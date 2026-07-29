import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button, IconButton } from './button'

describe('Button', () => {
  it('disables itself and reports busy while loading', () => {
    render(<Button loading>Save</Button>)

    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('leaves the label in the DOM while loading so the width holds', () => {
    render(<Button loading>Save</Button>)

    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('swallows clicks while loading', () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    )

    fireEvent.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('is idle by default', () => {
    render(<Button>Save</Button>)

    const button = screen.getByRole('button')

    expect(button).toBeEnabled()
    expect(button).not.toHaveAttribute('aria-busy')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('reports disabled without reporting busy', () => {
    render(<Button disabled>Save</Button>)

    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(button).not.toHaveAttribute('aria-busy')
  })

  it('defaults to type=button so it cannot submit a surrounding form', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})

describe('IconButton', () => {
  it('replaces its glyph with the spinner while loading', () => {
    render(
      <IconButton aria-label="Refresh" loading>
        <svg data-testid="glyph" />
      </IconButton>,
    )

    expect(screen.queryByTestId('glyph')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refresh/i })).toBeDisabled()
  })
})
