import type { ComponentPropsWithRef } from 'react'
import { cn } from '../lib/cn'

export type CardProps = ComponentPropsWithRef<'div'>

export function Card({ className, ...rest }: CardProps) {
  return (
    <div
      className={cn('rounded-lg border border-default bg-raise', className)}
      {...rest}
    />
  )
}

export type CardHeaderProps = ComponentPropsWithRef<'div'>

export function CardHeader({ className, ...rest }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-b border-secondary px-4 py-3',
        className,
      )}
      {...rest}
    />
  )
}

export type CardTitleProps = ComponentPropsWithRef<'h3'>

export function CardTitle({ className, ...rest }: CardTitleProps) {
  return <h3 className={cn('m-0 text-sans-semi-md text-raise', className)} {...rest} />
}

export type CardBodyProps = ComponentPropsWithRef<'div'>

export function CardBody({ className, ...rest }: CardBodyProps) {
  return (
    <div className={cn('px-4 py-3 text-sans-md text-secondary', className)} {...rest} />
  )
}

export type CardFooterProps = ComponentPropsWithRef<'div'>

export function CardFooter({ className, ...rest }: CardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-secondary px-4 py-3',
        className,
      )}
      {...rest}
    />
  )
}
