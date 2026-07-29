import { Line, LineChart } from 'recharts'
import { type ChartBaseProps, ChartFrame, seriesColor } from './chart-parts'
import { useChartTheme } from './use-chart-theme'

export type SparklineProps = ChartBaseProps & {
  yKey: string
  color?: string
}

/** Stroke width is inset by the margin so the curve is not clipped at the edges. */
const MARGIN = { top: 2, right: 2, bottom: 2, left: 2 }

export function Sparkline({ data, yKey, height = 24, color, ...rest }: SparklineProps) {
  const theme = useChartTheme()

  return (
    <ChartFrame height={height} {...rest}>
      <LineChart data={data} margin={MARGIN} accessibilityLayer={false}>
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color ?? seriesColor(theme, 0)}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartFrame>
  )
}
