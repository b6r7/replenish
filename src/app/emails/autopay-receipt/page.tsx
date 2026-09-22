import EmailFrame from "@/components/EmailFrame"
import { activePlan, currentUser, defaultPPState, paymentMethods } from "@/lib/mock-data"
import { formatCurrency, formatShortDate } from "@/lib/format"

// ---------------------------------------------------------------------------
// Journey B — Autopay receipt email.
// PRD rule: the send is DELAYED 4h so the PP value shown here is accurate.
// A user-visible timing note isn't shown to end users; we render it as a
// stakeholder-only marker at the top of the frame.
// ---------------------------------------------------------------------------

const method = paymentMethods.find((pm) => pm.isDefault) ?? paymentMethods[0]

const Page = () => {
  const paidAt = new Date()
  const sentAt = new Date(paidAt.getTime() + 4 * 60 * 60 * 1000)
  const restored = defaultPPState.currentAvailable - defaultPPState.previousAvailable

  return (
    <EmailFrame
      scenarioNote="Journey B · Autopay · delayed 4h so PP is accurate"
      subject={`Your Autopay payment of ${formatCurrency(activePlan.installmentAmount)} was received`}
      from="Affirm"
      fromEmail="notifications@affirm.com"
      to={currentUser.email}
      time={`${formatShortDate(sentAt.toISOString())}, 1:41 PM · sent 4h after payment`}
    >
      <h2 className="font-display text-h-md text-ink">Payment received</h2>
      <p className="mt-2 text-b-md text-ink-secondary">
        Hi {currentUser.firstName}, your scheduled Autopay payment went through.
      </p>

      <div className="mt-6 rounded-input bg-surface-inset p-5">
        <dl className="space-y-3">
          <div className="flex items-baseline justify-between">
            <dt className="text-b-sm text-ink-secondary">Amount</dt>
            <dd className="font-display text-h-sm text-ink">{formatCurrency(activePlan.installmentAmount)}</dd>
          </div>
          <div className="hairline" />
          <div className="flex items-baseline justify-between">
            <dt className="text-b-sm text-ink-secondary">Paid with</dt>
            <dd className="text-b-md font-medium text-ink text-right">
              {method.brand === "Bank" ? "Chase checking" : method.label} ... {method.last4}
            </dd>
          </div>
          <div className="hairline" />
          <div className="flex items-baseline justify-between">
            <dt className="text-b-sm text-ink-secondary">Plan</dt>
            <dd className="text-b-md font-medium text-ink text-right">
              {activePlan.merchant} · {activePlan.productLabel}
            </dd>
          </div>
          <div className="hairline" />
          <div className="flex items-baseline justify-between">
            <dt className="text-b-sm text-ink-secondary">Received at</dt>
            <dd className="text-b-md font-medium text-ink">
              {formatShortDate(paidAt.toISOString())} · 9:41 AM
            </dd>
          </div>
        </dl>
      </div>

      {/* PP is safe to render directly because of the 4h delay */}
      <div className="mt-6 rounded-input bg-surface-card border border-border-subtle p-5">
        <p className="text-b-xs text-ink-tertiary uppercase tracking-wider">Purchasing power</p>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="font-display text-h-lg text-ink">
            {formatCurrency(defaultPPState.currentAvailable, true)}
          </p>
          <span className="text-b-sm text-ink-tertiary">available</span>
        </div>
        {restored > 0 && (
          <p className="mt-1 text-b-sm text-signal-success font-medium">
            +{formatCurrency(restored, true)} restored from this payment
          </p>
        )}
        <p className="mt-3 text-b-sm text-ink-secondary">
          Your approved limit hasn't changed. Consistent, on-time payments can
          increase your purchasing power over time.
        </p>
        <a
          href="/app/purchasing-power"
          className="inline-flex mt-4 px-6 py-3 rounded-pill-md bg-brand text-brand-on font-medium hover:bg-brand-hover transition-colors no-underline"
        >
          Shop with purchasing power
        </a>
      </div>

      <p className="mt-6 text-b-sm text-ink-secondary">
        Questions? Visit the{" "}
        <a href="#" className="text-brand-link font-medium underline">
          Affirm help center
        </a>
        .
      </p>
    </EmailFrame>
  )
}

export default Page
