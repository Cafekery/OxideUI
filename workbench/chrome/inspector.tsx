import { EmptyState } from '../../src/feedback'
import { NumberField, Select, Switch, TextField } from '../../src/forms'
import { Close, Filter, InfoCircle } from '../../src/icons'
import { Tabs } from '../../src/navigation'
import { Badge, Button, IconButton } from '../../src/primitives'
import type { ActionEvent, Args, ArgType, IndexEntry } from '../core'

const HEX = /^#[0-9a-f]{6}$/i

const asText = (value: unknown) => (value == null ? '' : String(value))

const ago = (at: number) => {
  const seconds = Math.max(0, Math.round((Date.now() - at) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.round(seconds / 60)
  return minutes < 60 ? `${minutes}m ago` : `${Math.round(minutes / 60)}h ago`
}

function Control({
  name,
  type,
  value,
  onChange,
}: {
  name: string
  type: ArgType
  value: unknown
  onChange: (next: unknown) => void
}) {
  switch (type.control) {
    case 'boolean':
      return <Switch label={name} checked={value === true} onCheckedChange={onChange} />

    case 'number': {
      const numeric = Number(value)
      return (
        <NumberField
          label={name}
          value={Number.isFinite(numeric) ? numeric : 0}
          onValueChange={onChange}
        />
      )
    }

    case 'select': {
      const options = type.options ?? []
      return (
        <Select
          label={name}
          options={options.map((option) => ({
            value: String(option),
            label: String(option),
          }))}
          value={asText(value)}
          onValueChange={(next) =>
            onChange(options.find((option) => String(option) === next) ?? next)
          }
        />
      )
    }

    case 'color': {
      const text = asText(value)
      return (
        <TextField
          label={name}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          trailing={
            <input
              type="color"
              aria-label={`${name} swatch`}
              value={HEX.test(text) ? text : '#000000'}
              onChange={(event) => onChange(event.target.value)}
              className="h-5 w-5 rounded-md border border-default bg-default"
            />
          }
        />
      )
    }

    default:
      return (
        <TextField
          label={name}
          value={asText(value)}
          onChange={(event) => onChange(event.target.value)}
        />
      )
  }
}

function Controls({
  entry,
  args,
  onArg,
  onResetArg,
  onResetArgs,
}: {
  entry: IndexEntry | undefined
  args: Args
  onArg: (name: string, value: unknown) => void
  onResetArg: (name: string) => void
  onResetArgs: () => void
}) {
  const rows = Object.entries(entry?.argTypes ?? {}).filter(
    ([, type]) => type.control && !type.disable,
  )

  if (rows.length === 0)
    return (
      <EmptyState
        icon={<Filter />}
        title="No controls"
        description={
          entry && !entry.acceptsArgs
            ? 'This story renders a fixed example. Its render function takes no args, so there is nothing to drive.'
            : 'This story declares no controllable args.'
        }
      />
    )

  return (
    <div className="flex flex-col gap-4">
      {rows.map(([name, type]) => (
        <div key={name} className="flex items-end gap-1 [&_label]:text-mono-xs">
          <div className="min-w-0 flex-1">
            <Control
              name={name}
              type={type}
              value={args[name]}
              onChange={(next) => onArg(name, next)}
            />
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={`Reset ${name}`}
            disabled={Object.is(args[name], entry?.initialArgs[name])}
            onClick={() => onResetArg(name)}
          >
            <Close />
          </IconButton>
        </div>
      ))}
      <Button variant="secondary" size="sm" className="self-start" onClick={onResetArgs}>
        Reset all
      </Button>
    </div>
  )
}

function Actions({ actions, onClear }: { actions: ActionEvent[]; onClear: () => void }) {
  if (actions.length === 0)
    return (
      <EmptyState
        icon={<InfoCircle />}
        title="No actions yet"
        description="Callback args log here as the story fires them."
      />
    )

  return (
    <div className="flex flex-col gap-3">
      <Button variant="secondary" size="sm" className="self-start" onClick={onClear}>
        Clear
      </Button>
      <ul className="flex flex-col gap-2">
        {actions.map((action) => (
          <li
            key={action.id}
            className="flex flex-col gap-1 border-default border-b pb-2 last:border-b-0"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-mono-sm text-accent">{action.name}</span>
              <span className="shrink-0 text-mono-xs text-quaternary">
                {ago(action.at)}
              </span>
            </div>
            {action.args.length > 0 && (
              <code className="break-all text-mono-code text-secondary">
                {action.args.join(', ')}
              </code>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Inspector({
  entry,
  args,
  actions,
  onArg,
  onResetArg,
  onResetArgs,
  onClearActions,
}: {
  entry: IndexEntry | undefined
  args: Args
  actions: ActionEvent[]
  onArg: (name: string, value: unknown) => void
  onResetArg: (name: string) => void
  onResetArgs: () => void
  onClearActions: () => void
}) {
  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-default border-l bg-raise px-4 pb-6 scroll-thin">
      <Tabs
        aria-label="Inspector"
        items={[
          {
            value: 'controls',
            label: 'Controls',
            content: (
              <Controls
                entry={entry}
                args={args}
                onArg={onArg}
                onResetArg={onResetArg}
                onResetArgs={onResetArgs}
              />
            ),
          },
          {
            value: 'actions',
            label: (
              <span className="flex items-center gap-1.5">
                Actions
                {actions.length > 0 && (
                  <Badge size="sm" variant="accent">
                    {actions.length}
                  </Badge>
                )}
              </span>
            ),
            content: <Actions actions={actions} onClear={onClearActions} />,
          },
        ]}
      />
    </aside>
  )
}
