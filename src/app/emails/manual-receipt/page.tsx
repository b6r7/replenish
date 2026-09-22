import EmailFrame from "@/components/EmailFrame"
import { activePlan, currentUser, paymentMethods } from "@/lib/mock-data"
import { formatCurrency, formatShortDate } from "@/lib/format"

// ---------------------------------------------------------------------------
// Journey C — manual payment receipt email.
// PRD rule: sent IMMEDIATELY, does NOT show a PP amount, links out to PP
// via CTA. Intentionally sacrifices PP immediacy for payment accuracy.
// ---------------------------------------------------------------------------

const method = paymentMethods.find((pm) => pm.isDefault) ?? paymentMethods[0]

const Page = () => (
  <EmailFrame
    scenarioNote="Journey C · Manual payment · sent immediately"
    subject={`We received your ${formatCurrency(activePlan.installmentAmount)} payment`}
    from="Affirm"
    fromEmail="notifications@affirm.com"
    to={currentUser.email}
    time={`${formatShortDate(new Date().toISOString())}, 9:41 AM`}
  >
    <h2 className="font-display text-h-md text-ink">Payment received</h2>
    <p className="mt-2 text-b-md text-ink-secondary">
      Hi {currentUser.firstName}, thanks for your payment.
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
          <dt className="text-b-sm text-ink-secondary">Payments remaining</dt>
          <dd className="text-b-md font-medium text-ink">
            {Math.max(activePlan.installmentsTotal - activePlan.installmentsPaid - 1, 0)} of {activePlan.installmentsTotal}
          </dd>
        </div>
      </dl>
    </div>

    {/* PP CTA — no amount rendered. Sends the user to the app to fetch
        the freshest value rather than trusting an email snapshot. */}
    <div className="mt-6 rounded-input bg-surface-card border border-border-subtle p-5">
      <p className="text-b-md font-medium text-ink">See what's available now</p>
      <p className="mt-1 text-b-sm text-ink-secondary">
        Your payment helps restore purchasing power as it becomes available.
      </p>
      <a
        href="/app/purchasing-power"
        className="inline-flex mt-4 px-6 py-3 rounded-pill-md bg-brand text-brand-on font-medium hover:bg-brand-hover transition-colors no-underline"
      >
        Check my purchasing power
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

export default Page
