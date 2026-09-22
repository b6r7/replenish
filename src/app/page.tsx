import Link from "next/link"
import { IconArrowUpRight } from "@/components/icons/Icon"

// ---------------------------------------------------------------------------
// Prototype landing page. Acts as the flow index.
//
// Scoped (for the current demo pass) to the single canonical scenario:
//
//   Redesigned Plans tab  →  Make a payment  →  Review  →  Processing
//   →  Confirmation  →  See my purchasing power (intro → income → result)
//
// All other screens (home, shop, checkout, emails, alt-state PP variants,
// payment failed, stuck processing) still live in the app and are reachable
// by direct URL — they're just not surfaced on the flow index while the
// team is aligning on the Plans-redesign journey. When we re-open scope,
// restore the additional `FlowGroup` entries.
// ---------------------------------------------------------------------------

type FlowLink = {
  href: string
  label: string
  description: string
  step?: string
}

type FlowGroup = {
  step: string
  title: string
  summary: string
  links: FlowLink[]
}

const groups: FlowGroup[] = [
  {
    step: "Journey · Plans redesign",
    title: "From Plans to purchasing power",
    summary:
      "The single demo scenario. Start on the redesigned Plans tab, complete a payment on a specific plan, receive confirmation, and check your purchasing power.",
    links: [
      {
        href: "/app/payments",
        label: "01 Plans",
        description:
          "Redesigned Plans tab · total balance, per-plan cards, contextual Pay CTAs."
      },
      {
        href: "/app/payments/pay",
        label: "02 Make a payment",
        description: "Amount + method for the selected plan."
      },
      {
        href: "/app/payments/pay/processing",
        label: "03 Processing",
        description: "Payment in flight."
      },
      {
        href: "/app/payments/pay/confirmation",
        label: "04 Confirmation",
        description:
          "Payment received first · PP replenishment note · CTA to check PP.",
        step: "04 · PRD hero"
      },
      {
        href: "/app/purchasing-power/intro",
        label: "05 PP intro",
        description: "Check my purchasing power intro."
      },
      {
        href: "/app/purchasing-power/income",
        label: "06 Enter income",
        description: "Annual income input."
      },
      {
        href: "/app/purchasing-power/result",
        label: "07 PP result",
        description: "Estimated purchasing power reveal."
      }
    ]
  }
]

const Page = () => (
  <div className="min-h-screen">
    <header className="max-w-[1080px] mx-auto px-6 pt-16 pb-10">
      <p className="marker-chip">Affirm · Plans redesign · Wave 2</p>
      <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="font-display text-h-xl text-ink">
            Replenish.
            <br />A clearer path to what&apos;s next.
          </h1>
          <p className="mt-4 text-b-lg text-ink-secondary">
            High-fidelity prototype for the redesigned Plans tab and the
            payment-to-purchasing-power flow that follows. Payment receipt is
            job #1. Purchasing power is communicated separately, accurately,
            and only when the system is ready.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/app/payments"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill-md bg-brand text-brand-on font-medium hover:bg-brand-hover transition-colors"
          >
            Enter the prototype
            <IconArrowUpRight size={18} />
          </Link>
          <Link
            href="/storyboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill-md bg-surface-card border border-border text-ink font-medium hover:border-ink transition-colors"
          >
            Open storyboard
          </Link>
        </div>
      </div>
    </header>
    <div className="hairline max-w-[1080px] mx-auto" />

    <main className="max-w-[1080px] mx-auto px-6 py-14 grid gap-16">
      {groups.map((group) => (
        <section key={group.title}>
          <div className="mb-6 max-w-2xl">
            <p className="marker-chip">{group.step}</p>
            <h2 className="mt-2 font-display text-h-lg text-ink">{group.title}</h2>
            <p className="mt-2 text-b-md text-ink-secondary">{group.summary}</p>
          </div>
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group block bg-surface-card rounded-card p-5 border border-transparent hover:border-ink transition-colors h-full"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="marker-chip">{link.step ?? group.step}</p>
                      <p className="font-display text-h-sm text-ink mt-1">{link.label}</p>
                    </div>
                    <IconArrowUpRight
                      size={18}
                      className="text-ink-tertiary group-hover:text-brand transition-colors"
                    />
                  </div>
                  <p className="mt-3 text-b-sm text-ink-secondary">{link.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>

    <footer className="max-w-[1080px] mx-auto px-6 py-10 border-t border-border-subtle text-b-sm text-ink-tertiary flex flex-wrap gap-3 justify-between">
      <p>affirm · replenish prototype · phase 1</p>
      <p>UX / design / implementation ready</p>
    </footer>
  </div>
)

export default Page
