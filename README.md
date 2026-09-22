# Replenish — Affirm purchasing-power prototype (Phase 1)

A high-fidelity, implementation-oriented prototype of the purchasing-power
(PP) replenishment experience. Built against the PRD provided in the input
context; the UX artifacts and product logic are treated as authoritative.

The prototype's goal is to preserve the original product thinking so
stakeholder demos, PM alignment, usability testing, and engineering kickoff
can move faster with less ambiguity.

---

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

Node 18+ recommended.

---

## Route map

| Route | Purpose |
| --- | --- |
| `/` | Flow index. Every journey and every alt state, one click away. |
| `/storyboard` | Single-canvas layout of every screen (live iframes). |
| `/app/home` | Account overview, next payment, quick actions. |
| `/app/shop` | Categories, featured, popular stores. |
| `/app/checkout` | Product + payment-plan selection. |
| `/app/payments` | Upcoming payments (with `Manage` CTA) & history tabs. |
| `/app/payments/pay` | Manual payment — amount preset + method sheet + demo scenario toggle. |
| `/app/payments/pay/review` | Review before submit. |
| `/app/payments/pay/processing` | Simulated payment latency (~1.6s). `?stuck=1` shows extended-latency banner. |
| `/app/payments/pay/confirmation` | **PRD hero.** Payment received → PP value prop → CTA to check PP. |
| `/app/payments/pay/failed` | Failure recovery — deliberately hides PP messaging. |
| `/app/purchasing-power` | PP destination. Scenarios via `?scenario=…` and `?error=1`. |
| `/emails/manual-receipt` | Journey C — immediate manual receipt, PP via CTA only (no amount). |
| `/emails/autopay-receipt` | Journey B — Autopay receipt sent 4h later, PP shown inline. |

Scenario query params on `/app/purchasing-power`:

- `available_after_repayment` (default) — headroom exists, replenished.
- `available_unchanged` — payment received, availability did not grow.
- `no_headroom` — PP fully committed; nothing to replenish.
- `no_pp` — user has no active decision.
- `decision_unavailable` — refresh-first fallback while backend catches up.
- `error=1` — PP retrieval failure with retry.

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx              // Root layout + PrototypeProvider
│   ├── globals.css             // Tokenized CSS variables
│   ├── page.tsx                // Flow index
│   ├── storyboard/page.tsx     // All screens on one canvas
│   ├── app/
│   │   ├── layout.tsx          // Wraps every app screen in a phone frame
│   │   ├── home/page.tsx
│   │   ├── shop/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── payments/
│   │   │   ├── page.tsx        // Upcoming + History tabs
│   │   │   └── pay/            // Amount → Review → Processing → Confirmation/Failed
│   │   └── purchasing-power/page.tsx
│   └── emails/
│       ├── layout.tsx          // Email canvas
│       ├── manual-receipt/page.tsx
│       └── autopay-receipt/page.tsx
├── components/
│   ├── DeviceFrame.tsx         // iPhone-esque phone frame
│   ├── AppShell.tsx            // Header + scroll area + persistent tab bar
│   ├── AffirmMark.tsx
│   ├── EmailFrame.tsx
│   ├── Banner.tsx
│   ├── Card.tsx
│   ├── Button.tsx
│   └── icons/Icon.tsx          // Inline SVG icon set (no external deps)
├── lib/
│   ├── mock-data.ts            // User, plan, methods, PP scenarios, copy
│   ├── mock-api.ts             // Fake payment submit + PP fetch with latency
│   ├── store.tsx               // React Context prototype store (draft state)
│   └── format.ts               // Currency/date/classname helpers
└── styles/                     // (empty; tokens live in globals.css)
```

Key patterns:

- **App Router** with `use client` where interactivity is needed (all app
  screens). Email pages are RSC by default.
- **State management**: a small React Context in `lib/store.tsx` carries the
  payment draft (amount, method, demo scenario, confirmation id) across the
  multi-step flow — no external store required at prototype scale.
- **Mock APIs** in `lib/mock-api.ts` simulate realistic latency (900–1900ms)
  and deterministic outcomes.
- **Tokens** in `tailwind.config.ts` + `globals.css` map exactly to the
  Affirm design-system spec (colors, radii, spacing, type scale). The four
  slop-test fingerprints — deep indigo `#000049`, flat layered neutrals,
  pill buttons, Calibre/Axiforma — are all present.
- **Suspense boundaries** wrap any client component that reads
  `useSearchParams` (per Next.js 14 build requirements).
- **Framer Motion** powers subtle staggered reveals on hero screens and the
  bottom-sheet method picker.

---

## Mocked data structure

Defined in `src/lib/mock-data.ts`. Chosen to match the concept image
(Taylor, $125 due May 12, Nike Air Force 1 plan, restored PP of $1,250).

- `currentUser` — Taylor Morgan.
- `activePlan` — Nike · Air Force 1 '07, 3 of 4 payments made, $30 next.
- `paymentMethods` — Chase (default), Visa debit, Mastercard debit.
- `upcomingPayments` / `historyPayments` — the two Payments tabs.
- `defaultPPState` — approved $2,500, available $1,250 (previously $1,120).
- `PPScenario` — the five states the PP destination must handle.
- `ppScenarioCopy` — headline/body per scenario, all compliance-safe.

The Affirm API layer is intentionally stubbed. Wiring live data would slot
into `mock-api.ts` behind the same function signatures.

---

## Interaction notes

- **Confirmation hierarchy is fixed** per the PRD:
  1. Payment received (with green check + timestamp)
  2. Payment / plan info block
  3. PP value proposition ("Your payment helps restore purchasing power…")
  4. Primary CTA `Check my purchasing power`
  5. Long-term reinforcement copy (placed *after* the CTA so it never
     competes with the primary confirmation)
- **PP is not claimed as "increased"** — the copy consistently says
  "restored" or "available", to distinguish replenishment from a limit
  increase.
- **Manual receipt email never renders a PP amount.** It links out via
  CTA so the user retrieves the freshest value on click.
- **Autopay receipt email includes a `sent 4h after payment` marker** in
  the stakeholder-only header, communicating the delay decision.
- **Payment failure hides the PP benefit entirely** — the recovery is the
  only surfaced next step.
- **Extended-processing banner** (`?stuck=1`) demonstrates the fallback
  when payment status isn't confirmed quickly.
- **Method sheet** slides up as a bottom sheet with a spring transition,
  matching iOS conventions.

---

## Assumptions and known limitations

Only kept assumptions that were necessary for continuity — no product
redesign, no invented flows.

- **PP CTA destination** — the PRD flags this as a gap. Assumed the CTA
  routes in-app to a dedicated PP destination that re-fetches on arrival
  and shows a loading state. All alt states (unavailable, no headroom,
  error, decision refreshing) are first-class.
- **Restored vs increased** — always framed as "availability restored",
  never "your PP increased". A dedicated info block on the PP destination
  spells out the distinction between available spend and approved limit.
- **Autopay fallback after 4h** — the PRD leaves the fallback undefined.
  This prototype does not attempt to solve it; it's called out as a
  product decision that requires engineering input.
- **Analytics events** — surfaces are structured so tagging maps 1:1 to
  the PRD (`confirmation viewed`, `PP CTA viewed`, `PP CTA clicked`,
  `payment completion state`) but no events are actually fired here.
- **Fonts** — the design system's declared stack falls back to SF Pro on
  Apple devices and system UI elsewhere. Axiforma for Affirm and Calibre
  are not licensed for public use, so the fallback chain is intentional.

---

## What this prototype is (and isn't)

**Is:** a believable product shell that preserves the original product
thinking; a click-through demo tool; a starting point for engineering
kickoff; a reference for content, hierarchy, and state coverage.

**Isn't:** a production build, a design system export, a live backend
integration, or an attribution engine for PP changes.
