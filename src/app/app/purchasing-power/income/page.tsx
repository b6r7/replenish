"use client"

// ---------------------------------------------------------------------------
// Purchasing Power — Enter Income (step 2)
//
// Aligned to Figma
// "Bulk Payments · Purchasing Power – Enter Income"
// (fileKey WXijPC236hDo4YXfEgqaTA, node 6766:6715).
//
// Flow position:
//   confirmation → intro → INCOME (this) → results
//
// Notes vs. Figma:
//   - Real editable <input> (inputMode="numeric") with the Figma's filled
//     value as the initial state. We format on blur / render as currency.
//   - Decorative iOS numeric keyboard rendered below the CTA. Non-functional
//     (aria-hidden) — it's visual context for "the user is entering income",
//     not a working input method. On mobile the OS keyboard would still
//     appear on real focus; on desktop demo the mock provides the visual.
//   - Page bg is white (Figma `--color/bg/primary`) via AppShell's
//     `pageBg="surface-card"` prop — same treatment as the intro screen so
//     transparent header + body + footer read as one continuous plane.
//   - Skip and the primary CTA both route to results for prototype purposes.
//     A future pass could distinguish "with income" vs "no income" via a
//     query param.
// ---------------------------------------------------------------------------

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import AppShell, { AppHeader } from "@/components/AppShell"
import Button from "@/components/Button"
import DsIcon from "@/components/DsIcon"
import { cn } from "@/lib/format"

const stagger = {
  initial: { opacity: 0, y: 8 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.07 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  })
}

const formatIncome = (n: number) => `$${n.toLocaleString("en-US")}`

const parseIncome = (raw: string) => {
  const digits = raw.replace(/[^0-9]/g, "")
  if (!digits) return 0
  return Number(digits)
}

const Page = () => {
  // Figma renders the filled state with the value $35,678, so we seed with
  // that. The user can edit; we re-format on every keystroke because it's
  // a currency field.
  const [income, setIncome] = useState<number>(35678)

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(parseIncome(e.target.value))
  }

  return (
    <AppShell
      pageBg="surface-card"
      header={
        <AppHeader
          transparent
          leading={
            <Link
              href="/app/purchasing-power/intro"
              aria-label="Back"
              className="w-12 h-12 -ml-2 rounded-pill-md flex items-center justify-center text-ink hover:bg-surface-inset transition-colors"
            >
              <DsIcon name="arrow-left" size={20} />
            </Link>
          }
          trailing={
            <Link
              href="/app/purchasing-power/result"
              className="h-12 -mr-3.5 px-3.5 rounded-pill-md inline-flex items-center text-brand-link font-medium text-b-md hover:bg-surface-inset transition-colors"
            >
              Skip
            </Link>
          }
        />
      }
      footer={
        <>
          <Link href="/app/purchasing-power/result" className="block">
            <Button fullWidth size="large">
              Check my purchasing power
            </Button>
          </Link>
          {/* Bleed past the footer's own `px-4 pb-6` so the keyboard fills
              the phone edge-to-edge and reaches the bottom of the frame. */}
          <div className="-mx-4 -mb-6 mt-4" aria-hidden="true">
            <MockNumericKeyboard />
          </div>
        </>
      }
    >
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={0}
        className="mt-2 space-y-2"
      >
        <h1 className="font-display text-h-md text-ink">Enter your income</h1>
        <p className="text-b-lg text-ink leading-[27px]">
          This helps us figure out how much you can spend. Sharing your income won&rsquo;t affect your credit score.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={1}
        className="mt-4"
      >
        <FloatingLabelInput
          id="annual-income"
          label="Annual income*"
          value={formatIncome(income)}
          onChange={handleIncomeChange}
          inputMode="numeric"
          autoComplete="off"
        />
        <p className="mt-2 text-b-md text-ink-secondary leading-[24px]">
          You don&rsquo;t need to include alimony, child support, or separate maintenance income unless you want it considered as a basis for repaying your plan.
        </p>
      </motion.div>
    </AppShell>
  )
}

export default Page

// ---------------------------------------------------------------------------
// FloatingLabelInput
//
// Matches Figma "Input: Text" filled/resting spec:
//   - min-height 56px, radius 8px (radius-input), px-4 py-2, gap-y 2px
//   - Border #7c808e (border token) at 1px in resting; brand on focus
//   - Label: 14px Calibre Medium, ink-secondary (#5f6272)
//   - Value: 16px Calibre Regular, ink (#121319)
//   - Label sits above the value at all times (filled variant, not floating
//     animation). The Figma design has it permanently on top.
// ---------------------------------------------------------------------------

type FloatingLabelInputProps = {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"]
  autoComplete?: string
  autoFocus?: boolean
}

const FloatingLabelInput = ({
  id,
  label,
  value,
  onChange,
  inputMode,
  autoComplete,
  autoFocus
}: FloatingLabelInputProps) => {
  const [focused, setFocused] = useState(false)
  return (
    <div
      className={cn(
        "min-h-[56px] rounded-input border bg-surface-card px-4 py-2 flex flex-col justify-center gap-[2px] transition-colors",
        focused ? "border-brand" : "border-ink-tertiary"
      )}
    >
      <label
        htmlFor={id}
        className="text-b-sm font-medium text-ink-secondary leading-[18px]"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="bg-transparent text-b-md text-ink leading-[20px] outline-none w-full"
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// MockNumericKeyboard
//
// Decorative iOS-style numeric keyboard for hi-fi context. Non-functional
// (aria-hidden). Colors, sizes, and layout mirror Figma:
//   - Container: rgba(51,52,52,0.6) with backdrop-blur, pt-1.5 px-1.5
//   - Keys: rgba(255,255,255,0.3), radius 5px, height 46px, drop-shadow
//   - Numbers: 25px, white, near-SF-Pro proxy via system font stack
//   - Letters (10px) beneath number for 2-9
//   - Row 4: empty slot | "0" | delete glyph
// ---------------------------------------------------------------------------

const KEYS: Array<{ n: string; letters?: string }> = [
  { n: "1" },
  { n: "2", letters: "ABC" },
  { n: "3", letters: "DEF" },
  { n: "4", letters: "GHI" },
  { n: "5", letters: "JKL" },
  { n: "6", letters: "MNO" },
  { n: "7", letters: "PQRS" },
  { n: "8", letters: "TUV" },
  { n: "9", letters: "WXYZ" }
]

const MockNumericKeyboard = () => (
  <div
    className="w-full bg-[rgba(51,52,52,0.6)] backdrop-blur-md pt-1.5 px-1.5 pb-3 select-none"
    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}
  >
    <div className="flex flex-col gap-2">
      {[0, 3, 6].map((offset) => (
        <div key={offset} className="flex gap-1.5">
          {KEYS.slice(offset, offset + 3).map((key) => (
            <KeyCell key={key.n} number={key.n} letters={key.letters} />
          ))}
        </div>
      ))}
      <div className="flex gap-1.5">
        <div className="flex-1 h-[46px]" />
        <KeyCell number="0" />
        <DeleteKey />
      </div>
    </div>
    {/* Home indicator area */}
    <div className="mt-2 pt-2 pb-1 flex justify-center">
      <div className="w-[139px] h-[5px] rounded-full bg-white/95" />
    </div>
  </div>
)

const KeyCell = ({ number, letters }: { number: string; letters?: string }) => (
  <div
    className="flex-1 h-[46px] rounded-[5px] bg-white/30 shadow-[0_1px_0_rgba(0,0,0,0.4)] flex flex-col items-center justify-center leading-none pb-[2px]"
  >
    <span className="text-white text-[24px] font-normal leading-[26px] -mb-[2px]">{number}</span>
    {letters && (
      <span className="text-white text-[10px] font-bold tracking-[2px] leading-none">
        {letters}
      </span>
    )}
  </div>
)

const DeleteKey = () => (
  <div className="flex-1 h-[46px] rounded-[5px] flex items-center justify-center">
    <svg
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.5 1H21C22.1046 1 23 1.89543 23 3V15C23 16.1046 22.1046 17 21 17H7.5L1 9L7.5 1Z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M11 6L17 12M17 6L11 12"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  </div>
)
