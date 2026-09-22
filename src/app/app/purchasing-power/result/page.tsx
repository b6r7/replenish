"use client"

// ---------------------------------------------------------------------------
// Purchasing Power — Result ($1,500)  ·  step 3 of the check-my-PP flow
//
// Aligned to Figma
// "Bulk Payments · Purchasing Power – Result ($1,500)"
// (fileKey WXijPC236hDo4YXfEgqaTA, node 6766:6728).
//
// Flow position:
//   confirmation → intro → income → RESULT (this) → shop OR home
//
// Design decision — theme:
//   The Figma preview renders in a broken dark-content-on-light-bg state
//   (all body text is `--color/text/primary` which resolves to white in the
//   design library, so it's white-on-white in the preview). The intended
//   design is DARK-theme (dark nav `#121319`, white text, lavender primary
//   button). Per your instruction we reuse `money_account-light` (white
//   matte), so building this as LIGHT-theme to keep the `mix-blend-multiply`
//   trick and the flow's visual continuity (intro / income / result all
//   share the same page bg + illustration treatment). A dark variant can be
//   added later by downloading `money_account-dark-light.mp4` from the DS
//   repo and switching this page's tokens.
//
// Layout notes:
//   - Illustration: 240×240 (Figma exact), centered, `mix-blend-multiply`
//   - PP eyebrow: bolt icon + "Your purchasing power" inline, centered
//   - Amount: 52px display Axiforma Medium (weight 500) — inline sizing
//     since we don't have an exact `text-h-xxl` utility for 52/70px/−1px
//   - Body: left-aligned pair of paragraphs at `text-b-lg`
//   - Buttons: primary + secondary stacked in normal flow (NOT sticky —
//     the Figma places them inline above the disclosure)
//   - Disclosure: 16px legal at `text-ink-tertiary` with inline links
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
    hideTabBar
    header={
      <AppHeader
        transparent
        leading={
          <Link
            href="/app/home"
            aria-label="Close"
            className="w-12 h-12 -ml-2 rounded-pill-md flex items-center justify-center text-ink hover:bg-surface-inset transition-colors"
          >
            <DsIcon name="close" size={20} />
          </Link>
        }
      />
    }
  >
    <div className="flex flex-col items-center gap-8 pb-4">
      {/* Illustration — 240×240 money_account, theme-aware. The DS ships
          both `-light.mp4` and `-dark.mp4` mattes; `<ThemedIllustration>`
          picks the right one for the active theme and applies the correct
          matte-erase blend mode. */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={0}
        className="-mt-2 pointer-events-none"
        aria-hidden="true"
      >
        <ThemedIllustration name="money_account" width={240} height={240} />
      </motion.div>

      {/* Eyebrow + big amount */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={1}
        className="flex flex-col items-center gap-1"
      >
        <div className="inline-flex items-center gap-1.5">
          <DsIcon name="bolt-filled" size={20} className="text-brand-accent" />
          <p className="text-b-lg text-ink leading-[27px]">Your purchasing power</p>
        </div>
        <p
          className="font-display font-medium text-ink text-center"
          style={{ fontSize: 52, lineHeight: "70px", letterSpacing: "-1px" }}
        >
          $1,500
        </p>
      </motion.div>

      {/* Body — left-aligned pair of paragraphs about the estimate. */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={2}
        className="w-full space-y-2"
      >
        <p className="text-b-lg text-ink leading-[27px]">
          This is an estimate of how much you can spend on 1 or more plans with Affirm. Each plan is approved separately, and your first payment may be due at checkout.
        </p>
        <p className="text-b-lg text-ink leading-[27px]">
          It&rsquo;s normal for this amount to change as you spend and make payments.
        </p>
      </motion.div>

      {/* Button group — inline (NOT sticky footer) to match Figma. */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={3}
        className="w-full space-y-3"
      >
        <Link href="/app/shop" className="block">
          <Button fullWidth size="large">
            Start shopping
          </Button>
        </Link>
        <Link href="/app/home" className="block">
          <Button fullWidth size="large" variant="secondary">
            Explore the app
          </Button>
        </Link>
      </motion.div>

      {/* Disclosure — 16px legal text with inline links.
          Links use `href="#"` for the prototype; wire to real destinations
          when the copy team confirms canonical URLs. */}
      <motion.p
        variants={stagger}
        initial="initial"
        animate="animate"
        custom={4}
        className="w-full text-b-md text-ink-tertiary leading-[24px]"
      >
        Your estimated amount will vary by store. Rates for payment plans will be 0&ndash;36%. Payment plans through Affirm require eligibility checks, depend on your purchase amount, and are provided by{" "}
        <Link href="#" className="font-medium text-brand-link underline hover:opacity-80 transition-opacity">
          these lending partners
        </Link>
        . For licenses and disclosures, including information for New Mexico residents, see{" "}
        <Link href="#" className="font-medium text-brand-link underline hover:opacity-80 transition-opacity">
          affirm.com/licenses
        </Link>
        . CA residents: Loans by Affirm Loan Services, LLC are made or arranged pursuant to a California Finance Lender license. Affirm provides guidance on what may influence changes in purchasing power but doesn&rsquo;t guarantee changes based on any set of actions.
      </motion.p>
    </div>
  </AppShell>
)

export default Page
