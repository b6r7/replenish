import Link from "next/link"
import { IconChevronLeft } from "@/components/icons/Icon"

// ---------------------------------------------------------------------------
// The storyboard is a stakeholder-friendly single canvas that renders every
// interactive screen inside iframes so viewers can scan the whole flow the
// way they see it in the visual concept image.
//
// Scoped (for the current demo pass) to the single canonical scenario:
//   Redesigned Plans → Make a payment → Processing → Confirmation
//   → PP intro → PP enter income → PP result
//
// Note: the standalone /app/payments/pay/review screen still exists in
// the app but isn't part of this scenario — tapping Pay $X on the
// Make-a-payment screen jumps straight to Processing.
//
// The alt-state, email, and shell surfaces still exist in the app and are
// reachable by direct URL — they're just off the storyboard while the team
// aligns on the Plans-redesign journey.
// ---------------------------------------------------------------------------

type Frame = {
  step: string
  title: string
  description: string
  src: string
}

const journey: Frame[] = [
  {
    step: "01",
    title: "Plans",
    description: "Redesigned Plans tab. Total balance, per-plan cards, contextual Pay CTAs.",
    src: "/app/payments"
  },
  {
    step: "02",
    title: "Make a payment",
    description: "Amount + method for the selected plan.",
    src: "/app/payments/pay"
  },
  {
    step: "03",
    title: "Processing",
    description: "Payment in flight.",
    src: "/app/payments/pay/processing"
  },
  {
    step: "04",
    title: "Confirmation",
    description: "Payment received · PP replenishment note · CTA to check PP.",
    src: "/app/payments/pay/confirmation"
  },
  {
    step: "05",
    title: "PP intro",
    description: "Check my purchasing power intro.",
    src: "/app/purchasing-power/intro"
  },
  {
    step: "06",
    title: "Enter income",
    description: "Annual income input.",
    src: "/app/purchasing-power/income"
  },
  {
    step: "07",
    title: "PP result",
    description: "Estimated purchasing power reveal.",
    src: "/app/purchasing-power/result"
  }
]

const PhoneIframe = ({ src }: { src: string }) => (
  <div
    className="relative rounded-[54px] p-[10px] bg-[#0a0a0d] shrink-0"
    style={{ width: 390, height: 800 }}
  >
    <div className="absolute inset-[6px] rounded-[48px] bg-[#1c1c22]" />
    <div className="relative w-full h-full overflow-hidden rounded-[46px] bg-surface-page">
      <div
        className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] rounded-full bg-black z-40"
        aria-hidden="true"
      />
      <iframe src={src} title={src} className="w-full h-full border-0" />
      <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none z-30">
        <div className="w-[134px] h-[5px] rounded-full bg-ink/80" />
      </div>
    </div>
  </div>
)

const FrameRow = ({ frames }: { frames: Frame[] }) => (
  <div className="overflow-x-auto -mx-6 px-6 pb-6">
    <div className="flex gap-8 items-start min-w-max">
      {frames.map((f) => (
        <div key={f.src} className="flex flex-col gap-3">
          <div className="pl-4">
            <span className="marker-chip">{f.step}</span>
            <p className="font-display text-h-sm text-ink mt-1">{f.title}</p>
            <p className="text-b-sm text-ink-secondary mt-1 max-w-[260px]">{f.description}</p>
          </div>
          <PhoneIframe src={f.src} />
        </div>
      ))}
    </div>
  </div>
)

const Page = () => (
  <div className="min-h-screen">
    <header className="max-w-[1200px] mx-auto px-6 pt-10 pb-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-b-sm text-ink-secondary hover:text-ink transition-colors mb-6"
      >
        <IconChevronLeft size={16} />
        Back to flow index
      </Link>
      <p className="marker-chip">Affirm · Plans redesign · Storyboard</p>
      <h1 className="mt-3 font-display text-h-xl text-ink">A clearer path to what&apos;s next.</h1>
      <p className="mt-3 text-b-md text-ink-secondary max-w-2xl">
        The full Plans-redesign scenario in one canvas. Scroll horizontally to
        move through the flow. Click into any frame to interact with it directly.
      </p>
    </header>

    <div className="hairline max-w-[1200px] mx-auto" />

    <section className="max-w-[1200px] mx-auto pt-10 px-6 pb-16">
      <div className="mb-6">
        <p className="marker-chip">Journey · Plans redesign</p>
        <h2 className="font-display text-h-lg text-ink mt-2">From Plans to purchasing power</h2>
      </div>
      <FrameRow frames={journey} />
    </section>
  </div>
)

export default Page
