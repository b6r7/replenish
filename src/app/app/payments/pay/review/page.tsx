"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import AppShell, { AppHeader } from "@/components/AppShell"
import Card from "@/components/Card"
import Button from "@/components/Button"
import Banner from "@/components/Banner"
import { IconChevronLeft, IconInfo, IconShield } from "@/components/icons/Icon"
import { activePlan, paymentMethods } from "@/lib/mock-data"
import { formatCurrency, formatShortDate, hardNav } from "@/lib/format"
import { usePrototype } from "@/lib/store"

// ---------------------------------------------------------------------------
// Review screen: shown right before submitting the payment. The purpose is
// to make the pending action explicit — amount, method, plan, and date.
// ---------------------------------------------------------------------------

const Page = () => {
  const router = useRouter()
  const { draft, selectedPlan } = usePrototype()
  const method = paymentMethods.find((m) => m.id === draft.methodId) ?? paymentMethods[0]

  // When launched from a specific plan row, honor that merchant; otherwise
  // fall back to the default demo plan.
  const merchantLabel = selectedPlan?.merchant ?? activePlan.merchant
  const backHref = selectedPlan ? "/app/payments" : "/app/payments/pay"

  const handleSubmit = () => {
    hardNav("/app/payments/pay/processing", router)
  }

  return (
    <AppShell
      header={
        <AppHeader
          title="Review payment"
          leading={
            <Link
              href={backHref}
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
      >
        <Card>
          <p className="text-b-sm text-ink-secondary">Amount</p>
          <p className="font-display text-h-lg text-ink mt-1">{formatCurrency(draft.amount)}</p>
        </Card>
      </motion.div>

      <div className="mt-3">
        <Card>
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-b-sm text-ink-secondary">Payment method</dt>
              <dd className="text-b-md font-medium text-ink">
                {method.brand === "Bank" ? "Chase checking" : method.label} ... {method.last4}
              </dd>
            </div>
            <div className="hairline" />
            <div className="flex items-center justify-between">
              <dt className="text-b-sm text-ink-secondary">Plan</dt>
              <dd className="text-b-md font-medium text-ink">{merchantLabel}</dd>
            </div>
            <div className="hairline" />
            <div className="flex items-center justify-between">
              <dt className="text-b-sm text-ink-secondary">Payment date</dt>
              <dd className="text-b-md font-medium text-ink">
                {formatShortDate(new Date().toISOString())}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Banner
        className="mt-4"
        tone="neutral"
        icon={<IconInfo size={20} />}
        title="You'll get a receipt by email"
        description="Manual payments send you a receipt right away."
      />

      <div className="mt-4 flex items-center gap-2 text-b-sm text-ink-secondary">
        <IconShield size={16} className="text-signal-success" />
        Secure ACH transfer. No fees, ever.
      </div>

      <div className="mt-6">
        <Button fullWidth onClick={handleSubmit}>
          Pay {formatCurrency(draft.amount)} now
        </Button>
      </div>
    </AppShell>
  )
}

export default Page
