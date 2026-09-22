"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import AppShell, { AppHeader } from "@/components/AppShell"
import Button from "@/components/Button"
import { IconCheck, IconChevronLeft } from "@/components/icons/Icon"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/format"

// ---------------------------------------------------------------------------
// A demo checkout screen matching the visual concept. Kept purposefully
// simple: it lets the user choose a payment plan and then land back in the
// app payments experience.
// ---------------------------------------------------------------------------

type Plan = {
  id: string
  installments: number
  amount: number
  cadence: string
}

const plans: Plan[] = [
  { id: "p_4", installments: 4, amount: 30, cadence: "Every 2 weeks" },
  { id: "p_6", installments: 6, amount: 20, cadence: "Every 2 weeks" },
  { id: "p_12", installments: 12, amount: 10, cadence: "Every 2 weeks" }
]

const Page = () => {
  const [selected, setSelected] = useState<string>(plans[0].id)

  const handleSelect = (id: string) => setSelected(id)

  return (
    <AppShell
      header={
        <AppHeader
          title="Nike"
          leading={
            <Link
              href="/app/shop"
              className="p-2 -ml-2 rounded-input text-ink-secondary hover:bg-surface-inset transition-colors"
              aria-label="Back"
            >
              <IconChevronLeft size={20} />
            </Link>
          }
        />
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
        className="rounded-card bg-surface-card p-4"
      >
        <div className="h-40 rounded-input bg-[#e8e9ee] flex items-center justify-center">
          <div className="w-32 h-14 rounded-full bg-white border border-border-subtle flex items-center justify-center">
            <div className="w-24 h-9 rounded-full bg-[#f0f0f4]" />
          </div>
        </div>
        <p className="mt-4 text-b-sm text-ink-secondary">Air Force 1 '07</p>
        <p className="font-display text-h-md text-ink mt-1">{formatCurrency(120, true)}</p>
      </motion.div>

      <section className="mt-6">
        <h2 className="font-display text-h-sm text-ink">Choose a payment plan</h2>
        <div className="mt-3 space-y-2" role="radiogroup" aria-label="Payment plans">
          {plans.map((plan) => {
            const active = plan.id === selected
            return (
              <button
                key={plan.id}
                role="radio"
                aria-checked={active}
                onClick={() => handleSelect(plan.id)}
                className={cn(
                  "w-full rounded-card p-4 flex items-center gap-3 transition-colors text-left",
                  active
                    ? "bg-surface-card border border-brand"
                    : "bg-surface-card border border-border-subtle hover:border-ink"
                )}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                    active ? "border-brand bg-brand" : "border-border"
                  )}
                >
                  {active && <IconCheck size={12} className="text-brand-on" />}
                </span>
                <div className="flex-1">
                  <p className="font-display text-h-sm text-ink">{formatCurrency(plan.amount, true)}</p>
                </div>
                <div className="text-right">
                  <p className="text-b-md font-medium text-ink">{plan.installments} payments</p>
                  <p className="text-b-sm text-ink-secondary">{plan.cadence}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-6 space-y-2">
        {[
          "No hidden fees",
          "Not impact to your credit score",
          "Simple, transparent terms"
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-b-sm text-ink-secondary">
            <span className="w-4 h-4 rounded-full bg-signal-success/15 text-signal-success flex items-center justify-center">
              <IconCheck size={11} />
            </span>
            {item}
          </div>
        ))}
      </section>

      <div className="mt-6">
        <Link href="/app/payments" className="block">
          <Button fullWidth>Review payment plan</Button>
        </Link>
      </div>
    </AppShell>
  )
}

export default Page
