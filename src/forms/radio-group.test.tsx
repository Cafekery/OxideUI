import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { RadioGroup, RadioGroupItem } from './radio-group'

const sizes = (
  <>
    <RadioGroupItem value="small" label="Small" />
    <RadioGroupItem value="medium" label="Medium" />
    <RadioGroupItem value="large" label="Large" />
  </>
)

describe('RadioGroup', () => {
  it('names the group with its label and each option with its own', () => {
    render(<RadioGroup label="Deployment size">{sizes}</RadioGroup>)

    expect(
      screen.getByRole('radiogroup', { name: 'Deployment size' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Medium' })).toBeInTheDocument()
  })

  it('walks the options with the arrow keys and selects with space', async () => {
    const user = userEvent.setup()
    render(
      <RadioGroup label="Deployment size" defaultValue="small">
        {sizes}
      </RadioGroup>,
    )

    await user.tab()
    expect(screen.getByRole('radio', { name: 'Small' })).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Medium' })).toHaveFocus()

    await user.keyboard(' ')
    expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Small' })).not.toBeChecked()
  })

  it('enters an unselected group at the first item and selects with space', async () => {
    const user = userEvent.setup()
    render(<RadioGroup label="Deployment size">{sizes}</RadioGroup>)

    await user.tab()
    await user.keyboard(' ')
    expect(screen.getByRole('radio', { name: 'Small' })).toBeChecked()
  })

  it('skips a disabled option when arrowing', async () => {
    const user = userEvent.setup()
    render(
      <RadioGroup label="Deployment size" defaultValue="small">
        <RadioGroupItem value="small" label="Small" />
        <RadioGroupItem value="medium" label="Medium" disabled />
        <RadioGroupItem value="large" label="Large" />
      </RadioGroup>,
    )

    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Large' })).toHaveFocus()

    await user.keyboard(' ')
    expect(screen.getByRole('radio', { name: 'Large' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Medium' })).not.toBeChecked()
  })

  it('reports invalid state and the error message on the group', () => {
    render(
      <RadioGroup
        label="Deployment size"
        description="Resize later."
        error="Pick a size."
      >
        {sizes}
      </RadioGroup>,
    )
    const group = screen.getByRole('radiogroup', { name: 'Deployment size' })
    const errorId = group.getAttribute('aria-errormessage')

    expect(group).toHaveAttribute('aria-invalid', 'true')
    expect(document.getElementById(errorId ?? '')).toHaveTextContent('Pick a size.')
    expect(group.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
  })
})
