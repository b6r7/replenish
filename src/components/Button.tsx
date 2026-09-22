"use client"

import { forwardRef, ReactNode } from "react"
import { cn } from "@/lib/format"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "small" | "medium" | "large"

type Props = {
  children: ReactNode
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  onClick?: () => void
  type?: "button" | "submit"
  className?: string
  "aria-label"?: string
}

const sizeClasses: Record<Size, string> = {
  small: "px-4 py-2 rounded-pill-sm text-b-sm font-medium",
  medium: "px-6 py-3 rounded-pill-md text-b-md font-medium",
  large: "px-7 py-[18px] rounded-pill-lg text-b-md font-medium"
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-on hover:bg-brand-hover active:bg-brand-pressed disabled:bg-brand-disabled disabled:text-ink-tertiary transition-colors",
  secondary:
    "bg-surface-card text-brand border border-border hover:border-ink hover:bg-surface-inset active:bg-surface-inset transition-colors",
  ghost:
    "bg-transparent text-brand hover:bg-surface-inset active:bg-surface-inset transition-colors",
  danger:
    "bg-signal-error text-brand-on hover:opacity-90 active:opacity-80 transition-opacity"
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    children,
    variant = "primary",
    size = "large",
    disabled = false,
    loading = false,
    fullWidth = false,
    onClick,
    type = "button",
    className,
    ...rest
  },
  ref
) {
  const handleClick = () => {
    if (disabled || loading) return
    onClick?.()
  }
  return (
    <button
      ref={ref}
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 select-none whitespace-nowrap",
        "font-body leading-none",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full",
        (disabled || loading) && "cursor-not-allowed",
        className
      )}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="w-4 h-4 rounded-full border-[2px] border-current border-t-transparent animate-spin"
        />
      )}
      <span>{children}</span>
    </button>
  )
})

export default Button
