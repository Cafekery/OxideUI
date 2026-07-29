export const sanitize = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const toId = (title: string, exportName: string): string =>
  `${sanitize(title)}--${sanitize(exportName)}`

export const startCase = (s: string): string =>
  s
    .replace(/[_\-.]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const titleFromPath = (importPath: string): string =>
  importPath
    .replace(/^(?:\.{1,2}\/|\/)+/, '')
    .replace(/^src\//, '')
    .replace(/\.stories(?=\.[jt]sx?$)/, '')
    .replace(/\.[jt]sx?$/, '')
    .split('/')
    .filter(Boolean)
    .map(startCase)
    .join('/')
