"use client"

// ---------------------------------------------------------------------------
// Payment confirmation — Wave 2. Aligned to the Figma
// "Redesign L2 Envelope screen (delightful)" pattern
// (Plans-Wave-2 · node 3422:37593).
//
// Key differences vs. the Figma design (intentional, per the Replenish PRD):
//   - The Figma discovery card ("Discover 0% APR…") is replaced by our
//     Purchasing Power card. Visual container style, spacing, and orb
//     decoration match Figma; the message is PP-focused.
//   - Heading + subtitle are adaptive:
//       · full payoff  →  "You paid off your plan" + Figma's congrats copy
//       · overdue caught up  →  "You're back on track"
//       · regular installment  →  "Payment received"
//   - PP messaging respects PRD principles: framed as availability, not
//     spending; long-term note placed after the PP CTA.
// ---------------------------------------------------------------------------

import Link from "next/link"
import { motion } from "framer-motion"
import AppShell, { AppHeader } from "@/components/AppShell"
import Button from "@/components/Button"
import DsIcon from "@/components/DsIcon"
import MerchantLogo from "@/components/MerchantLogo"
import ThemedIllustration from "@/components/ThemedIllustration"
import { activePlan, paymentMethods } from "@/lib/mock-data"
import { formatCurrency, formatShortDate, formatTime } from "@/lib/format"
import { usePrototype } from "@/lib/store"

const stagger = {
  initial: { opacity: 0, y: 8 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.45, ease: [0.16, 1, 0.3, 1] }
  })
}

const Page = () => {
  const { draft, selectedPlan, resetDraft } = usePrototype()
  const method = paymentMethods.find((m) => m.id === draft.methodId) ?? paymentMethods[0]
  const receivedAt = draft.receivedAtISO ?? new Date().toISOString()

  const merchant = selectedPlan?.merchant ?? activePlan.merchant
  const merchantLogo = selectedPlan?.logo ?? "nike"
  const hasInstallments = selectedPlan
    ? Boolean(selectedPlan.installmentsTotal && selectedPlan.installmentIndex)
    : true
  const totalCount = selectedPlan?.installmentsTotal ?? activePlan.installmentsTotal

  // Overdue catch-up wins over payoff detection when the plan has no
  // installment schedule (single lump-sum owed). Paying that amount is
  // catching up, not "paying off a plan you planned over time".
  const isOverdueCaughtUp =
    !selectedPlan?.installmentsTotal && selectedPlan?.id === "plan_apple"

  // Payoff detection: user chose "Remaining balance" (or paid within a
  // cent of it) on a plan that HAS installments, i.e. actually retiring
  // an installment plan.
  const paidRemainingBalance =
    !isOverdueCaughtUp &&
    Boolean(selectedPlan?.remainingBalance) &&
    Math.abs(draft.amount - (selectedPlan?.remainingBalance ?? 0)) < 0.01

  // When paying off, snap installment counter to full; otherwise use the
  // installment this payment covers.
  const paidCount = paidRemainingBalance
    ? totalCount
    : selectedPlan?.installmentIndex ?? activePlan.installmentsPaid + 1

  const isPayoff =
    paidRemainingBalance || (hasInstallments && paidCount === totalCount)
  const heading = isPayoff
    ? "You paid off your plan"
    : isOverdueCaughtUp
    ? "You're back on track"
    : "Payment received"
  const subhead = isPayoff
    ? "Congrats—you planned, you purchased, and you paid your way over time. Nice!"
    : isOverdueCaughtUp
    ? `Nice work catching up on your ${merchant} plan.`
    : `Your ${merchant} payment is on the way. We'll email you a receipt.`

  // Payoff is the peak-end of a months-long commitment; the DS ships a
  // `plan_paid` illustration specifically for this state. All other states
  // stay text-only: catching up on overdue reads more trustworthy without
  // celebration, and routine installments happen ~3-5×/month per user, so
  // per-payment fanfare would erode into friction.
  const showPayoffHero = isPayoff
  // Stagger indices shift down by 1 when the hero is present so the
  // illustration leads and the heading follows.
  const staggerBase = showPayoffHero ? 1 : 0

  const handleDone = () => {
    resetDraft()
  }

  return (
    <AppShell
      header={
        <AppHeader
          transparent
          leading={
            <Link
              href="/app/payments"
              aria-label="Close"
              onClick={handleDone}
              className="w-12 h-12 -ml-2 rounded-pill-md flex items-center justify-center text-brand-link hover:bg-surface-inset transition-colors"
            >
              <DsIcon name="close" size={20} />
            </Link>
          }
        />
      }
      footer={
        <Link href="/app/payments" className="block" onClick={handleDone}>
          <Button fullWidth size="large">
            See my plans
          </Button>
        </Link>
      }
    >
      {/* Payoff hero — the DS `plan_paid` illustration only for the payoff
          branch. Centered at 168px (proportional to a personal milestone,
          not a hero-scale takeover). `<ThemedIllustration>` swaps between
          the light-matte and dark-matte mp4 variants + the correct blend
          mode so the matte disappears against the current theme's surface.
          `-mt-10` lifts the whole content stack up 40px so the illustration
          doesn't float in an oversized top gap below the X close. */}
      {showPayoffHero && (
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          custom={0}
          className="-mt-10 pt-2 flex justify-center"
          aria-hidden="true"
        >
          <ThemedIllustration name="plan_paid" width={168} height={168} />
        </motion.div>
      )}

      {/* Title — when there's no payoff hero, this element leads, so it
          carries the same -40px lift so all non-payoff states also sit
          tighter to the top edge. */}
      <motion.header
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={staggerBase}
        className={showPayoffHero ? "pt-3" : "-mt-10 pt-2"}
      >
        <h1 className="font-display text-h-md text-ink">{heading}</h1>
        <p className="mt-3 text-b-lg text-ink leading-[27px]">{subhead}</p>
      </motion.header>

      {/* Summary */}
      <motion.section
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={staggerBase + 1}
        className="mt-8"
      >
        <h2 className="font-display text-h-sm text-ink font-bold">Summary</h2>

        <div className="mt-3 rounded-card border border-border bg-surface-card px-4 py-3">
          {/* Date */}
          <SummaryRow
            icon={
              <span className="w-6 h-6 flex items-center justify-center text-ink">
                <DsIcon name="calendar" size={22} />
              </span>
            }
            title={formatShortDate(receivedAt)}
            subtitle={formatTime(receivedAt)}
          />
          <Divider />

          {/* Money-flow: method → plan */}
          <SummaryRow
            icon={
              <span className="w-6 h-6 flex items-center justify-center text-ink">
                <DsIcon name={method.brand === "Bank" ? "bank" : "card"} size={22} />
              </span>
            }
            title={
              method.brand === "Bank"
                ? `Bank account •••• ${method.last4}`
                : `${method.label} •••• ${method.last4}`
            }
          />
          <div className="pl-[6px] py-1 text-ink-secondary">
            <DsIcon name="arrow-down" size={20} />
          </div>
          <SummaryRow
            icon={<MerchantLogo variant={merchantLogo} merchant={merchant} size={24} />}
            title={`Your ${merchant} plan`}
            subtitle={
              hasInstallments ? (
                <>
                  <span className="font-semibold text-ink">{formatCurrency(draft.amount)}</span>
                  {" · "}
                  <span className="text-ink">
                    {paidCount} of {totalCount}
                  </span>
                </>
              ) : (
                <span className="font-semibold text-ink">{formatCurrency(draft.amount)}</span>
              )
            }
          />
        </div>
      </motion.section>

      {/* Purchasing power card — matches Figma discovery-card visual pattern */}
      <motion.section
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={staggerBase + 2}
        className="mt-4"
      >
        <PurchasingPowerCard />
      </motion.section>

      {/* Settlement note — bank-only. Card payments settle in near-real-time,
          so no timing caveat is needed there. Copy is past-tense factual
          ("typically settle") rather than warning ("may take … make sure"),
          because post-payment is not the right moment to introduce doubt
          about a customer's account balance. */}
      {method.brand === "Bank" && (
        <motion.p
          variants={stagger}
          initial="initial"
          animate="animate"
          custom={staggerBase + 3}
          className="mt-6 text-b-sm text-ink-tertiary leading-[21px]"
        >
          Bank payments typically settle in 3–5 business days.
        </motion.p>
      )}
    </AppShell>
  )
}

// ---------------------------------------------------------------------------

const Divider = () => <div className="h-px bg-border-subtle my-1" />

type SummaryRowProps = {
  icon: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
}

const SummaryRow = ({ icon, title, subtitle }: SummaryRowProps) => (
  <div className="flex items-center gap-4 min-h-[48px] py-1">
    <div className="min-w-[36px] flex items-center justify-center">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-b-lg text-ink leading-[27px] truncate">{title}</p>
      {subtitle && <p className="text-b-sm text-ink leading-[21px]">{subtitle}</p>}
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// PP card — matches Figma discovery-card visual pattern (left text + right
// orb decoration in a bordered card) but content is Purchasing Power.
// Preserves the PRD's PP content principles: availability, not spending;
// long-term note follows the primary CTA.
// ---------------------------------------------------------------------------

// PP card
//
// Structure:
//   [⚡]  Headline                    ← media-object row (icon + headline share)
//   Every on-time payment helps...    ← support: full card-inner width
//   See my purchasing power →         ← CTA:     full card-inner width
//
// Only the icon and headline share a horizontal media-object row. The
// support line and CTA break out below and start at the card's own inner
// padding-left edge (16px from the card border) — so they align with the
// left edge of the icon, NOT indented past it. This gives the two secondary
// pieces (long-term promise + CTA) their own reading rhythm without being
// visually tucked beside the icon column.
//
// PRD hedges preserved ("some", "helps") because full replenishment depends
// on bank-settlement, and PP growth is a probability, not a promise.
const PurchasingPowerCard = () => (
  <div className="rounded-card border border-border bg-surface-card p-4">
    {/* Row 1 — icon + headline media-object lockup.
        `items-center` because the bolt reads as a badge next to a title,
        not a bullet marker. */}
    <div className="flex items-center gap-3">
      {/* DS `purchasing_power` illustration. 56×56.
          `<ThemedIllustration>` handles the matte-erase blend + light/dark
          variant swap so it reads clean on either theme. Note: the card
          bg (`--card-bg`) and the illustration matte both flip together
          so the multiply/screen trick keeps working. */}
      <div
        className="shrink-0 w-14 h-14 pointer-events-none"
        aria-hidden="true"
      >
        <ThemedIllustration name="purchasing_power" width={56} height={56} className="w-full h-full" />
      </div>

      <p className="min-w-0 flex-1 text-b-lg font-semibold text-ink leading-[27px]">
        You just replenished some purchasing power.
      </p>
    </div>

    {/* Row 2 — support. Direct card child → left-aligns to card p-4 edge. */}
    <p className="mt-3 text-b-md text-ink-secondary leading-[24px]">
      Every on-time payment helps grow it over time.
    </p>

    {/* Row 3 — CTA. Direct card child → left-aligns to card p-4 edge. */}
    <Link
      href="/app/purchasing-power/intro"
      className="mt-3 inline-flex items-center gap-1 text-brand-link font-medium text-b-md hover:opacity-80 transition-opacity"
    >
      See my purchasing power
      <span aria-hidden="true">→</span>
    </Link>
  </div>
)

export default Page
