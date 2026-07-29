import type { Meta, StoryObj } from '../../workbench/csf'
import { ErrorState } from './error-state'

const meta = { component: ErrorState } satisfies Meta<typeof ErrorState>
export default meta
type Story = StoryObj<typeof meta>

const FAILURE = new Error(
  'GET /v1/projects/dogfood/instances failed: 503 upstream unavailable',
)

export const Default: Story = {}

export const WithRetry: Story = { args: { onRetry: () => {} } }

export const CustomCopy: Story = {
  args: {
    title: 'Could not load instances',
    description: 'The project may still be provisioning. Retry in a moment.',
    onRetry: () => {},
  },
}

export const ErrorWithheld: Story = {
  args: { error: FAILURE, onRetry: () => {} },
}

export const WithDetails: Story = {
  args: { error: FAILURE, showDetails: true, onRetry: () => {} },
}

export const OnAContainerBackground: Story = {
  render: () => (
    <div className="rounded-lg bg-raise shadow-border">
      <ErrorState error={FAILURE} onRetry={() => {}} showDetails />
    </div>
  ),
}
