"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import AppShell, { AppHeader } from "@/components/AppShell"
import AffirmMark from "@/components/AffirmMark"
import Button from "@/components/Button"
import Card from "@/components/Card"
import {
  IconArrowUpRight,
  IconBell,
  IconChevronRight,
  IconShield,
  IconUser
} from "@/components/icons/Icon"
import { activePlan, currentUser, upcomingPayments } from "@/lib/mock-data"
import { formatCurrency, formatShortDate } from "@/lib/format"

const nextPayment = upcomingPayments[0]

const stagger = {
  initial: { opacity: 0, y: 8 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  })
}

const Page = () => (
  <AppShell
    header={
      <AppHeader
        leading={<AffirmMark />}
        trailing={
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-input text-ink-secondary hover:bg-surface-inset transition-colors"
              aria-label="Notifications"
            >
              <IconBell size={20} />
            </button>
            <button
              className="p-2 rounded-input text-ink-secondary hover:bg-surface-inset transition-colors"
              aria-label="Account"
            >
              <IconUser size={20} />
            </button>
          </div>
        }
      />
    }
  >
    <motion.section variants={stagger} initial="initial" animate="animate" custom={0} className="mt-2">
      <p className="text-b-md text-ink-secondary">Good morning, {currentUser.firstName}</p>
      <p className="text-b-sm text-ink-tertiary">Here's where things stand.</p>
    </motion.section>

    <motion.div variants={stagger} initial="initial" animate="animate" custom={1} className="mt-4">
      <Card className="pb-5">
        <p className="text-b-sm text-ink-secondary">Next payment</p>
        <p className="font-display text-h-lg text-ink mt-1">{formatCurrency(nextPayment.amount)}</p>
        <p className="text-b-sm text-ink-secondary mt-1">
          Due {formatShortDate(nextPayment.dueDateISO)}
        </p>
        <div className="mt-5">
          <Link href="/app/payments/pay" className="block">
            <Button fullWidth size="medium" variant="primary">
              Make a payment
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>

    <motion.div variants={stagger} initial="initial" animate="animate" custom={2} className="mt-3">
      <Link href="/app/purchasing-power" className="block">
        <Card interactive className="flex items-center justify-between">
          <div>
            <p className="text-b-sm text-ink-secondary">Available to spend</p>
            <p className="font-display text-h-md text-ink mt-1">$1,250</p>
          </div>
          <IconChevronRight className="text-ink-tertiary" />
        </Card>
      </Link>
    </motion.div>

    <motion.div variants={stagger} initial="initial" animate="animate" custom={3} className="mt-3">
      <Card surface="inset" className="p-4 flex gap-3">
        <div className="w-9 h-9 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
          <IconShield size={18} />
        </div>
        <div>
          <p className="text-b-md font-medium text-ink">You're in control</p>
          <p className="text-b-sm text-ink-secondary mt-0.5">
            Manage your preferences and set payment reminders.
          </p>
        </div>
      </Card>
    </motion.div>

    <motion.section variants={stagger} initial="initial" animate="animate" custom={4} className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-h-sm text-ink">Recent purchases</h2>
        <Link href="/app/payments" className="text-b-sm text-brand-link font-medium underline">
          View all
        </Link>
      </div>
      <div className="mt-3 space-y-2">
        <Card className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-input bg-surface-inset flex items-center justify-center text-b-xs font-semibold text-ink-secondary">
            NIKE
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-b-md font-medium text-ink truncate">{activePlan.productLabel}</p>
            <p className="text-b-sm text-ink-secondary">
              Apr 28, 2025 · {activePlan.installmentsPaid} of {activePlan.installmentsTotal} payments
            </p>
          </div>
          <p className="text-b-md font-medium text-ink whitespace-nowrap">
            {formatCurrency(activePlan.totalAmount, true)}
          </p>
        </Card>
      </div>
    </motion.section>

    <motion.section variants={stagger} initial="initial" animate="animate" custom={5} className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-h-sm text-ink">Quick actions</h2>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href="/app/shop" className="block">
          <Card interactive className="h-full">
            <p className="text-b-md font-medium text-ink">Shop</p>
            <p className="text-b-sm text-ink-secondary mt-1">Explore stores</p>
            <IconArrowUpRight className="text-ink-tertiary mt-4" size={18} />
          </Card>
        </Link>
        <Link href="/app/purchasing-power" className="block">
          <Card interactive className="h-full">
            <p className="text-b-md font-medium text-ink">Purchasing power</p>
            <p className="text-b-sm text-ink-secondary mt-1">Check what's available</p>
            <IconArrowUpRight className="text-ink-tertiary mt-4" size={18} />
          </Card>
        </Link>
      </div>
    </motion.section>
  </AppShell>
)

export default Page
