import { Line, LineChart as RechartsLineChart } from 'recharts'
import {
  type CartesianChartProps,
  CHART_MARGIN,
  ChartFrame,
  type ChartSeries,
  grid,
  seriesColor,
  tooltip,
  xAxis,
  yAxis,
} from './chart-parts'
import { useChartTheme } from './use-chart-theme'

export type LineChartProps = CartesianChartProps & {
  series: readonly ChartSeries[]
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
