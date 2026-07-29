import type { Meta, StoryObj } from '../../workbench/csf'
import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Close,
  Copy,
  DotsHorizontal,
  ExternalLink,
  Filter,
  InfoCircle,
  Minus,
  Plus,
  Search,
} from './icons'

const ICONS: [string, typeof Check][] = [
  ['ChevronDown', ChevronDown],
  ['ChevronUp', ChevronUp],
  ['ChevronLeft', ChevronLeft],
  ['ChevronRight', ChevronRight],
  ['Check', Check],
  ['Close', Close],
  ['Search', Search],
  ['Minus', Minus],
  ['Plus', Plus],
  ['DotsHorizontal', DotsHorizontal],
  ['ExternalLink', ExternalLink],
  ['Copy', Copy],
  ['AlertTriangle', AlertTriangle],
  ['InfoCircle', InfoCircle],
  ['CircleCheck', CircleCheck],
  ['Calendar', Calendar],
  ['Filter', Filter],
]

const SIZES = ['text-sans-16', 'text-sans-28']

const meta = { title: 'Icons', component: Check } satisfies Meta<typeof Check>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {SIZES.map((size) => (
        <section key={size} className="flex flex-col gap-3">
          <h2 className="text-mono-sm text-tertiary">{size}</h2>
          <div className="grid grid-cols-6 gap-px bg-secondary shadow-border">
            {ICONS.map(([name, Glyph]) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 bg-default p-4 text-default"
              >
                <Glyph className={size} />
                <span className="text-mono-xs text-tertiary">{name}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}
