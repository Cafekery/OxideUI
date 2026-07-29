export type ClassValue = string | number | false | null | undefined

export const cn = (...parts: ClassValue[]): string => parts.filter(Boolean).join(' ')
