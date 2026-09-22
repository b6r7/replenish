"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import AppShell, { AppHeader } from "@/components/AppShell"
import Card from "@/components/Card"
import {
  IconHanger,
  IconHome,
  IconPlane,
  IconSearch,
  IconTv
} from "@/components/icons/Icon"
import { popularStores, shopCategories } from "@/lib/mock-data"

const categoryIconMap = {
  electronics: IconTv,
  home: IconHome,
  travel: IconPlane,
  fashion: IconHanger
} as const

const stagger = {
  initial: { opacity: 0, y: 6 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  })
}

const Page = () => (
  <AppShell
    header={
      <AppHeader
        title="Shop"
        trailing={
          <button
            className="p-2 rounded-input text-ink-secondary hover:bg-surface-inset transition-colors"
            aria-label="Search"
          >
            <IconSearch size={20} />
          </button>
        }
      />
    }
  >
    <motion.div variants={stagger} initial="initial" animate="animate" custom={0} className="mt-2">
      <label className="sr-only" htmlFor="shop-search">
        Search
      </label>
      <div className="flex items-center gap-2 rounded-input bg-surface-inset px-4 py-3">
        <IconSearch size={18} className="text-ink-tertiary" />
        <input
          id="shop-search"
          type="text"
          placeholder="Search for a store or product"
          className="flex-1 bg-transparent outline-none text-b-md placeholder:text-ink-tertiary"
        />
      </div>
    </motion.div>

    <motion.section variants={stagger} initial="initial" animate="animate" custom={1} className="mt-6">
      <div className="grid grid-cols-4 gap-2">
        {shopCategories.map((cat) => {
          const Icon = categoryIconMap[cat.icon]
          return (
            <button
              key={cat.id}
              className="flex flex-col items-center gap-2 py-3 rounded-card bg-surface-card hover:bg-surface-inset transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-surface-inset text-ink flex items-center justify-center">
                <Icon size={22} />
              </div>
              <span className="text-b-xs text-ink font-medium">{cat.label}</span>
            </button>
          )
        })}
      </div>
    </motion.section>

    <motion.section variants={stagger} initial="initial" animate="animate" custom={2} className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-h-sm text-ink">Featured</h2>
        <button className="text-b-sm text-brand-link font-medium underline">See all</button>
      </div>
      <Link href="/app/checkout" className="block">
        <Card className="p-0 overflow-hidden">
          <div className="p-4 pb-3 bg-surface-inset">
            <p className="text-b-sm text-ink-secondary">Tech for</p>
            <p className="font-display text-h-md text-ink">what's next</p>
            <p className="text-b-sm text-brand-link font-medium underline mt-3 inline-block">
              Shop now →
            </p>
          </div>
          <div className="h-32 bg-[#e8e9ee] flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-ink/80 border-[6px] border-ink relative">
              <div className="absolute inset-2 rounded-full bg-ink/95" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.section>

    <motion.section variants={stagger} initial="initial" animate="animate" custom={3} className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-h-sm text-ink">Popular stores</h2>
        <button className="text-b-sm text-brand-link font-medium underline">See all</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {popularStores.map((store) => (
          <button
            key={store.id}
            className="flex flex-col items-center gap-2 rounded-card"
            aria-label={store.name}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-brand-on text-b-xs font-semibold"
              style={{ background: store.accentColor }}
            >
              {store.name.slice(0, 4)}
            </div>
            <span className="text-b-xs text-ink font-medium">{store.name}</span>
          </button>
        ))}
      </div>
    </motion.section>
  </AppShell>
)

export default Page
