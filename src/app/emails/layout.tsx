import Link from "next/link"
import { IconChevronLeft } from "@/components/icons/Icon"

// ---------------------------------------------------------------------------
// Emails render on a neutral canvas that looks like a Gmail-style shell so
// stakeholders can see them the way a real recipient would.
// ---------------------------------------------------------------------------

const EmailsLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen w-full canvas-grid flex flex-col">
    <div className="max-w-[1000px] w-full mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-b-sm text-ink-secondary hover:text-ink transition-colors"
      >
        <IconChevronLeft size={16} />
        Back to flow index
      </Link>
      <span className="marker-chip">Affirm · Replenish · Emails</span>
    </div>
    <div className="flex-1 flex items-start justify-center py-8 px-6">
      <div className="w-full max-w-[680px]">{children}</div>
    </div>
  </div>
)

export default EmailsLayout
