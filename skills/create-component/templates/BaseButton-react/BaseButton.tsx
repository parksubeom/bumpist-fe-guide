import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/shared/lib'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
        secondary:
          'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700',
        ghost:
          'border border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  /** Extra classes merged via `cn` (tailwind-merge resolves conflicts). */
  className?: string
}

export function BaseButton({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}: Props) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...rest}>
      {children}
    </button>
  )
}
