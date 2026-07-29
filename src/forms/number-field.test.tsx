import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NumberField } from './number-field'

const spin = () => screen.getByRole('spinbutton')

describe('NumberField', () => {
  it('exposes its label, bounds and current value to assistive tech', () => {
    render(<NumberField label="Quantity" defaultValue={3} min={1} max={9} />)

    expect(screen.getByLabelText('Quantity')).toBe(spin())
    expect(spin()).toHaveAttribute('aria-valuenow', '3')
    expect(spin()).toHaveAttribute('aria-valuemin', '1')
    expect(spin()).toHaveAttribute('aria-valuemax', '9')
  })

  it('steps with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<NumberField label="Quantity" defaultValue={2} />)

    await user.click(spin())
    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(spin()).toHaveValue('4')

    await user.keyboard('{ArrowDown}')
    expect(spin()).toHaveValue('3')
  })

  it('steps by a fractional step without float drift', async () => {
    const user = userEvent.setup()
    render(<NumberField label="Rate" defaultValue={0.1} step={0.1} />)

    await user.click(spin())
    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(spin()).toHaveValue('0.3')
  })

  it('clamps keyboard stepping to min and max', async () => {
    const user = userEvent.setup()
    render(<NumberField label="Quantity" defaultValue={9} min={1} max={10} />)

    await user.click(spin())
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}')
    expect(spin()).toHaveValue('10')

    await user.keyboard('{ArrowDown}'.repeat(12))
    expect(spin()).toHaveValue('1')
  })

  it('clamps typed input and shows the corrected value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <NumberField
        label="Quantity"
        defaultValue={1}
        max={10}
        onValueChange={onValueChange}
      />,
    )

    await user.clear(spin())
    await user.type(spin(), '99')
    expect(onValueChange).toHaveBeenLastCalledWith(10)
    expect(spin()).toHaveValue('10')
  })

  it('keeps in-progress decimal text intact while typing', async () => {
    const user = userEvent.setup()
    render(<NumberField label="Rate" defaultValue={0} step={0.1} />)

    await user.clear(spin())
    await user.type(spin(), '0.')
    expect(spin()).toHaveValue('0.')

    await user.type(spin(), '5')
    expect(spin()).toHaveValue('0.5')
  })

  it('snaps back to the resolved value on blur', async () => {
    const user = userEvent.setup()
    render(<NumberField label="Quantity" defaultValue={4} />)

    await user.clear(spin())
    expect(spin()).toHaveValue('')

    await user.tab()
    expect(spin()).toHaveValue('4')
  })

  it('reports steps but never moves on its own when controlled', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<NumberField label="Quantity" value={5} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Increase Quantity' }))
    expect(onValueChange).toHaveBeenCalledWith(6)
    expect(spin()).toHaveValue('5')

    await user.click(screen.getByRole('button', { name: 'Decrease Quantity' }))
    expect(onValueChange).toHaveBeenLastCalledWith(4)
    expect(spin()).toHaveValue('5')
  })

  it('disables the stepper that would leave the range', () => {
    render(<NumberField label="Quantity" value={1} min={1} max={3} />)

    expect(screen.getByRole('button', { name: 'Decrease Quantity' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Increase Quantity' })).toBeEnabled()
  })
})
