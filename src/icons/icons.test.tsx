import { render } from '@testing-library/react'
import { Close } from './icons'

describe('Icon shell', () => {
  it('is decorative by default', () => {
    const { container } = render(<Close />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('lets a caller opt into being labelled', () => {
    const { getByLabelText } = render(<Close aria-hidden={false} aria-label="Dismiss" />)
    expect(getByLabelText('Dismiss').tagName).toBe('svg')
  })
})
