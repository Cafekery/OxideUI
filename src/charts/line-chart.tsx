import type { ComponentPropsWithRef } from 'react'
import { Line, LineChart as RechartsLineChart } from 'recharts'
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

export type LineChartProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  'aria-label': string
  data: readonly ChartDatum[]
  xKey: string
  series: readonly ChartSeries[]
  height?: number
  formatX?: TickFormatter
  formatY?: TickFormatter
}

export function LineChart({
  data,
  xKey,
  series,
  height = 220,
  formatX,
  formatY,
  ...rest
}: LineChartProps) {
  const theme = useChartTheme()

  return (
    <ChartFrame height={height} {...rest}>
      <RechartsLineChart data={data} margin={CHART_MARGIN} accessibilityLayer={false}>
        {grid(theme)}
        {xAxis(theme, xKey, formatX)}
        {yAxis(theme, formatY)}
        {tooltip(theme, { formatLabel: formatX, formatValue: formatY })}
        {series.map((entry, index) => {
          const color = entry.color ?? seriesColor(theme, index)
          return (
            <Line
              key={entry.key}
              type="monotone"
              dataKey={entry.key}
              name={entry.label}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: color, stroke: color }}
            />
          )
        })}
      </RechartsLineChart>
    </ChartFrame>
  )
}
