import type { Meta, StoryObj } from '../../workbench/csf'
import { Card, CardBody, CardHeader } from './card'
import { Skeleton } from './skeleton'

const meta = { component: Skeleton } satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <Skeleton className="h-4 w-48" /> }

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  ),
}

export const LoadingCard: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </CardBody>
    </Card>
  ),
}
