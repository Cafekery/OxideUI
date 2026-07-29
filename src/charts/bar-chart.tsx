import type { ComponentPropsWithRef } from 'react'
import { Bar, BarChart as RechartsBarChart } from 'recharts'
import {
  CHART_MARGIN,
  type ChartDatum,
  ChartFrame,
  type ChartSeries,
  grid,
  seriesColor,
  type TickFormatter,
  tooltip,
  xAxis,
  yAxis,
} from './chart-parts'
import { useChartTheme } from './use-chart-theme'

export type BarChartProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  'aria-label': string
  data: readonly ChartDatum[]
  xKey: string
  series: readonly ChartSeries[]
  height?: number
  stacked?: boolean
  formatX?: TickFormatter
  formatY?: TickFormatter
}

const TOP_RADIUS: [number, number, number, number] = [2, 2, 0, 0]

export function BarChart({
  data,
  xKey,
  series,
  height = 220,
  stacked = false,
  formatX,
  formatY,
  ...rest
}: BarChartProps) {
  const theme = useChartTheme()
  const last = series.length - 1

  return (
    <ChartFrame height={height} {...rest}>
      <RechartsBarChart data={data} margin={CHART_MARGIN} accessibilityLayer={false}>
        {grid(theme)}
        {xAxis(theme, xKey, formatX)}
        {yAxis(theme, formatY)}
        {tooltip(theme, { formatLabel: formatX, formatValue: formatY, cursor: 'band' })}
        {series.map((entry, index) => (
          <Bar
            key={entry.key}
            dataKey={entry.key}
            name={entry.label}
            fill={entry.color ?? seriesColor(theme, index)}
            stackId={stacked ? 'stack' : undefined}
            radius={stacked && index !== last ? undefined : TOP_RADIUS}
            maxBarSize={32}
          />
        ))}
      </RechartsBarChart>
    </ChartFrame>
  )
}
