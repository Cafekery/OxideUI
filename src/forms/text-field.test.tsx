import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TextField } from './text-field'

describe('TextField', () => {
  it('labels the input and takes typed text', async () => {
    const user = userEvent.setup()
    render(<TextField label="Project name" />)

    const input = screen.getByLabelText('Project name')
    await user.type(input, 'acme-web')
    expect(input).toHaveValue('acme-web')
  })

  it('describes the input and marks it invalid', () => {
    render(
      <TextField
        label="Slug"
        description="Lowercase only."
        error="Uppercase is not allowed."
      />,
    )
    const input = screen.getByRole('textbox')
    const errorId = input.getAttribute('aria-errormessage')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(document.getElementById(errorId ?? '')).toHaveTextContent(
      'Uppercase is not allowed.',
    )
    expect(input.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
  })

  it('renders the leading and trailing slots and pads the input around them', () => {
    render(
      <TextField
        label="Memory"
        leading={<span>@</span>}
        trailing={<span>GiB</span>}
        placeholder="16"
      />,
    )
    const input = screen.getByRole('textbox')

    expect(screen.getByText('@')).toBeInTheDocument()
    expect(screen.getByText('GiB')).toBeInTheDocument()
    expect(input).toHaveClass('pl-9', 'pr-9')
  })

  it('appends the caller className after its own', () => {
    render(<TextField label="Slug" className="h-8!" />)

    expect(screen.getByRole('textbox').className.endsWith('h-8!')).toBe(true)
  })

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup()
    render(<TextField label="Slug" disabled />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'nope')
    expect(input).toBeDisabled()
    expect(input).toHaveValue('')
  })
})
