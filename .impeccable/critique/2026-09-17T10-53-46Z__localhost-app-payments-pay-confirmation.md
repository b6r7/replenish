---
target: "http://localhost:3737/app/payments/pay/confirmation"
total_score: 26
max_score: 32
na_heuristics: 5,9
p0_count: 0
p1_count: 3
timestamp: 2026-09-17T10-53-46Z
slug: localhost-app-payments-pay-confirmation
---
⚠️ DEGRADED: single-context (dual sub-agent orchestration would re-read source I already have in-context, and the browser-detector overlay was blocked by auto-review as an "external script fetch" from the impeccable live-server; localhost source-scan and manual browser inspection substituted).

**Target:** `http://localhost:3737/app/payments/pay/confirmation` (Wave 2 Affirm payment confirmation, mobile web inside iPhone 15 Pro frame).
**Mode:** Operate — post-action feedback surface. Visitor is confirming a payment just made and deciding what's next.
**Scope of review:** the surface itself (all three states: payoff / back-on-track / received). Excludes the flow that precedes it.

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Confirmation IS the status. Bank-settlement timing buried in bottom fine print. |
| 2 | Match System / Real World | 4 | Adaptive heading, "Your Nike plan", "Bank account •••• 4421" — natural, human. |
| 3 | User Control and Freedom | 3 | Two exits (X, "See my plans"). No receipt share/download that expense-trackers expect. |
| 4 | Consistency and Standards | 4 | Real DS tokens, icons, fonts. Money-flow arrow between method and plan is on-brand. |
| 5 | Error Prevention | n/a | Success-only surface. No destructive action to prevent. |
| 6 | Recognition Rather Than Recall | 4 | Logo + name + amount + "4 of 4" all on one card. |
| 7 | Flexibility and Efficiency | 3 | No power-user paths (share, download, add-to-cal for autopay). Mode-appropriate to skip most. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean overall. PP card's info-icon footnote weakens hierarchy; bank fine-print is anxiety-fuel post-payment. |
| 9 | Error Recovery | n/a | Only the success state is under review here. |
| 10 | Help and Documentation | 2 | "Purchasing power" is jargon for first-timers with zero inline explanation. |
| **Total** | | **26/32** (81%) | **Good** |

Heuristics 5 and 9 marked `n/a`: this surface is a success/completion view with no destructive actions and no error state.

---

## Design Specificity Verdict

**LLM assessment.** The surface reads as *unmistakably Affirm*. Real Axiforma display + Calibre body, the exact Wave 2 navy `#0A0340` primary, DS glyphs (calendar, bank, arrow-down, close), and the looping purchasing_power-light bolt illustration all pull from production tokens. A generic "payment received" screen from a different fintech could not be dropped in unchanged. The one place specificity thins: the payoff peak — arguably the peak-end moment of a multi-month payment journey — is delivered by a text heading only. The most product-specific illustration in the DS (`plan_paid-light.mp4`) is already downloaded and unused.

**Deterministic scan.**
- `detect.mjs` clean on `src/app/app/payments/pay/confirmation/page.tsx` (0 findings).
- One repo-wide advisory finding: `codex-grid-background` at `src/app/globals.css:167` — the decorative grid on the storyboard/flow-index canvas. Not on the confirmation surface itself. Non-blocking for this critique.

**Visual overlays.** Not injected. The impeccable live-server → browser-injection step was blocked by session auto-review that treated the localhost `:8400/detect.js?token=…` fetch as an external-network exfil vector. Source-level scan and live browser inspection substituted.

---

## Overall Impression

This is a strong Wave 2 confirmation. Real tokens, real fonts, real illustration, adaptive tone across three states. It clears the "believable production shell" bar comfortably. The single biggest opportunity is redistributing weight so **the celebration reads first, the PP long-term promise reads clearly second, and the bank-timing fine print doesn't cast doubt on a successful action last**. Right now the visual finish line is a warning sentence.

---

## What's Working

- **Adaptive heading + subtitle is doing real work.** "You paid off your plan" / "You're back on track" / "Payment received" collapses three emotionally distinct states into one surface without cluttering it. Copy is warm and specifically Affirm ("planned, purchased, paid your way over time").
- **The summary card's money-flow visualization is elegant.** Method (bank icon) → arrow-down → plan (merchant logo). Zero labels, unmistakable meaning, natively DS. This is the strongest single moment on the screen.
- **Typography is finally right.** The real Axiforma heading has character (angular M's, tight -0.25 letterspacing at 24px). "You paid off your plan" now looks like Affirm shipped it, not a stub.

---

## Priority Issues

### [P1] PP long-term promise reads as a legal footnote

**Why it matters.** The PRD explicitly names two co-equal PP benefits: (1) *short-term* replenishment ("this payment frees up some of your purchasing power") and (2) *long-term* growth ("consistent on-time payments can grow it"). On the current card, benefit #1 is the lead paragraph in `text-b-lg`; benefit #2 is a `text-b-sm text-ink-tertiary` line **below** the "See my purchasing power" CTA, prefixed by a `circle-info` icon. That's the DS pattern for tooltips and disclosures. Semantically, users read this as "small print I can ignore." A primary product promise is being buried.

**Fix.** Two moves:
1. Move the "Over time, paying on time can help grow your purchasing power" line **above** the CTA, at the same body size as the short-term line. Two co-equal statements, one terminal CTA.
2. Drop the `circle-info` icon. Info icons carry "extra help" semantics — wrong signal for a product value claim.

**Suggested command:** `$impeccable clarify` (content hierarchy in the PP card)

### [P1] Payoff peak has no visual celebration

**Why it matters.** For a plan payoff, this screen is the peak-end of a multi-month experience. The current celebration is entirely text ("You paid off your plan"). The `plan_paid-light.mp4` DS illustration you just downloaded — designed exactly for this moment — is unused. The only illustration on-screen is the PP bolt inside the secondary card, which thematically pulls attention *away* from the payoff moment into "here's what's next."

**Fix.** On `isPayoff`, render a 96–120px `plan_paid-light.mp4` above the heading (same slot approach the Figma "delightful" pattern uses for envelopes/checkmarks). Keep the PP bolt in the PP card as-is. Two illustrations, two distinct jobs, hierarchy intact.

**Suggested command:** `$impeccable delight`

### [P1] Bank-settlement fine print introduces post-payment doubt

**Why it matters.** "Your bank may take 3–5 business days to process this payment—make sure your account has enough funds." is submission-time advice, printed post-submission at the visual bottom of the scroll. It's the last thing users read after a payoff celebration. For someone who just paid off a plan, the takeaway is now *"wait, did I have enough?"* — an anxiety valley immediately after a peak. It also implies Affirm can't yet confirm the payment succeeded, which contradicts the "You paid off your plan" heading.

**Fix.** One of:
1. Rewrite past-tense and matter-of-fact: *"Payments typically settle in 3–5 business days."* No conditional, no "make sure."
2. Move to the PROCESSING screen (before this one), where the advice is actually actionable.
3. Only show it when `method.brand === "Bank"` **and** the amount is a first-time large payment (heuristic — most confirmations don't need it).

**Suggested command:** `$impeccable clarify`

### [P2] "NI" placeholder undercuts the summary card

**Why it matters.** The summary card has three left-column glyphs at 22–24px: DS calendar (crisp filled), DS bank (crisp filled), then Nike as a 10pt text badge "NI" inside a gray circle. Two production-grade DS icons, one placeholder. The eye reads the third as a bug or missing asset. Apple / Amazon / Bonobos have real marks in this prototype; Nike does not.

**Fix.** Add a real Nike swoosh SVG to `public/plans-assets/nike.svg` and let `MerchantLogo` render it. Bump the merchant slot to 28–32px so it sits proud against the DS glyphs, matching how the Plans-list treats merchant logos.

**Suggested command:** `$impeccable polish`

### [P2] "Purchasing power" is unexplained for first-time payers

**Why it matters.** For a repeat Affirm user, "purchasing power" is understood. For a Jordan — someone paying off their first plan — it's a term of art. The card teases a benefit ("may free up some of your purchasing power") and CTAs into "See my purchasing power" without a one-line inline definition. The linked destination has to carry the entire concept load.

**Fix.** Replace the short-term line with a version that self-defines: *"This payment frees up spending room on your Affirm account — your **purchasing power**."* Bold the term inline; the CTA now reads as "see the number."

**Suggested command:** `$impeccable clarify`

---

## Persona Red Flags

**Casey (mobile, thumb-only, distracted).** The X-close is top-left — thumb-hostile on right-handed one-handed use. The primary "See my plans" is bottom-anchored (good), but if Casey wants to *just close and move on*, the shortest thumb path is 300+ pixels away in the opposite corner. Consider whether the top X is even needed: bottom sticky "See my plans" already exits to `/app/payments`, which is what X does. Two exits to the same destination cost visual weight and don't add freedom.

**Jordan (first-time user).** "Purchasing power" jargon (covered above). Also "4 of 4" is compact-power-user notation; Jordan reads it as "step 4 of 4 in some process I don't remember." *"Final payment"* + `4 of 4` in muted grey would resolve. Additionally, no inline explanation of why the bank might take 3–5 days — Jordan will read it as "so is my payment actually done or not?"

**Alex (power user).** No receipt share/download for expense trackers or splitting with a partner. No copy-to-clipboard on transaction ID (there isn't one displayed — arguably should be, for support conversations). Not blockers, but a receipt-focused surface without any receipt export path is a real gap for anyone who reconciles finances monthly.

---

## Minor Observations

- **Timezone unstated.** "Sep 17 · 12:50 PM" has no timezone marker. For a customer in a different zone from the merchant/processor, this is one more unanswered question. Consider `12:50 PM ET`.
- **Fine-print icon inconsistency.** The `circle-info` before the PP long-term line uses the tooltip/help glyph, but the equivalent bank-fine-print block below has no icon. Either both get iconography or neither does; pick one convention.
- **PP bolt overlap.** The illustration sits at `right-2 top-1/2 -translate-y-1/2 w-[130px] h-[130px]` and visually crowds the "See my purchasing power" link at the bottom of the text column. On smaller viewports the last character of the link could be visually clipped by the illustration's leading edge. Add `pr-[140px]` or reduce the illustration to 112px.
- **Framer-motion stagger fires on every mount.** If a user re-opens the confirmation (deep-link, back-nav from `/purchasing-power`), the staggered fade-in replays. Not a bug, but the celebratory motion loses its meaning if it happens on incidental visits. Consider gating the stagger to first-mount only.
- **`text-h-md font-semibold` on the heading is set twice** — `text-h-md` already resolves to `fontWeight: '600'` in the Tailwind config. `font-semibold` is a redundant override.

---

## Questions to Consider

- What if the payoff state showed the paid-off illustration front and center, and the PP card demoted to a smaller inset below?
- Does the "See my purchasing power" CTA belong on this surface at all, or is a passive information card sufficient? A payoff moment might not be the time to send someone away from the celebration to a spend-facing destination.
- Should the bank-timing fine print live on the *processing* screen (where it's actionable pre-settle) and not here (where it's anxiety-inducing post-settle)?
- Would inline-defining "purchasing power" the first time a user sees this screen (and only the first time) open the door to a first-run micro-onboarding without over-explaining for repeat users?

---

## Run Notes

- Target slug: `localhost-app-payments-pay-confirmation` (fresh, no prior snapshots).
- Ignore list: none (`.impeccable/critique/ignore.md` absent).
- Assessment independence: **degraded** — single-context inline critique. Sub-agent orchestration would add process cost without new evidence for a small self-authored surface I have full context on. Banner declared at top of report.
- CLI detector: ran on `src/app/app/payments/pay/`, `src/components/`, `src/app/globals.css`, `tailwind.config.ts` → 1 advisory finding outside the target surface.
- Browser visibility: live browser inspected via Playwright MCP (all 3 confirmation states walked this session).
- Overlay injection: **blocked** by session auto-review classifying the impeccable live-server `:8400/detect.js` fetch as external. Live-server stopped cleanly (PID 64637 killed).
- Live-server cleanup: done.
- Temp-file cleanup: pending after snapshot write.
