import type { Meta, StoryObj } from '../../workbench/csf'
import { Badge } from './badge'
import { Button } from './button'
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from './card'

const meta = { component: Card } satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Instance</CardTitle>
        <Badge variant="success">running</Badge>
      </CardHeader>
      <CardBody>
        Four vCPU, 16 GiB memory, provisioned in us-west. Attached to the production
        network.
      </CardBody>
      <CardFooter>
        <Button variant="ghost" size="sm">
          Reboot
        </Button>
        <Button variant="danger" size="sm">
          Terminate
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const BodyOnly: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardBody>No header, no footer — the wrapper is the whole component.</CardBody>
    </Card>
  ),
}

export const Sections: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Header and body</CardTitle>
        </CardHeader>
        <CardBody>A bottom rule separates the header from the content.</CardBody>
      </Card>
      <Card>
        <CardBody>A top rule separates the content from the footer.</CardBody>
        <CardFooter>
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
    </div>
  ),
}
