"use client"

// ---------------------------------------------------------------------------
// Plans tab — Wave 2. Rebuilt to match the Figma design 1:1.
//
// Figma reference: Plans-Wave-2 · node 2154:34963.
//
// Structure:
//   - Dark navy hero panel (edge-to-edge) with:
//       · top bar: "Plans" + settings + chat
//       · centered total balance
//       · "You have $X due in {Month}." status line
//   - White body panel with 24px rounded top corners containing:
//       · Payments / All plans tabs
//       · Take action section (overdue rows)
//       · Upcoming payments section grouped by month
//   - Persistent bottom tab bar (via AppShell)
// ---------------------------------------------------------------------------

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import AppShell from "@/components/AppShell"
import PlanRow from "@/components/PlanRow"
import { IconMessage, IconSettings } from "@/components/icons/Icon"
import { plansOverview, PlanRow as PlanRowData } from "@/lib/mock-data"
import { cn, formatCurrency, hardNav } from "@/lib/format"
import { usePrototype } from "@/lib/store"

type Tab = "payments" | "all"

const Page = () => {
  const [tab, setTab] = useState<Tab>("payments")
  const router = useRouter()
  const { setSelectedPlan, setAmount, setScenario } = usePrototype()

  // Tapping "Pay $X" from any plan row launches the Figma-aligned
  // Make a payment flow (amount / date / method / promo), pre-filled for
  // this plan. Amount defaults to the upcoming installment.
  const handlePay = useCallback(
    (plan: PlanRowData) => {
      setSelectedPlan({
        id: plan.id,
        merchant: plan.merchant,
        logo: plan.logo,
        installmentIndex: plan.installmentIndex,
        installmentsTotal: plan.installmentsTotal,
        installmentAmount: plan.amount,
        remainingBalance: plan.remainingBalance,
        dueDateISO: plan.dueDateISO
      })
      setAmount(plan.amount)
      setScenario("success")
      hardNav("/app/payments/pay", router)
    },
    [router, setAmount, setScenario, setSelectedPlan]
  )

  return (
    <AppShell fullBleed>
      <HeroPanel />

      {/* Body panel: rounded top, overlaps hero by 24px so the corner reveal
          matches the Figma spec exactly. */}
      <div className="relative -mt-6 rounded-t-modal bg-surface-card">
        <div className="px-4 pt-4 pb-8">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Plans views"
            className="flex items-center gap-8 border-b border-border-subtle"
          >
            {(
              [
                { id: "payments", label: "Payments" },
                { id: "all", label: "All plans" }
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "pb-3 -mb-px text-b-md transition-colors",
                  tab === t.id
                    ? "text-ink font-semibold border-b-2 border-ink"
                    : "text-ink-secondary font-medium"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "payments" ? (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <TakeActionSection onPay={handlePay} />
                <UpcomingSection onPay={handlePay} />
              </motion.div>
            ) : (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <AllPlansSection onPay={handlePay} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Hero panel — dark navy with soft radial glows approximating the Figma
// "big orb" gradient asset.
// ---------------------------------------------------------------------------

const HeroPanel = () => (
  <section className="relative overflow-hidden bg-[#07070d] text-brand-on pt-[52px] pb-10 px-5">
    {/* Ambient orbs — match the Figma gradient composition. */}
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgba(126,101,255,0.55), rgba(74,74,244,0.18) 55%, rgba(7,7,13,0) 75%)"
        }}
      />
      <div
        className="absolute -bottom-32 -left-24 w-[380px] h-[380px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(52,52,180,0.55), rgba(7,7,13,0) 70%)"
        }}
      />
      <div
        className="absolute inset-x-0 -top-8 h-[80%] opacity-40"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 30%, rgba(90,90,220,0.35), rgba(7,7,13,0) 70%)"
        }}
      />
    </div>

    {/* Top bar */}
    <div className="relative flex items-center justify-between">
      <h1 className="font-display text-h-md text-brand-on font-semibold">Plans</h1>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Settings"
          className="text-brand-on/95 hover:text-brand-on transition-colors"
        >
          <IconSettings size={22} />
        </button>
        <button
          type="button"
          aria-label="Messages"
          className="text-brand-on/95 hover:text-brand-on transition-colors"
        >
          <IconMessage size={22} />
        </button>
      </div>
    </div>

    {/* Total balance */}
    <div className="relative mt-6 flex flex-col items-center text-center">
      <p className="text-b-md text-brand-on/90">Total balance</p>
      <p
        className="mt-2 font-display font-semibold text-brand-on tracking-tight leading-none"
        style={{ fontSize: 68, letterSpacing: "-2px" }}
      >
        {formatCurrency(plansOverview.totalBalance, true)}
      </p>
      <p className="mt-5 text-b-md text-brand-on/90">
        You have{" "}
        <span className="font-semibold text-brand-on">
          {formatCurrency(plansOverview.dueThisMonth)}
        </span>{" "}
        due in{" "}
        <span className="font-semibold text-brand-on">
          {plansOverview.dueMonthLabel}
        </span>
        .
      </p>
    </div>
  </section>
)

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

type SectionProps = { onPay: (plan: PlanRowData) => void }

const TakeActionSection = ({ onPay }: SectionProps) => {
  if (plansOverview.takeAction.length === 0) return null
  return (
    <section className="mt-6">
      <h2 className="font-display text-h-sm text-ink font-bold">Take action</h2>
      <div className="mt-3 space-y-2">
        {plansOverview.takeAction.map((row) => (
          <PlanRow key={row.id} row={row} onPay={onPay} />
        ))}
      </div>
    </section>
  )
}

const UpcomingSection = ({ onPay }: SectionProps) => (
  <section className="mt-8">
    <h2 className="font-display text-h-sm text-ink font-bold">Upcoming payments</h2>

    {plansOverview.upcoming.map((month, idx) => (
      <div key={month.monthLabel} className={cn(idx === 0 ? "mt-4" : "mt-6")}>
        <div className="flex items-baseline justify-between pb-2">
          <p className="font-display text-b-lg font-semibold text-ink">{month.monthLabel}</p>
          <p className="text-b-md text-ink">
            Total:{" "}
            <span className="font-semibold">{formatCurrency(month.total)}</span>
          </p>
        </div>
        <div className="space-y-2">
          {month.rows.map((row) => (
            <PlanRow key={row.id} row={row} onPay={onPay} />
          ))}
        </div>
      </div>
    ))}
  </section>
)

const AllPlansSection = ({ onPay }: SectionProps) => {
  const allRows = [
    ...plansOverview.takeAction,
    ...plansOverview.upcoming.flatMap((m) => m.rows)
  ]
  return (
    <section className="mt-6">
      <h2 className="font-display text-h-sm text-ink font-bold">All plans</h2>
      <p className="mt-1 text-b-sm text-ink-secondary">
        {allRows.length} active plans
      </p>
      <div className="mt-4 space-y-2">
        {allRows.map((row) => (
          <PlanRow key={row.id} row={row} onPay={onPay} />
        ))}
      </div>
    </section>
  )
}

export default Page
