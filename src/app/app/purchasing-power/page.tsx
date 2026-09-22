"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import AppShell, { AppHeader } from "@/components/AppShell"
import Button from "@/components/Button"
import Card from "@/components/Card"
import Banner from "@/components/Banner"
import {
  IconAlertCircle,
  IconChevronLeft,
  IconInfo,
  IconRefresh,
  IconShield,
  IconSpark
} from "@/components/icons/Icon"
import { fetchPurchasingPower } from "@/lib/mock-api"
import { PPScenario, PPState, ppScenarioCopy } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/format"

// ---------------------------------------------------------------------------
// The PP destination. Scenario is driven by ?scenario=... so stakeholders
// can jump into any state directly from the flow index.
//
// PRD rules preserved here:
//   - Distinguish restored availability from a limit increase.
//   - Never claim a change we can't attribute.
//   - Loading / error / unavailable / eligibility states are all first-class.
// ---------------------------------------------------------------------------

type UIState =
  | { kind: "loading" }
  | { kind: "ok"; data: PPState }
  | { kind: "error"; message: string }

const scenarioLabel: Record<PPScenario, string> = {
  available_after_repayment: "Availability restored",
  available_unchanged: "No change from this payment",
  no_pp: "No active decision",
  no_headroom: "Fully committed",
  decision_unavailable: "Refreshing"
}

const PPHeader = () => (
  <AppHeader
    title="Purchasing power"
    leading={
      <Link
        href="/app/payments/pay/confirmation"
        className="p-2 -ml-2 rounded-input text-ink-secondary hover:bg-surface-inset transition-colors"
        aria-label="Back"
      >
        <IconChevronLeft size={20} />
      </Link>
    }
  />
)

const PPScreen = () => {
  const params = useSearchParams()
  const scenario = (params.get("scenario") as PPScenario | null) ?? "available_after_repayment"
  const forceError = params.get("error") === "1"
  const [state, setState] = useState<UIState>({ kind: "loading" })

  const load = () => {
    setState({ kind: "loading" })
    void fetchPurchasingPower({ scenario, simulateError: forceError }).then((res) => {
      if (res.status === "ok") setState({ kind: "ok", data: res.data })
      else setState({ kind: "error", message: res.message })
    })
  }

  useEffect(load, [scenario, forceError])

  const copy = ppScenarioCopy[scenario]
  const restored =
    state.kind === "ok" &&
    state.data.currentAvailable > state.data.previousAvailable &&
    scenario === "available_after_repayment"

  return (
    <AppShell header={<PPHeader />}>
      <AnimatePresence mode="wait">
        {state.kind === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-24 flex flex-col items-center text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
              className="w-10 h-10 rounded-full border-[3px] border-surface-inset border-t-brand"
              aria-hidden="true"
            />
            <p className="mt-5 text-b-md text-ink-secondary">Checking your purchasing power</p>
          </motion.div>
        )}

        {state.kind === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-16"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-surface-inset text-ink flex items-center justify-center">
                <IconAlertCircle size={26} />
              </div>
              <h2 className="mt-4 font-display text-h-sm text-ink">
                We couldn't load your purchasing power
              </h2>
              <p className="mt-2 text-b-sm text-ink-secondary max-w-[260px]">{state.message}</p>
            </div>
            <div className="mt-6 space-y-2">
              <Button fullWidth onClick={load}>
                Try again
              </Button>
              <Link href="/app/home" className="block">
                <Button fullWidth variant="secondary">
                  Back to home
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {state.kind === "ok" && (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3"
          >
            <p className="marker-chip text-ink-tertiary">{scenarioLabel[scenario]}</p>
            <p className="mt-2 text-b-md text-ink-secondary">{copy.headline}</p>

            {/* When PP isn't determinable we skip the amount entirely - never
                show a number we can't trust. */}
            {scenario !== "decision_unavailable" && scenario !== "no_pp" && (
              <>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="font-display text-h-xl text-ink">
                    {formatCurrency(state.data.currentAvailable, true)}
                  </p>
                  <span className="text-b-sm text-ink-tertiary">available</span>
                </div>

                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-surface-inset overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          state.data.approvedLimit > 0
                            ? `${Math.min(
                                (state.data.currentAvailable / state.data.approvedLimit) * 100,
                                100
                              )}%`
                            : "0%"
                      }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-brand"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-b-sm text-ink-secondary">
                    <span>Approved to spend</span>
                    <span className="font-medium text-ink">
                      {formatCurrency(state.data.approvedLimit, true)}
                    </span>
                  </div>
                </div>
              </>
            )}

            {restored && (
              <Banner
                className="mt-4"
                tone="success"
                icon={<IconSpark size={20} />}
                title="Availability restored"
                description={`Your recent payment made ${formatCurrency(
                  state.data.currentAvailable - state.data.previousAvailable
                )} available again. Your approved limit hasn't changed.`}
              />
            )}

            {scenario === "available_unchanged" && (
              <Banner
                className="mt-4"
                tone="neutral"
                icon={<IconInfo size={20} />}
                title="Your available spend didn't change"
                description="This payment didn't unlock more spend, but consistent, on-time payments can increase your purchasing power over time."
              />
            )}

            {scenario === "no_headroom" && (
              <Banner
                className="mt-4"
                tone="warning"
                icon={<IconInfo size={20} />}
                title="You're using all of your approved spend"
                description="Future payments can free up room to spend again."
              />
            )}

            {scenario === "no_pp" && (
              <Banner
                className="mt-4"
                tone="neutral"
                icon={<IconInfo size={20} />}
                title="No purchasing power on file"
                description="You'll see purchasing power here once you have an active decision."
              />
            )}

            {scenario === "decision_unavailable" && (
              <Banner
                className="mt-4"
                tone="info"
                icon={<IconRefresh size={20} />}
                title="We're still updating your purchasing power"
                description="This can take a few minutes after a payment is received."
                action={
                  <Button size="small" variant="secondary" onClick={load}>
                    Refresh
                  </Button>
                }
              />
            )}

            <div className="mt-5">
              <Card surface="inset" className="flex items-start gap-3">
                <IconShield size={18} className="text-ink-tertiary mt-0.5" />
                <div className="flex-1">
                  <p className="text-b-md font-medium text-ink">Available spend vs. your limit</p>
                  <p className="text-b-sm text-ink-secondary mt-1">
                    Available spend is the amount ready to use today. Your limit is what
                    you've been approved for overall — it doesn't change when a payment
                    frees up available spend.
                  </p>
                </div>
              </Card>
            </div>

            <div className="mt-6 space-y-2">
              {/* Only offer to shop when we know there is available PP. */}
              {state.data.currentAvailable > 0 && scenario !== "decision_unavailable" && (
                <Link href="/app/shop" className="block">
                  <Button fullWidth>Shop with purchasing power</Button>
                </Link>
              )}
              <Link href="/app/home" className="block">
                <Button
                  fullWidth
                  variant={state.data.currentAvailable > 0 ? "secondary" : "primary"}
                >
                  Back to home
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}

const LoadingFallback = () => (
  <AppShell header={<PPHeader />}>
    <div className="mt-24 flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border-[3px] border-surface-inset border-t-brand animate-spin" />
    </div>
  </AppShell>
)

const Page = () => (
  <Suspense fallback={<LoadingFallback />}>
    <PPScreen />
  </Suspense>
)

export default Page
