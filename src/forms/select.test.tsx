import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Select } from './select'

const options = [
  { value: 'us-west', label: 'US West' },
  { value: 'us-east', label: 'US East' },
  { value: 'ap-south', label: 'AP South', disabled: true },
]

beforeAll(() => {
  // Radix Select drives its popper through APIs jsdom does not implement.
  Element.prototype.scrollIntoView = vi.fn()
  Element.prototype.hasPointerCapture = vi.fn(() => false)
  Element.prototype.releasePointerCapture = vi.fn()
})

describe('Select', () => {
  it('labels the trigger and shows the placeholder until something is chosen', () => {
    render(<Select label="Region" options={options} placeholder="Pick a region" />)
    const trigger = screen.getByRole('combobox', { name: 'Region' })

    expect(trigger).toHaveTextContent('Pick a region')
    expect(trigger).toHaveAttribute('data-placeholder')
  })

  it('shows the selected option label', () => {
    render(<Select label="Region" options={options} defaultValue="us-east" />)

    expect(screen.getByRole('combobox', { name: 'Region' })).toHaveTextContent('US East')
  })

  it('opens from the keyboard and selects an option', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Select
        label="Region"
        options={options}
        placeholder="Pick a region"
        onValueChange={onValueChange}
      />,
    )

    await user.tab()
    expect(screen.getByRole('combobox')).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(await screen.findByRole('option', { name: 'US West' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'AP South' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )

    await user.keyboard('{ArrowDown}{Enter}')
    expect(onValueChange).toHaveBeenCalledWith('us-east')
  })

  it('reports invalid state and the error message', () => {
    render(
      <Select
        label="Region"
        options={options}
        description="Closest wins."
        error="Pick one."
      />,
    )
    const trigger = screen.getByRole('combobox', { name: 'Region' })
    const errorId = trigger.getAttribute('aria-errormessage')

    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(document.getElementById(errorId ?? '')).toHaveTextContent('Pick one.')
    expect(trigger.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
  })

  it('disables the trigger', () => {
    render(<Select label="Region" options={options} disabled />)

    expect(screen.getByRole('combobox', { name: 'Region' })).toBeDisabled()
  })
})
