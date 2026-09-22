import { ReactNode } from "react"
import AffirmMark from "./AffirmMark"
import { cn } from "@/lib/format"

// ---------------------------------------------------------------------------
// A believable email chrome (subject bar + from row) that wraps every
// receipt email preview.
// ---------------------------------------------------------------------------

type Props = {
  subject: string
  from: string
  fromEmail: string
  to: string
  time: string
  scenarioNote?: string
  children: ReactNode
  className?: string
}

const EmailFrame = ({ subject, from, fromEmail, to, time, scenarioNote, children, className }: Props) => (
  <div className={cn("bg-surface-card rounded-card overflow-hidden border border-border-subtle", className)}>
    {/* Client chrome */}
    <div className="p-6 pb-4 border-b border-border-subtle">
      {scenarioNote && (
        <p className="marker-chip mb-3 text-ink-tertiary">{scenarioNote}</p>
      )}
      <h1 className="font-display text-h-md text-ink">{subject}</h1>
      <div className="mt-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand text-brand-on flex items-center justify-center font-display text-b-sm font-semibold">
          a
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-b-md text-ink">
            <span className="font-medium">{from}</span>{" "}
            <span className="text-ink-tertiary">&lt;{fromEmail}&gt;</span>
          </p>
          <p className="text-b-sm text-ink-secondary">
            To {to} · {time}
          </p>
        </div>
      </div>
    </div>

    {/* Email body */}
    <div className="bg-surface-page p-6">
      <div className="bg-surface-card rounded-card p-8 max-w-[520px] mx-auto">
        <AffirmMark className="mb-6 block" />
        {children}
      </div>
      <p className="mt-6 text-center text-b-xs text-ink-tertiary">
        Affirm, Inc. · 650 California Street, San Francisco, CA 94108
      </p>
    </div>
  </div>
)

export default EmailFrame
