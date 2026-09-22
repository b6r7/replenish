"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import AppShell from "@/components/AppShell"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { IconAlertCircle } from "@/components/icons/Icon"
import { paymentMethods } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/format"
import { usePrototype } from "@/lib/store"

// ---------------------------------------------------------------------------
// Payment failure. PRD: on failure, do NOT surface the PP benefit; keep the
// user focused on recovering the payment.
// ---------------------------------------------------------------------------

const Page = () => {
  const { draft } = usePrototype()
  const method = paymentMethods.find((m) => m.id === draft.methodId) ?? paymentMethods[0]

  return (
    <AppShell hideTabBar>
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
        className="mt-6 flex flex-col items-center text-center"
      >
        <div className="w-14 h-14 rounded-full bg-signal-error/12 text-signal-error flex items-center justify-center">
          <IconAlertCircle size={30} />
        </div>
        <h1 className="mt-4 font-display text-h-md text-ink">Payment failed</h1>
        <p className="mt-1 text-b-md text-ink-secondary max-w-[260px]">
          Try another payment method or check your balance.
        </p>
      </motion.section>

      <div className="mt-6">
        <Card>
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-b-sm text-ink-secondary">Attempted</dt>
              <dd className="font-display text-h-sm text-ink">{formatCurrency(draft.amount)}</dd>
            </div>
            <div className="hairline" />
            <div className="flex items-center justify-between">
              <dt className="text-b-sm text-ink-secondary">Payment method</dt>
              <dd className="text-b-md font-medium text-ink">
                {method.brand === "Bank" ? "Chase checking" : method.label} ... {method.last4}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="mt-6 space-y-2">
        <Link href="/app/payments/pay" className="block">
          <Button fullWidth>Try a different method</Button>
        </Link>
        <Link href="/app/payments" className="block">
          <Button fullWidth variant="secondary">
            Back to payments
          </Button>
        </Link>
      </div>
    </AppShell>
  )
}

export default Page
