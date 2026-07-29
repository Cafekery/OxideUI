import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { type LinkComponent, OxideProvider } from '../lib/provider'
import { NavItem } from './nav-item'

describe('NavItem', () => {
  it('marks the active item as the current page', () => {
    render(
      <NavItem to="/projects" active>
        Projects
      </NavItem>,
    )

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('leaves aria-current off when inactive', () => {
    render(<NavItem to="/projects">Projects</NavItem>)

    expect(screen.getByRole('link', { name: 'Projects' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('routes through the link component supplied by the provider', () => {
    const RouterLink: LinkComponent = ({ to, children, ...rest }) => (
      <a data-testid="router-link" href={to} {...rest}>
        {children}
      </a>
    )

    render(
      <OxideProvider link={RouterLink}>
        <NavItem to="/projects" active>
          Projects
        </NavItem>
      </OxideProvider>,
    )

    const link = screen.getByTestId('router-link')
    expect(link).toHaveAttribute('href', '/projects')
    expect(link).toHaveAttribute('aria-current', 'page')
  })
})
