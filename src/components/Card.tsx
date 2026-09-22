import { ReactNode } from "react"
import { cn } from "@/lib/format"

type CardProps = {
  children: ReactNode
  className?: string
  surface?: "card" | "inset"
  as?: "div" | "section" | "article"
  interactive?: boolean
  onClick?: () => void
}

const surfaceClasses = {
  card: "bg-surface-card",
  inset: "bg-surface-inset"
}

const Card = ({ children, className, surface = "card", as: Tag = "div", interactive = false, onClick }: CardProps) => {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-card p-4",
        surfaceClasses[surface],
        interactive && "cursor-pointer transition-colors hover:bg-surface-inset",
        className
      )}
    >
      {children}
    </Tag>
  )
}

export default Card
