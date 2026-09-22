"use client"

// ---------------------------------------------------------------------------
// Plan row — mirrors the Figma "Wave2PlanCardsSingle" component with four
// variants (Overdue, Default, AutoPay On, Processing). Preserves the exact
// Figma spec for spacing, radii, borders, and text colors.
// ---------------------------------------------------------------------------

import { cn, formatCurrency, formatShortDate } from "@/lib/format"
import { PlanRow as PlanRowData, PlanStatus } from "@/lib/mock-data"
import DsIcon from "./DsIcon"
import MerchantLogo from "./MerchantLogo"

type Props = {
  row: PlanRowData
  onPay?: (row: PlanRowData) => void
}

const PlanRow = ({ row, onPay }: Props) => {
  const isProcessing = row.status === "processing"
  const handlePay = () => {
    if (isProcessing) return
    onPay?.(row)
  }

  return (
    <article className="w-full bg-surface-card border border-border rounded-[12px] px-4 py-4 flex items-center min-h-[48px]">
      {/* Content-left: logo + title/subtitle. Uses Figma gap tokens. */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <MerchantLogo variant={row.logo} merchant={row.merchant} />
        <div className="flex-1 min-w-0">
          <p className="text-b-lg font-semibold text-ink leading-[26px] truncate">
            {row.merchant}
          </p>
          <Subtitle row={row} />
        </div>
      </div>

      {/* Content-right: single-action trailing pill, always centered vertically. */}
      <div className="pl-4 flex items-center shrink-0">

        {/* Trailing button — pill, "Processing" state renders disabled amount */}
        <button
          type="button"
          onClick={handlePay}
          disabled={isProcessing}
          aria-label={
            isProcessing
              ? `Payment processing, ${formatCurrency(row.amount)}`
              : `Pay ${formatCurrency(row.amount)}`
          }
          className={cn(
            "rounded-[18px] px-4 py-2 text-b-md font-medium leading-[20px] whitespace-nowrap transition-colors",
            isProcessing
              ? "bg-[#dddee2] text-[#9b9eaa] cursor-default"
              : "bg-brand text-brand-on hover:bg-brand-hover active:bg-brand-pressed"
          )}
        >
          {isProcessing ? formatCurrency(row.amount) : `Pay ${formatCurrency(row.amount)}`}
        </button>
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------

const Subtitle = ({ row }: { row: PlanRowData }) => {
  if (row.status === "overdue" && row.overdueDays) {
    return (
      <div className="mt-0.5 flex items-center gap-1 min-w-0">
        <DsIcon name="warning" size={16} className="text-signal-error" />
        <p className="text-b-sm font-semibold text-signal-error leading-[21px] whitespace-nowrap">
          {row.overdueDays} days overdue
        </p>
      </div>
    )
  }

  if (row.status === "processing" && row.dueDateISO) {
    return (
      <div className="mt-0.5 flex items-center gap-1 min-w-0">
        <p className="text-b-sm font-semibold text-ink leading-[21px] whitespace-nowrap">
          {formatShortDate(row.dueDateISO)}
        </p>
        <p className="text-b-sm text-ink leading-[21px]">·</p>
        <p className="text-b-sm text-ink-secondary leading-[21px] whitespace-nowrap">
          Payment processing
        </p>
      </div>
    )
  }

  if (row.status === "autopay" && row.dueDateISO) {
    return (
      <div className="mt-0.5 flex items-center gap-1 min-w-0">
        <p className="text-b-sm font-semibold text-signal-success leading-[21px] whitespace-nowrap">
          AutoPay
        </p>
        <p className="text-b-sm font-semibold text-ink leading-[21px] whitespace-nowrap">
          on {formatShortDate(row.dueDateISO)}
        </p>
        {row.installmentIndex && row.installmentsTotal && (
          <>
            <p className="text-b-sm text-ink leading-[21px]">·</p>
            <p className="text-b-sm text-ink leading-[21px] whitespace-nowrap">
              {row.installmentIndex} of {row.installmentsTotal}
            </p>
          </>
        )}
      </div>
    )
  }

  if (row.status === "default" && row.dueDateISO) {
    return (
      <div className="mt-0.5 flex items-center gap-1 min-w-0">
        <p className="text-b-sm text-ink leading-[21px] whitespace-nowrap">
          <span className="font-semibold">Due</span> on {formatShortDate(row.dueDateISO)}
        </p>
        {row.installmentIndex && row.installmentsTotal && (
          <>
            <p className="text-b-sm text-ink leading-[21px]">·</p>
            <p className="text-b-sm text-ink leading-[21px] whitespace-nowrap">
              {row.installmentIndex} of {row.installmentsTotal}
            </p>
          </>
        )}
      </div>
    )
  }

  return null
}

export default PlanRow

// Re-export types for convenience
export type { PlanStatus }
