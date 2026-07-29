import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppShell } from './app-shell'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'

const shell = (
  <AppShell sidebar={<Sidebar>navigation</Sidebar>} topBar={<TopBar>Batches</TopBar>}>
    page content
  </AppShell>
)

describe('AppShell', () => {
  it('puts a skip link first in the tab order, pointed at main', async () => {
    const user = userEvent.setup()
    render(shell)

    await user.tab()

    const skip = screen.getByRole('link', { name: 'Skip to content' })
    const main = screen.getByRole('main')

    expect(skip).toHaveFocus()
    expect(main.id).not.toBe('')
    expect(skip).toHaveAttribute('href', `#${main.id}`)
  })

  it('makes main focusable so the skip link moves focus rather than only scrolling', () => {
    render(shell)
    const main = screen.getByRole('main')

    main.focus()

    expect(main).toHaveFocus()
  })

  it('exposes one main and one labelled nav landmark', () => {
    render(shell)

    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
  })
})
