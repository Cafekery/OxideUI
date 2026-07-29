import type { Meta, StoryObj } from '../../workbench/csf'
import { AreaChart } from './area-chart'
import { BarChart } from './bar-chart'
import type { ChartSeries, TickFormatter } from './chart-parts'
import { LineChart } from './line-chart'
import { Sparkline } from './sparkline'
import { useChartTheme } from './use-chart-theme'

const HOUR = 3_600_000
const START = Date.UTC(2026, 6, 28)

const traffic = Array.from({ length: 24 }, (_, i) => ({
  at: START + i * HOUR,
  requests: Math.round(1400 + 620 * Math.sin(i / 3.4) + 240 * Math.cos(i / 1.7)),
}))

const latency = Array.from({ length: 24 }, (_, i) => ({
  at: START + i * HOUR,
  p50: Math.round(38 + 9 * Math.sin(i / 4)),
  p95: Math.round(96 + 28 * Math.sin(i / 2.6)),
  p99: Math.round(210 + 74 * Math.cos(i / 3.1)),
}))

const p50: ChartSeries = { key: 'p50', label: 'p50' }
const p95: ChartSeries = { key: 'p95', label: 'p95' }
const p99: ChartSeries = { key: 'p99', label: 'p99' }
const latencySeries = [p50, p95, p99]

const spend = [
  { day: 'Mon', compute: 412, storage: 118 },
  { day: 'Tue', compute: 388, storage: 124 },
  { day: 'Wed', compute: 501, storage: 131 },
  { day: 'Thu', compute: 476, storage: 129 },
  { day: 'Fri', compute: 544, storage: 142 },
  { day: 'Sat', compute: 231, storage: 139 },
  { day: 'Sun', compute: 198, storage: 137 },
]

const spendSeries: ChartSeries[] = [
  { key: 'compute', label: 'Compute' },
  { key: 'storage', label: 'Storage' },
]

const instances = [
  { name: 'api-gateway', trend: [12, 18, 15, 24, 22, 31, 28, 36] },
  { name: 'ingest-worker', trend: [44, 39, 41, 30, 28, 22, 25, 17] },
  { name: 'scheduler', trend: [8, 9, 8, 11, 10, 12, 11, 13] },
]

const hour = new Intl.DateTimeFormat('en-US', { hour: 'numeric', timeZone: 'UTC' })
const compact = new Intl.NumberFormat('en-US', { notation: 'compact' })
const millis = new Intl.NumberFormat('en-US', {
  style: 'unit',
  unit: 'millisecond',
  unitDisplay: 'narrow',
})
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const formatHour: TickFormatter = (value) => hour.format(Number(value))
const formatCount: TickFormatter = (value) => compact.format(Number(value))
const formatMillis: TickFormatter = (value) => millis.format(Number(value))
const formatUsd: TickFormatter = (value) => usd.format(Number(value))

const meta = {
  title: 'Charts',
  component: AreaChart,
  args: {
    'aria-label': 'Requests per hour over the last day',
    data: traffic,
    xKey: 'at',
    yKey: 'requests',
    formatX: formatHour,
    formatY: formatCount,
  },
  argTypes: {
    variant: { control: 'select', options: ['smooth', 'step'] },
    height: { control: 'number' },
  },
} satisfies Meta<typeof AreaChart>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { variant: 'smooth' } }

export const Stepped: Story = { args: { variant: 'step' } }

export const Lines: Story = {
  render: () => (
    <div className="max-w-2xl">
      <LineChart
        aria-label="Request latency percentiles over the last day"
        data={latency}
        xKey="at"
        series={latencySeries}
        formatX={formatHour}
        formatY={formatMillis}
      />
    </div>
  ),
}

export const Bars: Story = {
  render: () => (
    <div className="max-w-2xl">
      <BarChart
        aria-label="Daily spend by service"
        data={spend}
        xKey="day"
        series={spendSeries}
        formatY={formatUsd}
      />
    </div>
  ),
}

export const StackedBars: Story = {
  render: () => (
    <div className="max-w-2xl">
      <BarChart
        aria-label="Daily spend by service, stacked"
        data={spend}
        xKey="day"
        series={spendSeries}
        stacked
        formatY={formatUsd}
      />
    </div>
  ),
}

export const Sparklines: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-1">
      {instances.map((instance) => (
        <div key={instance.name} className="flex items-center gap-4 py-1">
          <span className="text-sans-12 text-secondary w-32">{instance.name}</span>
          <Sparkline
            aria-label={`Error rate trend for ${instance.name}`}
            className="w-24"
            data={instance.trend.map((value, i) => ({ i, value }))}
            yKey="value"
          />
          <span className="text-mono-xs text-tertiary ml-auto tabular-nums">
            {instance.trend.at(-1)}
          </span>
        </div>
      ))}
    </div>
  ),
}

/** `color` on a series overrides the palette order. Reading it back off the
 *  theme keeps a bespoke assignment inside the token set. */
function RecolouredLatency() {
  const theme = useChartTheme()
  return (
    <div className="max-w-2xl">
      <LineChart
        aria-label="Request latency percentiles with a custom p50 colour"
        data={latency}
        xKey="at"
        series={[{ ...p50, color: theme.series[4] }, p95, p99]}
        formatX={formatHour}
        formatY={formatMillis}
      />
    </div>
  )
}

export const CustomSeriesColour: Story = { render: () => <RecolouredLatency /> }

const flipTheme = () => {
  const root = document.documentElement
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'
}

/** Proves the token bridge: the charts restyle in place, without remounting. */
export const ThemeSwitch: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-4">
      <button
        type="button"
        onClick={flipTheme}
        className="bg-secondary border-default text-default text-mono-sm self-start rounded-md border px-2 py-1"
      >
        Toggle theme
      </button>
      <AreaChart
        aria-label="Requests per hour over the last day"
        data={traffic}
        xKey="at"
        yKey="requests"
        formatX={formatHour}
        formatY={formatCount}
      />
    </div>
  ),
}
