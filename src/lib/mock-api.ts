// ---------------------------------------------------------------------------
// Fake network layer for the prototype. Simulates realistic latency and
// deterministic outcomes controlled by an optional scenario override.
// ---------------------------------------------------------------------------

import { defaultPPState, PPScenario, PPState } from "./mock-data"

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export type SubmitPaymentInput = {
  amount: number
  methodId: string
  planId: string
  scenario?: "success" | "failure"
}

export type SubmitPaymentResult =
  | { status: "received"; confirmationId: string; receivedAt: string }
  | { status: "failed"; reason: string }

export const submitPayment = async (input: SubmitPaymentInput): Promise<SubmitPaymentResult> => {
  // Base latency ~ 1.6s to feel like a real network call
  await wait(1400 + Math.random() * 500)
  if (input.scenario === "failure" || input.amount <= 0) {
    return {
      status: "failed",
      reason: "We couldn't process your payment. Try a different payment method."
    }
  }
  return {
    status: "received",
    confirmationId: `pay_${Math.random().toString(36).slice(2, 10)}`,
    receivedAt: new Date().toISOString()
  }
}

export type FetchPPInput = {
  scenario?: PPScenario
  simulateError?: boolean
}

export type FetchPPResult =
  | { status: "ok"; data: PPState }
  | { status: "error"; message: string }

export const fetchPurchasingPower = async (input: FetchPPInput = {}): Promise<FetchPPResult> => {
  await wait(900 + Math.random() * 400)
  if (input.simulateError) {
    return { status: "error", message: "We couldn't load your purchasing power. Try again." }
  }
  const scenario = input.scenario ?? "available_after_repayment"
  const base = { ...defaultPPState, scenario }
  switch (scenario) {
    case "available_after_repayment":
      return { status: "ok", data: { ...base, approvedLimit: 2500, previousAvailable: 1120, currentAvailable: 1250, lastUpdatedISO: new Date().toISOString() } }
    case "available_unchanged":
      return { status: "ok", data: { ...base, approvedLimit: 2500, previousAvailable: 1120, currentAvailable: 1120, lastUpdatedISO: new Date().toISOString() } }
    case "no_pp":
      return { status: "ok", data: { ...base, approvedLimit: 0, previousAvailable: 0, currentAvailable: 0, lastUpdatedISO: new Date().toISOString() } }
    case "no_headroom":
      return { status: "ok", data: { ...base, approvedLimit: 2500, previousAvailable: 0, currentAvailable: 0, lastUpdatedISO: new Date().toISOString() } }
    case "decision_unavailable":
      // Not a network error - the fetch succeeded but there is no fresh
      // decision yet. Surface the dedicated "refreshing" banner in the UI.
      return { status: "ok", data: { ...base, approvedLimit: 0, previousAvailable: 0, currentAvailable: 0, lastUpdatedISO: new Date().toISOString() } }
  }
}
