import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Field } from './field'

const renderField = (props: Partial<Parameters<typeof Field>[0]> = {}) =>
  render(
    <Field label="Project name" {...props}>
      {({ id, describedBy, errorId, invalid }) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-errormessage={errorId}
          aria-invalid={invalid || undefined}
        />
      )}
    </Field>,
  )

describe('Field', () => {
  it('associates the label with the control it wires', () => {
    renderField()
    expect(screen.getByLabelText('Project name')).toBe(screen.getByRole('textbox'))
  })

  it('describes the control with the description text', () => {
    renderField({ description: 'Lowercase, no spaces.' })
    const input = screen.getByRole('textbox')
    const described = document.getElementById(
      input.getAttribute('aria-describedby') ?? '',
    )

    expect(described).toHaveTextContent('Lowercase, no spaces.')
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(input).not.toHaveAttribute('aria-errormessage')
  })

  it('marks the control invalid and points at the error message', () => {
    renderField({ error: 'Already taken' })
    const input = screen.getByRole('textbox')
    const errorId = input.getAttribute('aria-errormessage')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(document.getElementById(errorId ?? '')).toHaveTextContent('Already taken')
    expect(input.getAttribute('aria-describedby')).toContain(errorId)
  })

  it('references both description and error at once', () => {
    renderField({ description: 'Lowercase, no spaces.', error: 'Already taken' })
    const ids =
      screen.getByRole('textbox').getAttribute('aria-describedby')?.split(' ') ?? []

    expect(ids).toHaveLength(2)
    expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual([
      'Lowercase, no spaces.',
      'Already taken',
    ])
  })

  it('keeps ids unique across instances', () => {
    renderField()
    renderField()
    const [first, second] = screen.getAllByRole('textbox')

    expect(first?.id).not.toBe(second?.id)
  })

  it('names composite controls with aria-labelledby instead of htmlFor', () => {
    render(
      <Field label="Size" group>
        {({ labelId }) => (
          <div role="radiogroup" aria-labelledby={labelId}>
            <span />
          </div>
        )}
      </Field>,
    )

    expect(screen.getByRole('radiogroup', { name: 'Size' })).toBeInTheDocument()
    expect(document.querySelector('label')).toBeNull()
  })

  it('marks required fields with a marker hidden from assistive tech', () => {
    renderField({ required: true })

    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByLabelText('Project name')).toBeInTheDocument()
  })
})
