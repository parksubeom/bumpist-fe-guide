import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { BaseButton } from './BaseButton'

describe('BaseButton', () => {
  it('renders its children', () => {
    render(<BaseButton>Save</BaseButton>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('applies variant-specific classes', () => {
    const { rerender } = render(<BaseButton variant="primary">x</BaseButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-emerald-600')
    rerender(<BaseButton variant="ghost">x</BaseButton>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('applies size classes', () => {
    render(<BaseButton size="lg">x</BaseButton>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
  })

  it('merges an external className and resolves conflicts via tailwind-merge', () => {
    // default size `md` is `px-4`; passing `px-2` should win and drop `px-4`.
    render(<BaseButton className="px-2">x</BaseButton>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('px-2')
    expect(btn).not.toHaveClass('px-4')
  })

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn()
    render(<BaseButton onClick={onClick}>x</BaseButton>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <BaseButton disabled onClick={onClick}>
        x
      </BaseButton>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
