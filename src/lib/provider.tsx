import { type ComponentType, createContext, type ReactNode, use } from 'react'

export type LinkProps = {
  to: string
  className?: string
  children?: ReactNode
  'aria-current'?: 'page' | undefined
}

export type LinkComponent = ComponentType<LinkProps>

const AnchorLink: LinkComponent = ({ to, ...rest }) => <a href={to} {...rest} />

const LinkContext = createContext<LinkComponent>(AnchorLink)

export function OxideProvider({
  link = AnchorLink,
  children,
}: {
  link?: LinkComponent
  children: ReactNode
}) {
  return <LinkContext value={link}>{children}</LinkContext>
}

export const useLink = () => use(LinkContext)
