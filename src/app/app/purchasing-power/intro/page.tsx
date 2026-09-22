"use client"

// ---------------------------------------------------------------------------
// Purchasing Power — Intro ("Check My Purchasing Power")
//
// Step 1 of the PP flow. Aligned to Figma
// "Bulk Payments · Purchasing Power – Intro (Check My Purchasing Power)"
// (fileKey WXijPC236hDo4YXfEgqaTA, node 6766:6708).
//
// The route sits at `/app/purchasing-power/intro` so the existing
// `/app/purchasing-power` results page stays untouched — it's step 2.
//
// Notes vs. Figma:
//   - Illustration uses `money_account-light` (Figma shows the dark variant
//     because the file is on a dark artboard). Per instruction we use the
//     light-theme asset from `@affirm/design-system/assets/illustration-system/`.
//   - Page bg is white (Figma `--color/bg/primary`) — we route it through
//     AppShell's `pageBg="surface-card"` prop so the transparent header,
//     body, and sticky-footer strip all read as one continuous white plane.
//   - `mix-blend-multiply` on the video knocks its white matte out against
//     the white page bg (white × white = white → invisible). Same technique
//     as the payoff hero on the confirmation screen.
// ---------------------------------------------------------------------------

import Link from "next/link"
import { motion } from "framer-motion"
import AppShell, { AppHeader } from "@/components/AppShell"
import Button from "@/components/Button"
import DsIcon from "@/components/DsIcon"
import ThemedIllustration from "@/components/ThemedIllustration"

const stagger = {
  initial: { opacity: 0, y: 8 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  })
}

const Page = () => (
  <AppShell
    pageBg="surface-card"
    header={
      <AppHeader
        transparent
        leading={
          <Link
            href="/app/payments/pay/confirmation"
            aria-label="Close"
            className="w-12 h-12 -ml-2 rounded-pill-md flex items-center justify-center text-brand-link hover:bg-surface-inset transition-colors"
          >
            <DsIcon name="close" size={20} />
          </Link>
        }
      />
    }
    footer={
      <Link href="/app/purchasing-power/income" className="block">
        <Button fullWidth size="large">
          Check my purchasing power
        </Button>
      </Link>
    }
  >
    <div className="flex flex-col items-center text-center">
      {/* Headline — Figma: 32px Axiforma Semibold, centered, w-358 */}
      <motion.h1
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={0}
        className="mt-4 max-w-[358px] font-display text-h-lg text-ink"
      >
        See how much you can spend today
      </motion.h1>

      {/* Illustration — Figma: 280×280 centered.
          `<ThemedIllustration>` swaps between `money_account-light.mp4`
          and `money_account-dark.mp4` + flips the blend mode so the
          matte disappears against whichever surface color is active. */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={1}
        className="mt-14 pointer-events-none"
        aria-hidden="true"
      >
        <ThemedIllustration name="money_account" width={280} height={280} />
      </motion.div>

      {/* Body — Figma: 18px Calibre Regular, centered, w-358 */}
      <motion.p
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={2}
        className="mt-14 max-w-[358px] text-b-lg text-ink leading-[27px]"
      >
        Get an estimate of how much you can spend at millions of places—without affecting your credit.
      </motion.p>
    </div>
  </AppShell>
)

export default Page
