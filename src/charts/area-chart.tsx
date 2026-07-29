import { type ComponentPropsWithRef, useId } from 'react'
import { Area, AreaChart as RechartsAreaChart } from 'recharts'
import {
  CHART_MARGIN,
  type ChartDatum,
  ChartFrame,
  grid,
  seriesColor,
  type TickFormatter,
  tooltip,
  xAxis,
  yAxis,
} from './chart-parts'
import { useChartTheme } from './use-chart-theme'

export type AreaChartVariant = 'smooth' | 'step'

export type AreaChartProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  'aria-label': string
  data: readonly ChartDatum[]
  xKey: string
  yKey: string
  height?: number
  variant?: AreaChartVariant
  formatX?: TickFormatter
  formatY?: TickFormatter
}

const CURVE: Record<AreaChartVariant, 'monotone' | 'step'> = {
  smooth: 'monotone',
  step: 'step',
}

export function AreaChart({
  data,
  xKey,
  yKey,
  height = 220,
  variant = 'smooth',
  formatX,
  formatY,
  ...rest
}: AreaChartProps) {
  const theme = useChartTheme()
  const color = seriesColor(theme, 0)
  const gradientId = useId()

  return (
    <ChartFrame height={height} {...rest}>
      <RechartsAreaChart data={data} margin={CHART_MARGIN} accessibilityLayer={false}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid(theme)}
        {xAxis(theme, xKey, formatX)}
        {yAxis(theme, formatY)}
        {tooltip(theme, { formatLabel: formatX, formatValue: formatY })}
        <Area
          type={CURVE[variant]}
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          activeDot={{ r: 3, fill: color, stroke: color }}
        />
      </RechartsAreaChart>
    </ChartFrame>
  )
}
