import type { ComponentPropsWithRef, ReactElement } from 'react'
import type { TooltipContentProps, TooltipValueType } from 'recharts'
import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn } from '../lib/cn'
import type { ChartTheme } from './use-chart-theme'

export type ChartDatum = Record<string, string | number | null>

export type TickFormatter = (value: string | number) => string

export type ChartSeries = {
  key: string
  label: string
  color?: string
}

export const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: 0 }

const AXIS_FONT_SIZE = 11

export const seriesColor = (theme: ChartTheme, index: number) =>
  theme.series[index % theme.series.length] ?? theme.axis

export type ChartFrameProps = ComponentPropsWithRef<'div'> & {
  height: number
  children: ReactElement
}

/** The container carries the accessible name; everything recharts draws is
 *  hidden, and `accessibilityLayer` is off so the SVG is neither focusable nor
 *  announced as an application. */
export function ChartFrame({
  height,
  className,
  style,
  children,
  ...rest
}: ChartFrameProps) {
  return (
    <div
      role="img"
      className={cn('text-default', className)}
      style={{ height, ...style }}
      {...rest}
    >
      <ResponsiveContainer aria-hidden width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export const grid = (theme: ChartTheme) => (
  <CartesianGrid stroke={theme.grid} strokeDasharray="2 2" vertical={false} />
)

export const xAxis = (theme: ChartTheme, dataKey: string, format?: TickFormatter) => (
  <XAxis
    dataKey={dataKey}
    axisLine={false}
    tickLine={false}
    tickMargin={8}
    minTickGap={16}
    tick={{ fill: theme.axis, fontSize: AXIS_FONT_SIZE }}
    tickFormatter={format}
  />
)

export const yAxis = (theme: ChartTheme, format?: TickFormatter) => (
  <YAxis
    axisLine={false}
    tickLine={false}
    tickMargin={8}
    width={48}
    tick={{ fill: theme.axis, fontSize: AXIS_FONT_SIZE }}
    tickFormatter={format}
  />
)

export const tooltip = (
  theme: ChartTheme,
  options: {
    formatLabel?: TickFormatter
    formatValue?: TickFormatter
    cursor?: 'line' | 'band'
  } = {},
) => (
  <Tooltip
    cursor={
      options.cursor === 'band'
        ? { fill: theme.cursor, fillOpacity: 0.5 }
        : { stroke: theme.cursor, strokeWidth: 1 }
    }
    content={
      <ChartTooltip formatLabel={options.formatLabel} formatValue={options.formatValue} />
    }
  />
)

type ChartTooltipProps = Partial<TooltipContentProps> & {
  formatLabel?: TickFormatter
  formatValue?: TickFormatter
}

const formatted = (value: TooltipValueType | undefined, format?: TickFormatter) => {
  if (typeof value !== 'string' && typeof value !== 'number') return ''
  return format ? format(value) : String(value)
}

function ChartTooltip({
  active,
  payload,
  label,
  formatLabel,
  formatValue,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-raise border border-default rounded-lg shadow-menu text-sans-12 px-2.5 py-2">
      {label !== undefined && (
        <div className="text-tertiary text-mono-xs pb-1.5">
          {formatted(label, formatLabel)}
        </div>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((entry) => (
          <div key={entry.graphicalItemId} className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color ?? entry.stroke ?? entry.fill }}
            />
            <span className="text-secondary">{entry.name}</span>
            <span className="text-default ml-auto pl-3 tabular-nums">
              {formatted(entry.value, formatValue)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
