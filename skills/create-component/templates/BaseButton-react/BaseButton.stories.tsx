import { BaseButton } from './BaseButton'

// Storybook framework import: `@storybook/react-vite` for a Vite React app,
// or `@storybook/nextjs` for Next.js. Swap the specifier to match your app.
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'shared/ui/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  args: { children: 'Button' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof BaseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Large: Story = { args: { size: 'lg' } }
export const Small: Story = { args: { size: 'sm' } }
export const Disabled: Story = { args: { disabled: true } }
