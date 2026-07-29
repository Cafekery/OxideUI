import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('labels the textarea and describes it', () => {
    render(<Textarea label="Description" description="Markdown is supported." />)
    const control = screen.getByLabelText('Description')

    expect(control.tagName).toBe('TEXTAREA')
    const describedBy = control.getAttribute('aria-describedby')
    expect(document.getElementById(describedBy ?? '')).toHaveTextContent(
      'Markdown is supported.',
    )
  })

  it('marks it invalid and points at the error message', () => {
    render(<Textarea label="Description" error="Too short." />)
    const control = screen.getByRole('textbox')
    const errorId = control.getAttribute('aria-errormessage')

    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(document.getElementById(errorId ?? '')).toHaveTextContent('Too short.')
  })
})
