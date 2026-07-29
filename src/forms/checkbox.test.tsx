import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './checkbox'

const box = () => screen.getByRole('checkbox')

describe('Checkbox', () => {
  it('is labelled by its own label element', () => {
    render(<Checkbox label="Notify me" />)

    expect(screen.getByLabelText('Notify me')).toBe(box())
    expect(box()).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles from the keyboard', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Notify me" />)

    await user.tab()
    expect(box()).toHaveFocus()

    await user.keyboard(' ')
    expect(box()).toHaveAttribute('aria-checked', 'true')
  })

  it('renders the check glyph when checked', () => {
    render(<Checkbox label="Notify me" checked />)

    expect(box()).toHaveAttribute('aria-checked', 'true')
    expect(box().querySelector('[data-glyph="check"]')).toBeInTheDocument()
    expect(box().querySelector('[data-glyph="minus"]')).toBeNull()
  })

  it('renders the minus glyph and a mixed state when indeterminate', () => {
    render(<Checkbox label="Select all" checked="indeterminate" />)

    expect(box()).toHaveAttribute('aria-checked', 'mixed')
    expect(box()).toHaveAttribute('data-state', 'indeterminate')
    expect(box().querySelector('[data-glyph="minus"]')).toBeInTheDocument()
    expect(box().querySelector('[data-glyph="check"]')).toBeNull()
  })

  it('renders no glyph when unchecked', () => {
    render(<Checkbox label="Notify me" />)

    expect(box().querySelector('[data-glyph]')).toBeNull()
  })

  it('leaves an indeterminate checkbox for the caller to resolve when controlled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <Checkbox
        label="Select all"
        checked="indeterminate"
        onCheckedChange={onCheckedChange}
      />,
    )

    await user.click(box())
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(box()).toHaveAttribute('aria-checked', 'mixed')
  })

  it('resolves an indeterminate default to checked on click', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Select all" defaultChecked="indeterminate" />)

    expect(box().querySelector('[data-glyph="minus"]')).toBeInTheDocument()

    await user.click(box())
    expect(box()).toHaveAttribute('aria-checked', 'true')
    expect(box().querySelector('[data-glyph="check"]')).toBeInTheDocument()
  })

  it('wires description and error text to the control', () => {
    render(
      <Checkbox
        label="Accept terms"
        description="Required to continue"
        error="Please accept"
      />,
    )

    expect(box()).toHaveAttribute('aria-invalid', 'true')
    const errorId = box().getAttribute('aria-errormessage')
    expect(document.getElementById(errorId ?? '')).toHaveTextContent('Please accept')
    expect(box().getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
  })
})
