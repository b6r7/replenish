import { ReactNode } from "react"
import { cn } from "@/lib/format"

type Tone = "info" | "success" | "warning" | "error" | "neutral"

type Props = {
  tone?: Tone
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

const toneClasses: Record<Tone, { wrap: string; icon: string; title: string }> = {
  info: { wrap: "bg-surface-inset text-ink", icon: "text-signal-info", title: "text-ink" },
  success: { wrap: "bg-[#E6F1EA] text-ink", icon: "text-signal-success", title: "text-ink" },
  warning: { wrap: "bg-[#FBF1DC] text-ink", icon: "text-signal-warning", title: "text-ink" },
  error: { wrap: "bg-[#F7E3E8] text-ink", icon: "text-signal-error", title: "text-ink" },
  neutral: { wrap: "bg-surface-inset text-ink", icon: "text-ink-secondary", title: "text-ink" }
}

const Banner = ({ tone = "info", icon, title, description, action, className }: Props) => {
  const tc = toneClasses[tone]
  return (
    <div className={cn("rounded-input p-4 flex gap-3 items-start", tc.wrap, className)}>
      {icon && <div className={cn("shrink-0 mt-0.5", tc.icon)}>{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className={cn("text-b-md font-medium", tc.title)}>{title}</p>
        {description && <p className="text-b-sm text-ink-secondary mt-1">{description}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}

export default Banner
