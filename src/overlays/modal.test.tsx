import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Modal, ModalBody } from './modal'

function Harness() {
  const [open, setOpen] = useState(false)
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Settings"
      trigger={<button type="button">Open</button>}
    >
      <ModalBody>
        <button type="button">Inside</button>
      </ModalBody>
    </Modal>
  )
}

/** A modal marks everything outside it `pointer-events: none`, which user-event
 *  refuses to click through — the scrim test opts out of that guard. */
const openModal = async (options?: Parameters<typeof userEvent.setup>[0]) => {
  const user = userEvent.setup(options)
  render(<Harness />)
  await user.click(screen.getByRole('button', { name: 'Open' }))
  await screen.findByRole('dialog')
  return user
}

const expectClosedAndRestored = async () => {
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  await waitFor(() => expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus())
}

describe('Modal', () => {
  it('opens from its trigger and labels itself with the title', async () => {
    await openModal()

    expect(screen.getByRole('dialog')).toHaveAccessibleName('Settings')
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = await openModal()

    await user.keyboard('{Escape}')

    await expectClosedAndRestored()
  })

  it('closes on the close button and restores focus to the trigger', async () => {
    const user = await openModal()

    await user.click(screen.getByRole('button', { name: 'Close' }))

    await expectClosedAndRestored()
  })

  it('closes when the scrim behind it is clicked', async () => {
    const user = await openModal({ pointerEventsCheck: 0 })

    await user.click(document.body)

    await expectClosedAndRestored()
  })

  it('keeps Tab inside the dialog while open', async () => {
    await openModal()
    const dialog = screen.getByRole('dialog')

    for (let i = 0; i < 4; i++) {
      await userEvent.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
  })
})
