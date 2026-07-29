import { useState } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { Button } from '../primitives'
import { Modal, ModalBody, ModalFooter, type ModalSize } from './modal'

const meta = {
  component: Modal,
  title: 'Overlays/Modal',
  args: { size: 'base' },
  argTypes: { size: { control: 'select', options: ['sm', 'base', 'lg'] } },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

function Demo({ size = 'base', label }: { size?: ModalSize; label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      size={size}
      title="Delete project"
      description="This removes the project and every deployment under it."
      trigger={<Button variant="secondary">{label}</Button>}
    >
      <ModalBody>
        <p>
          Deleting <strong className="text-raise">atlas-prod</strong> is permanent. Any
          running instance is stopped immediately and its storage is released.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => setOpen(false)}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export const Default: Story = {
  render: (args) => <Demo size={args.size} label="Open modal" />,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2">
      <Demo size="sm" label="Small" />
      <Demo size="base" label="Base" />
      <Demo size="lg" label="Large" />
    </div>
  ),
}

const LINES = Array.from({ length: 24 }, (_, i) => `Line ${i + 1}`)

function LongDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Release notes"
      trigger={<Button variant="secondary">Open long modal</Button>}
    >
      <ModalBody>
        <div className="flex flex-col gap-3">
          {LINES.map((line) => (
            <p key={line}>
              {line} — the body scrolls on its own and never scrolls the page behind it.
            </p>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => setOpen(false)}>Done</Button>
      </ModalFooter>
    </Modal>
  )
}

export const ScrollingBody: Story = { render: () => <LongDemo /> }
