"use client"

// ---------------------------------------------------------------------------
// Make a payment — Wave 2. Rebuilt 1:1 against the Figma design
// (Plans-Wave-2 · node 2154:35784).
//
// Structure:
//   - Top nav bar: X close (only)
//   - Title: "Make a payment" + "For your {merchant} plan"
//   - Amount section: grouped card with 3 radio rows
//       · Upcoming payment (default, shows date + amount right)
//       · Remaining balance (shows total amount right)
//       · Custom amount (edit pencil right; expands to input when selected)
//   - Date section: single card row with calendar icon + today
//   - Payment method section: combined card showing method → plan flow
//   - 5% ACH incentive promo card (branded orb)
//   - Legal consent line
//   - Sticky footer with primary "Pay $X" CTA → skip review → processing
// ---------------------------------------------------------------------------

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import AppShell, { AppHeader } from "@/components/AppShell"
import Button from "@/components/Button"
import DsIcon from "@/components/DsIcon"
import MerchantLogo from "@/components/MerchantLogo"
import { activePlan, paymentMethods } from "@/lib/mock-data"
import { formatCurrency, cn, formatShortDate, hardNav } from "@/lib/format"
import { usePrototype } from "@/lib/store"

type Preset = "installment" | "remaining" | "custom"

const Page = () => {
  const router = useRouter()
  const { draft, selectedPlan, setAmount, setMethodId } = usePrototype()

  // Merchant + amounts. Pull from selectedPlan when the user launched this
  // flow from a plan row; otherwise fall back to the default demo plan.
  const merchant = selectedPlan?.merchant ?? activePlan.merchant
  const merchantLogo = selectedPlan?.logo ?? "nike"
  const installmentAmount = selectedPlan?.installmentAmount ?? activePlan.installmentAmount
  const remainingBalance =
    selectedPlan?.remainingBalance ??
    activePlan.installmentAmount * (activePlan.installmentsTotal - activePlan.installmentsPaid)
  const dueDateISO = selectedPlan?.dueDateISO ?? "2025-05-12"
  const installmentIndex = selectedPlan?.installmentIndex
  const installmentsTotal = selectedPlan?.installmentsTotal

  const [preset, setPreset] = useState<Preset>("installment")
  const [customValue, setCustomValue] = useState<string>(installmentAmount.toFixed(2))
  const [showMethodSheet, setShowMethodSheet] = useState(false)

  const selectedMethod = useMemo(
    () => paymentMethods.find((m) => m.id === draft.methodId) ?? paymentMethods[0],
    [draft.methodId]
  )

  const handlePreset = (next: Preset) => {
    setPreset(next)
    if (next === "installment") setAmount(installmentAmount)
    if (next === "remaining") setAmount(remainingBalance)
    if (next === "custom") setAmount(Number(customValue) || 0)
  }

  const handleCustomChange = (value: string) => {
    setCustomValue(value)
    if (preset === "custom") setAmount(Number(value) || 0)
  }

  const handlePay = () => {
    hardNav("/app/payments/pay/processing", router)
  }

  const canPay = draft.amount > 0

  return (
    <AppShell
      header={
        <AppHeader
          transparent
          leading={
            <Link
              href="/app/payments"
              aria-label="Close"
              className="w-12 h-12 -ml-2 rounded-pill-md flex items-center justify-center text-ink hover:bg-surface-inset transition-colors"
            >
              <DsIcon name="close" size={20} />
            </Link>
          }
        />
      }
      footer={
        <FooterCTA
          disabled={!canPay}
          amount={draft.amount}
          onPay={handlePay}
        />
      }
    >
      {/* Title */}
      <motion.header
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
        className="pt-2"
      >
        <h1 className="font-display text-h-md text-ink font-semibold">Make a payment</h1>
        <p className="mt-2 text-[20px] leading-[30px] text-ink">For your {merchant} plan</p>
      </motion.header>

      {/* Amount */}
      <section className="mt-8">
        <h2 className="font-display text-h-sm text-ink font-bold">Amount</h2>
        <div
          role="radiogroup"
          aria-label="Payment amount"
          className="mt-3 rounded-card border border-border bg-surface-card px-4 py-2"
        >
          <AmountRow
            selected={preset === "installment"}
            title="Upcoming payment"
            subtitle={`Due ${formatShortDate(dueDateISO)}`}
            right={<Amount value={installmentAmount} />}
            onSelect={() => handlePreset("installment")}
          />
          <Divider />
          <AmountRow
            selected={preset === "remaining"}
            title="Remaining balance"
            right={<Amount value={remainingBalance} />}
            onSelect={() => handlePreset("remaining")}
          />
          <Divider />
          <AmountRow
            selected={preset === "custom"}
            title="Custom amount"
            right={
              <button
                type="button"
                onClick={() => handlePreset("custom")}
                aria-label="Edit custom amount"
                className="w-9 h-9 flex items-center justify-center rounded-pill-sm text-brand-link hover:bg-surface-inset transition-colors"
              >
                <DsIcon name="edit" size={20} />
              </button>
            }
            onSelect={() => handlePreset("custom")}
          />
          <AnimatePresence>
            {preset === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pb-3 pt-1 pl-9">
                  <div className="flex items-center rounded-input bg-surface-inset px-4 py-3">
                    <span className="text-ink-secondary text-b-md">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={1}
                      max={remainingBalance}
                      value={customValue}
                      onChange={(e) => handleCustomChange(e.target.value)}
                      className="ml-2 bg-transparent outline-none flex-1 text-b-md text-ink placeholder:text-ink-tertiary"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Date */}
      <section className="mt-8">
        <h2 className="font-display text-h-sm text-ink font-bold">Date</h2>
        <button
          type="button"
          aria-label="Change payment date"
          className="mt-3 w-full rounded-card border border-border-subtle bg-surface-card px-4 py-4 flex items-center gap-3 hover:border-ink transition-colors"
        >
          <span className="w-6 h-6 flex items-center justify-center text-ink">
            <DsIcon name="calendar" size={22} />
          </span>
          <p className="flex-1 text-left text-b-lg text-ink">
            {formatShortDate(new Date().toISOString())}{" "}
            <span className="text-ink-secondary">(today)</span>
          </p>
          <DsIcon name="disclosure-right" size={20} className="text-ink-tertiary" />
        </button>
      </section>

      {/* Payment method */}
      <section className="mt-8">
        <h2 className="font-display text-h-sm text-ink font-bold">Payment method</h2>
        <div className="mt-3 rounded-card border border-border bg-surface-card px-4 py-3">
          <button
            type="button"
            onClick={() => setShowMethodSheet(true)}
            className="w-full flex items-center gap-4 py-2 group text-left"
            aria-label="Change payment method"
          >
            <span className="w-9 h-9 rounded-full bg-surface-inset border border-border-subtle flex items-center justify-center text-ink shrink-0">
              <DsIcon
                name={selectedMethod.brand === "Bank" ? "bank" : "card"}
                size={20}
              />
            </span>
            <p className="flex-1 text-b-lg font-semibold text-ink truncate">
              {selectedMethod.brand === "Bank" ? "Chase checking" : selectedMethod.label} ••••{" "}
              {selectedMethod.last4}
            </p>
            <DsIcon name="disclosure-right" size={20} className="text-ink-tertiary group-hover:text-ink transition-colors" />
          </button>

          {/* Money-flow arrow — 24px, indented past the leading graphic. */}
          <div className="pl-[6px] py-1 text-ink-secondary">
            <DsIcon name="arrow-down" size={20} />
          </div>

          <div className="w-full flex items-center gap-4 py-2">
            <MerchantLogo variant={merchantLogo} merchant={merchant} size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-b-lg text-ink truncate">Your {merchant} plan</p>
              {installmentIndex && installmentsTotal && (
                <p className="text-b-sm text-ink">
                  {installmentIndex} of {installmentsTotal}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border-subtle -mx-4 mt-2 pt-3 px-4">
            <p className="text-b-md text-ink-secondary">
              Any payments made after 7 pm ET will post on the next business day.
            </p>
          </div>
        </div>
      </section>

      {/* ACH incentive promo */}
      <section className="mt-4">
        <PromoCard />
      </section>

      {/* Legal */}
      <p className="mt-6 text-b-md text-ink">
        I agree to the{" "}
        <a
          href="#"
          className="text-brand-link font-medium underline decoration-solid underline-offset-2"
        >
          One-Time Payment Authorization.
        </a>
      </p>

      {/* Method sheet */}
      <AnimatePresence>
        {showMethodSheet && (
          <MethodSheet
            selectedId={draft.methodId}
            onSelect={(id) => {
              setMethodId(id)
              setShowMethodSheet(false)
            }}
            onClose={() => setShowMethodSheet(false)}
          />
        )}
      </AnimatePresence>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Presentational sub-components
// ---------------------------------------------------------------------------

const Divider = () => <div className="h-px bg-border-subtle" />

const Amount = ({ value }: { value: number }) => (
  <p className="text-b-lg text-ink whitespace-nowrap">{formatCurrency(value)}</p>
)

type AmountRowProps = {
  selected: boolean
  title: string
  subtitle?: string
  right: React.ReactNode
  onSelect: () => void
}

const AmountRow = ({ selected, title, subtitle, right, onSelect }: AmountRowProps) => (
  <div className="w-full flex items-center gap-3 py-3 min-h-[48px]">
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="flex items-center gap-3 flex-1 min-w-0 text-left"
    >
      <Radio selected={selected} />
      <span className="flex-1 min-w-0">
        <span className="block text-b-lg text-ink leading-[27px]">{title}</span>
        {subtitle && <span className="block text-b-sm text-ink-tertiary leading-[21px]">{subtitle}</span>}
      </span>
    </button>
    <div className="shrink-0">{right}</div>
  </div>
)

const Radio = ({ selected }: { selected: boolean }) => (
  <span
    className={cn(
      "shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
      selected ? "border-brand" : "border-border"
    )}
    aria-hidden="true"
  >
    {selected && <span className="w-3 h-3 rounded-full bg-brand" />}
  </span>
)

const PromoCard = () => (
  <div className="relative overflow-hidden rounded-card border border-border bg-surface-card h-[126px]">
    <div className="relative z-10 p-4 pr-[140px] flex flex-col gap-2">
      <p className="text-b-lg text-ink leading-[27px]">
        Pay with a bank account for 5% off your next payment.
      </p>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-brand-link font-medium text-b-md hover:opacity-80 transition-opacity"
      >
        Link a bank account
        <span aria-hidden="true">→</span>
      </button>
    </div>
    {/* Decorative orb + link icon */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24" aria-hidden="true">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(168,169,252,0.65), rgba(168,169,252,0.15) 55%, transparent 75%)"
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-14 h-14 rounded-full bg-brand-accent flex items-center justify-center text-white shadow-[0_4px_12px_rgba(74,74,244,0.4)]">
          <DsIcon name="linked" size={26} className="!text-white" />
        </span>
      </div>
    </div>
  </div>
)

// ---------------------------------------------------------------------------

const FooterCTA = ({
  disabled,
  amount,
  onPay
}: {
  disabled: boolean
  amount: number
  onPay: () => void
}) => (
  <Button fullWidth size="large" onClick={onPay} disabled={disabled}>
    Pay {formatCurrency(amount)}
  </Button>
)

// ---------------------------------------------------------------------------

const MethodSheet = ({
  selectedId,
  onSelect,
  onClose
}: {
  selectedId: string
  onSelect: (id: string) => void
  onClose: () => void
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-30 bg-ink/40 flex items-end"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
  >
    <motion.div
      initial={{ y: 60 }}
      animate={{ y: 0, transition: { type: "spring", damping: 24, stiffness: 220 } }}
      exit={{ y: 60 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full bg-surface-card rounded-t-modal p-6 pb-8"
    >
      <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
      <h3 className="font-display text-h-sm text-ink mb-4">Choose a payment method</h3>
      <ul className="space-y-2">
        {paymentMethods.map((m) => {
          const active = m.id === selectedId
          return (
            <li key={m.id}>
              <button
                onClick={() => onSelect(m.id)}
                className={cn(
                  "w-full rounded-card p-4 flex items-center gap-3 transition-colors text-left",
                  active
                    ? "bg-surface-inset border border-brand"
                    : "bg-surface-card border border-border-subtle hover:border-ink"
                )}
              >
                <div className="w-10 h-10 rounded-input bg-surface-inset flex items-center justify-center text-ink">
                  <DsIcon name={m.brand === "Bank" ? "bank" : "card"} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-b-md font-medium text-ink truncate">
                    {m.label} ... {m.last4}
                  </p>
                  {m.isDefault && <p className="text-b-sm text-ink-secondary">Default</p>}
                </div>
                <span
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                    active ? "border-brand bg-brand text-brand-on" : "border-border text-transparent"
                  )}
                >
                  {active && <DsIcon name="checkmark-small" size={14} className="!text-brand-on" />}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </motion.div>
  </motion.div>
)

export default Page
