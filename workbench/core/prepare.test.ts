import { describe, expect, it } from 'vitest'
import { deepMerge, prepareModule, type StoryModule } from './prepare'
import type { AnyComponent, Decorator, PreparedStory } from './types'

const PATH = 'src/primitives/button.stories.tsx'

const Dummy: AnyComponent = () => null
const Other: AnyComponent = () => null

const decoratorA: Decorator = () => null as never
const decoratorB: Decorator = () => null as never

const prepare = (mod: StoryModule, path = PATH) => prepareModule(path, mod)
const only = (mod: StoryModule, path = PATH): PreparedStory => {
  const [story] = prepare(mod, path)
  if (!story) throw new Error('expected exactly one prepared story')
  return story
}

const asElement = (story: PreparedStory, args: Record<string, unknown> = {}) =>
  story.render(args) as unknown as { type: unknown; props: Record<string, unknown> }

describe('deepMerge', () => {
  it('merges nested plain objects instead of replacing them', () => {
    expect(deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 9 } })).toEqual({
      a: { x: 1, y: 9 },
    })
  })

  it('replaces arrays wholesale', () => {
    expect(deepMerge({ options: ['a', 'b', 'c'] }, { options: ['z'] })).toEqual({
      options: ['z'],
    })
  })

  it('never lets undefined overwrite a defined value', () => {
    expect(deepMerge({ a: 1 }, { a: undefined })).toEqual({ a: 1 })
  })

  it('does not mutate either input', () => {
    const base = { a: { x: 1 } }
    const over = { a: { y: 2 } }
    deepMerge(base, over)
    expect(base).toEqual({ a: { x: 1 } })
    expect(over).toEqual({ a: { y: 2 } })
  })
})

describe('prepareModule', () => {
  it('derives title, id and display name, skipping default and __esModule', () => {
    const stories = prepare({
      __esModule: true,
      default: { component: Dummy },
      primaryLarge: {},
      WithIcon: {},
    })

    expect(stories.map((s) => s.id)).toEqual([
      'primitives-button--primary-large',
      'primitives-button--with-icon',
    ])
    expect(stories.map((s) => s.name)).toEqual(['Primary Large', 'With Icon'])
    expect(stories.every((s) => s.title === 'Primitives/Button')).toBe(true)
  })

  it('prefers an explicit meta.title over the path-derived one', () => {
    expect(
      only({ default: { component: Dummy, title: 'Foundations/Colour' }, Basic: {} }).id,
    ).toBe('foundations-colour--basic')
  })

  it('lets story.name override the derived display name', () => {
    expect(
      only({ default: { component: Dummy }, primaryLarge: { name: 'The Big One' } }).name,
    ).toBe('The Big One')
  })

  it('splits the export name before sanitizing it into the id', () => {
    expect(only({ default: { component: Dummy }, PrimaryLarge: {} }).id).toBe(
      'primitives-button--primary-large',
    )
  })

  it('pins the id to the export name so a display rename cannot break deep links', () => {
    const renamed = only({
      default: { component: Dummy },
      primaryLarge: { name: 'The Big One' },
    })
    const plain = only({ default: { component: Dummy }, primaryLarge: {} })

    expect(renamed.id).toBe('primitives-button--primary-large')
    expect(renamed.id).toBe(plain.id)
  })

  it('skips exports that are not plain objects', () => {
    const stories = prepare({
      default: { component: Dummy },
      Real: {},
      NotAStory: () => null,
      alsoNot: 'string',
      norThis: [1, 2],
    })

    expect(stories.map((s) => s.id)).toEqual(['primitives-button--real'])
  })

  it('shallow-overrides args, so a story arg replaces the whole meta value', () => {
    const story = only({
      default: { component: Dummy, args: { size: 'sm', nested: { a: 1, b: 2 } } },
      Basic: { args: { nested: { b: 3 } } },
    })

    expect(story.initialArgs).toEqual({ size: 'sm', nested: { b: 3 } })
  })

  it('deep-merges argTypes per leaf key, story winning', () => {
    const story = only({
      default: {
        component: Dummy,
        argTypes: {
          size: { control: 'select', options: ['sm', 'lg'], description: 'from meta' },
          label: { control: 'text' },
        },
      },
      Basic: { argTypes: { size: { description: 'from story' } } },
    })

    expect(story.argTypes).toEqual({
      size: { control: 'select', options: ['sm', 'lg'], description: 'from story' },
      label: { control: 'text' },
    })
  })

  it('deep-merges parameters with the story winning', () => {
    const story = only({
      default: { component: Dummy, parameters: { layout: 'centered' } },
      Basic: { parameters: { layout: 'fullscreen' } },
    })

    expect(story.parameters).toEqual({ layout: 'fullscreen' })
  })

  it('concatenates decorators story-first so meta ends up outermost', () => {
    const story = only({
      default: { component: Dummy, decorators: [decoratorA] },
      Basic: { decorators: [decoratorB] },
    })

    expect(story.decorators).toEqual([decoratorB, decoratorA])
  })

  it('keeps meta decorators when a story declares none', () => {
    expect(
      only({ default: { component: Dummy, decorators: [decoratorA] }, Basic: {} })
        .decorators,
    ).toEqual([decoratorA])
  })

  it('defaults render to an element of meta.component spread with the args', () => {
    const story = only({ default: { component: Dummy }, Basic: { args: { size: 'sm' } } })
    const element = asElement(story, { size: 'lg' })

    expect(element.type).toBe(Dummy)
    expect(element.props.size).toBe('lg')
  })

  it('uses an explicit story render over the component default', () => {
    const explicit = (() => 'custom') as unknown as PreparedStory['render']
    const story = only({ default: { component: Dummy }, Basic: { render: explicit } })

    expect(story.render).toBe(explicit)
  })

  it('prepares a story with neither render nor component, throwing only when rendered', () => {
    const stories = prepare({ default: {}, Broken: {} })

    expect(stories).toHaveLength(1)
    expect(() => stories[0]?.render({})).toThrow(/primitives-button--broken/)
  })

  it('prepares stories when the module has no default export at all', () => {
    const story = only({
      Basic: { render: (() => null) as unknown as PreparedStory['render'] },
    })

    expect(story.id).toBe('primitives-button--basic')
  })

  it('applies the same meta component to every story in the module', () => {
    const stories = prepare({ default: { component: Other }, A: {}, B: {} })

    expect(stories.map((s) => asElement(s).type)).toEqual([Other, Other])
  })
})
