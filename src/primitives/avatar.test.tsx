import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar, avatarInitials, avatarTint } from './avatar'

describe('avatarInitials', () => {
  it('takes the first and last word', () => {
    expect(avatarInitials('Ada Lovelace')).toBe('AL')
  })

  it('skips middle names rather than truncating at the second word', () => {
    expect(avatarInitials('Jane Mary Watson')).toBe('JW')
  })

  it('yields a single initial for a single word', () => {
    expect(avatarInitials('Cher')).toBe('C')
  })

  it('collapses stray whitespace', () => {
    expect(avatarInitials('   ada    lovelace   ')).toBe('AL')
  })

  it('yields nothing for a blank name', () => {
    expect(avatarInitials('   ')).toBe('')
  })
})

describe('avatarTint', () => {
  it('is stable for a given name', () => {
    expect(avatarTint('Ada Lovelace')).toBe(avatarTint('Ada Lovelace'))
  })

  it('spreads names across more than one hue', () => {
    const names = [
      'Ada Lovelace',
      'Grace Hopper',
      'Alan Turing',
      'Katherine Johnson',
      'Cher',
    ]

    expect(new Set(names.map(avatarTint)).size).toBeGreaterThan(1)
  })

  it('carries a fill and a light-theme override', () => {
    const tint = avatarTint('Ada Lovelace')

    expect(tint).toMatch(/\bbg-\w+-200\b/)
    expect(tint).toMatch(/\blight:bg-\w+-1200\b/)
  })
})

describe('Avatar', () => {
  it('renders initials under the name when there is no image', () => {
    render(<Avatar name="Ada Lovelace" />)

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL')
  })

  it('paints the same person the same colour on every render', () => {
    const { container: first } = render(<Avatar name="Grace Hopper" />)
    const { container: second } = render(<Avatar name="Grace Hopper" />)

    expect(first.firstElementChild?.className).toBe(second.firstElementChild?.className)
  })

  it('renders the image when a source is given', () => {
    render(<Avatar name="Ada Lovelace" src="/ada.png" />)

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute(
      'src',
      '/ada.png',
    )
  })

  it('falls back to initials when the image fails', () => {
    render(<Avatar name="Ada Lovelace" src="/missing.png" />)

    fireEvent.error(screen.getByRole('img', { name: 'Ada Lovelace' }))

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL')
  })
})
