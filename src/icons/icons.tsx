import type { ComponentPropsWithRef } from 'react'

export type IconProps = ComponentPropsWithRef<'svg'>

const Icon = (props: IconProps) => (
  <svg
    viewBox="0 0 18 18"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    focusable={false}
    {...props}
  />
)

export const ChevronDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 7 L9 11 L13 7" />
  </Icon>
)

export const ChevronUp = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 11 L9 7 L13 11" />
  </Icon>
)

export const ChevronLeft = (props: IconProps) => (
  <Icon {...props}>
    <path d="M11 5 L7 9 L11 13" />
  </Icon>
)

export const ChevronRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 5 L11 9 L7 13" />
  </Icon>
)

export const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 9.5 L7 12.5 L14 5.5" />
  </Icon>
)

export const Close = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 5 L13 13" />
    <path d="M13 5 L5 13" />
  </Icon>
)

export const Search = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="8" cy="8" r="4.5" />
    <path d="M11.5 11.5 L14.5 14.5" />
  </Icon>
)

export const Minus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4.5 9 H13.5" />
  </Icon>
)

export const Plus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 4.5 V13.5" />
    <path d="M4.5 9 H13.5" />
  </Icon>
)

export const DotsHorizontal = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="4.5" cy="9" r="0.5" />
    <circle cx="9" cy="9" r="0.5" />
    <circle cx="13.5" cy="9" r="0.5" />
  </Icon>
)

export const ExternalLink = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7.5 4.5 H4.5 V13.5 H13.5 V10.5" />
    <path d="M10.5 4.5 H13.5 V7.5" />
    <path d="M8.5 9.5 L13.5 4.5" />
  </Icon>
)

export const Copy = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6.5 6.5 V5 A1.5 1.5 0 0 1 8 3.5 H13 A1.5 1.5 0 0 1 14.5 5 V10 A1.5 1.5 0 0 1 13 11.5 H11.5" />
    <path d="M5 6.5 H10 A1.5 1.5 0 0 1 11.5 8 V13 A1.5 1.5 0 0 1 10 14.5 H5 A1.5 1.5 0 0 1 3.5 13 V8 A1.5 1.5 0 0 1 5 6.5 Z" />
  </Icon>
)

export const AlertTriangle = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 3.5 L15.5 14.5 H2.5 Z" />
    <path d="M9 7 V10" />
    <circle cx="9" cy="12.25" r="0.5" />
  </Icon>
)

export const InfoCircle = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="9" cy="9" r="6.5" />
    <path d="M9 8.5 V12.5" />
    <circle cx="9" cy="6" r="0.5" />
  </Icon>
)

export const CircleCheck = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="9" cy="9" r="6.5" />
    <path d="M6 9.5 L8 11.5 L12 6.5" />
  </Icon>
)

export const Calendar = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4.5 4.5 H13.5 A1.5 1.5 0 0 1 15 6 V13.5 A1.5 1.5 0 0 1 13.5 15 H4.5 A1.5 1.5 0 0 1 3 13.5 V6 A1.5 1.5 0 0 1 4.5 4.5 Z" />
    <path d="M3 8 H15" />
    <path d="M6.5 3 V6" />
    <path d="M11.5 3 V6" />
  </Icon>
)

export const Filter = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2.5 4 H15.5 L10.5 10 V14.5 L7.5 12.5 V10 Z" />
  </Icon>
)
