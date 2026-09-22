"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import AppShell from "@/components/AppShell"
import Banner from "@/components/Banner"
import { IconClock } from "@/components/icons/Icon"
import { submitPayment } from "@/lib/mock-api"
import { usePrototype } from "@/lib/store"
import { hardNav } from "@/lib/format"

// ---------------------------------------------------------------------------
// Processing screen. Deliberately calm — the copy commits to "processing",
// not "received", per the PRD's sequencing principle: never claim
// "payment received" before the system can support that state.
// ---------------------------------------------------------------------------

const ProcessingInner = () => {
  const router = useRouter()
  const search = useSearchParams()
  const stuck = search.get("stuck") === "1"
  const { draft, markConfirmation } = usePrototype()
  const [showExtended, setShowExtended] = useState(stuck)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const extendedTimer = window.setTimeout(() => {
        if (!cancelled) setShowExtended(true)
      }, 3500)

      const result = await submitPayment({
        amount: draft.amount,
        methodId: draft.methodId,
        planId: draft.planId,
        scenario: draft.scenario
      })
      window.clearTimeout(extendedTimer)
      if (cancelled) return

      if (result.status === "received") {
        markConfirmation(result.confirmationId, result.receivedAt)
        hardNav("/app/payments/pay/confirmation", router, "replace")
      } else {
        hardNav("/app/payments/pay/failed", router, "replace")
      }
    }
    if (!stuck) void run()
    return () => {
      cancelled = true
    }
  }, [draft.amount, draft.methodId, draft.planId, draft.scenario, markConfirmation, router, stuck])

  return (
    <AppShell hideTabBar>
      <div className="min-h-[560px] flex flex-col items-center justify-center text-center px-4 mt-[40px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          className="w-12 h-12 rounded-full border-[3px] border-surface-inset border-t-brand"
          aria-hidden="true"
        />
        <h1 className="mt-6 font-display text-h-md text-ink">We're processing your payment</h1>
        <p className="mt-2 text-b-md text-ink-secondary max-w-[240px]">
          Hang tight — this usually takes just a few seconds.
        </p>

        {showExtended && (
          <div className="mt-8 w-full">
            <Banner
              tone="warning"
              icon={<IconClock size={20} />}
              title="This is taking longer than usual"
              description="You can safely close this screen. We'll email you as soon as your payment is confirmed."
            />
          </div>
        )}
      </div>
    </AppShell>
  )
}

const Page = () => (
  <Suspense fallback={<AppShell hideTabBar><div /></AppShell>}>
    <ProcessingInner />
  </Suspense>
)

export default Page
