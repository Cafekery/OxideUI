import { type ComponentPropsWithRef, useState } from 'react'
import { cn } from '../lib/cn'

export type AvatarSize = 'xs' | 'sm' | 'base' | 'lg'

const BASE =
  'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full'

const SIZE: Record<AvatarSize, string> = {
  xs: 'h-5 w-5 text-mono-xs',
  sm: 'h-6 w-6 text-mono-xs',
  base: 'h-8 w-8 text-mono-sm',
  lg: 'h-10 w-10 text-mono-md',
}

const TINT = [
  'bg-green-200 text-green-800 light:bg-green-1200 light:text-green-500',
  'bg-blue-200 text-blue-800 light:bg-blue-1200 light:text-blue-500',
  'bg-purple-200 text-purple-800 light:bg-purple-1200 light:text-purple-500',
  'bg-yellow-200 text-yellow-800 light:bg-yellow-1200 light:text-yellow-500',
  'bg-red-200 text-red-800 light:bg-red-1200 light:text-red-500',
] as const

/** First and last word, so a middle name never displaces the surname. */
export function avatarInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/** Hashed rather than cycled by index so a person keeps their colour wherever
 *  they appear, with no shared counter between call sites. */
export function avatarTint(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i += 1)
    hash = (hash * 31 + name.charCodeAt(i)) % 100003
  return TINT[hash % TINT.length] ?? TINT[0]
}

export type AvatarProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  name: string
  src?: string
  size?: AvatarSize
}

export function Avatar({ name, src, size = 'base', className, ...rest }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>()

  if (src !== undefined && src !== failedSrc)
    return (
      <span className={cn(BASE, SIZE[size], className)} {...rest}>
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      </span>
    )

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(BASE, SIZE[size], avatarTint(name), className)}
      {...rest}
    >
      {avatarInitials(name)}
    </span>
  )
}
