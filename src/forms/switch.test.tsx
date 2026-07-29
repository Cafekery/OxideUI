import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Switch } from './switch'

describe('Switch', () => {
  it('is labelled and toggles from the keyboard', async () => {
    const user = userEvent.setup()
    render(<Switch label="Automatic snapshots" />)

    const control = screen.getByRole('switch', { name: 'Automatic snapshots' })
    expect(control).toHaveAttribute('aria-checked', 'false')

    await user.tab()
    expect(control).toHaveFocus()

    await user.keyboard(' ')
    expect(control).toHaveAttribute('aria-checked', 'true')
  })

  it('describes the control and marks it invalid', () => {
    render(<Switch label="Snapshots" description="Nightly." error="Needs a volume." />)
    const control = screen.getByRole('switch')
    const errorId = control.getAttribute('aria-errormessage')

    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(document.getElementById(errorId ?? '')).toHaveTextContent('Needs a volume.')
    expect(control.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    render(<Switch label="Snapshots" disabled />)

    const control = screen.getByRole('switch')
    await user.click(control)
    expect(control).toHaveAttribute('aria-checked', 'false')
  })
})
