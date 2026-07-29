import type { Meta, StoryObj } from '../../workbench/csf'
import { Button } from '../primitives'
import { Toaster, toast } from './toast'

const meta = { component: Toaster, title: 'Overlays/Toast' } satisfies Meta<
  typeof Toaster
>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <Button variant="secondary" onClick={() => toast.success('Instance started')}>
        Show toast
      </Button>
    </>
  ),
}

export const Variants: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => toast.success('Instance started')}>
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.error('Could not start instance', {
              description: 'No capacity in us-west-1.',
            })
          }
        >
          Error
        </Button>
        <Button variant="secondary" onClick={() => toast.info('Snapshot queued')}>
          Info
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.notice('Quota is 90% used', { description: '18 of 20 vCPU.' })
          }
        >
          Notice
        </Button>
        <Button variant="secondary" onClick={() => toast.loading('Provisioning…')}>
          Loading
        </Button>
        <Button variant="secondary" onClick={() => toast.dismiss()}>
          Dismiss all
        </Button>
      </div>
    </>
  ),
}

export const PromiseFlow: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="secondary"
        onClick={() =>
          toast.promise(new Promise<void>((resolve) => setTimeout(resolve, 1500)), {
            loading: 'Creating snapshot…',
            success: 'Snapshot created',
            error: 'Snapshot failed',
          })
        }
      >
        Run promise
      </Button>
    </>
  ),
}
