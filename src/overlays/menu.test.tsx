import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Menu, MenuItem } from './menu'

globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('Menu', () => {
  it('fires the selected item and closes', async () => {
    const onSelect = vi.fn()
    const onDisabledSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <Menu trigger={<button type="button">Actions</button>}>
        <MenuItem onSelect={onSelect}>Copy ID</MenuItem>
        <MenuItem disabled onSelect={onDisabledSelect}>
          Transfer
        </MenuItem>
      </Menu>,
    )

    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Copy ID' }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onDisabledSelect).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('closes on Escape without selecting anything', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <Menu trigger={<button type="button">Actions</button>}>
        <MenuItem onSelect={onSelect}>Copy ID</MenuItem>
      </Menu>,
    )

    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await screen.findByRole('menu')
    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus()
  })
})
