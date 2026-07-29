import { render, screen, waitFor } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useChartTheme } from './use-chart-theme'

const Probe = () => <output>{useChartTheme().axis}</output>

const DARK_AXIS = 'dark-axis-token'
const LIGHT_AXIS = 'light-axis-token'

describe('useChartTheme', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.documentElement.removeAttribute('data-theme')
    document.head.replaceChildren()
  })

  it('falls back to currentColor with no window to read tokens from', () => {
    vi.stubGlobal('window', undefined)

    expect(renderToStaticMarkup(<Probe />)).toContain('currentColor')
  })

  it('re-reads the tokens when the document theme changes', async () => {
    const style = document.createElement('style')
    style.textContent = `
      :root { --content-tertiary: ${DARK_AXIS}; }
      [data-theme='light'] { --content-tertiary: ${LIGHT_AXIS}; }
    `
    document.head.append(style)

    render(<Probe />)
    expect(screen.getByRole('status')).toHaveTextContent(DARK_AXIS)

    document.documentElement.dataset.theme = 'light'

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(LIGHT_AXIS))
  })
})
