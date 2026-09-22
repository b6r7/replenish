"use client"

// ---------------------------------------------------------------------------
// A tiny client-side store used to preserve state between screens in the
// manual-payment flow. Context is more than enough at prototype scale.
// ---------------------------------------------------------------------------

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { activePlan, paymentMethods, PPScenario } from "./mock-data"

// Optional per-plan context. Set when the user launches the payment flow
// from a specific plan row (e.g. tapping "Pay $299.99" on Apple). When
// present, downstream screens (review, confirmation, failed) render this
// merchant/installment info instead of the default `activePlan`.
export type SelectedPlan = {
  id: string
  merchant: string
  logo?: "apple" | "amazon" | "bonobos" | "bestbuy" | "nike"
  productLabel?: string
  installmentIndex?: number
  installmentsTotal?: number
  installmentAmount?: number
  remainingBalance?: number
  dueDateISO?: string
}

type PaymentDraft = {
  amount: number
  methodId: string
  planId: string
  scenario: "success" | "failure"
  confirmationId: string | null
  receivedAtISO: string | null
}

type PrototypeState = {
  draft: PaymentDraft
  ppScenario: PPScenario
  selectedPlan: SelectedPlan | null
}

type PrototypeActions = {
  setAmount: (amount: number) => void
  setMethodId: (methodId: string) => void
  setScenario: (scenario: "success" | "failure") => void
  setPPScenario: (scenario: PPScenario) => void
  setSelectedPlan: (plan: SelectedPlan | null) => void
  markConfirmation: (confirmationId: string, receivedAtISO: string) => void
  resetDraft: () => void
}

const defaultDraft = (): PaymentDraft => ({
  amount: activePlan.installmentAmount,
  methodId: paymentMethods.find((pm) => pm.isDefault)?.id ?? paymentMethods[0].id,
  planId: activePlan.id,
  scenario: "success",
  confirmationId: null,
  receivedAtISO: null
})

const PrototypeContext = createContext<(PrototypeState & PrototypeActions) | null>(null)

export const PrototypeProvider = ({ children }: { children: React.ReactNode }) => {
  const [draft, setDraft] = useState<PaymentDraft>(() => defaultDraft())
  const [ppScenario, setPPScenarioState] = useState<PPScenario>("available_after_repayment")
  const [selectedPlan, setSelectedPlanState] = useState<SelectedPlan | null>(null)

  const setAmount = useCallback((amount: number) => setDraft((d) => ({ ...d, amount })), [])
  const setMethodId = useCallback((methodId: string) => setDraft((d) => ({ ...d, methodId })), [])
  const setScenario = useCallback(
    (scenario: "success" | "failure") => setDraft((d) => ({ ...d, scenario })),
    []
  )
  const setPPScenario = useCallback((scenario: PPScenario) => setPPScenarioState(scenario), [])
  const setSelectedPlan = useCallback((plan: SelectedPlan | null) => {
    setSelectedPlanState(plan)
    if (plan) setDraft((d) => ({ ...d, planId: plan.id }))
  }, [])
  const markConfirmation = useCallback(
    (confirmationId: string, receivedAtISO: string) =>
      setDraft((d) => ({ ...d, confirmationId, receivedAtISO })),
    []
  )
  const resetDraft = useCallback(() => {
    setDraft(defaultDraft())
    setSelectedPlanState(null)
  }, [])

  const value = useMemo(
    () => ({
      draft,
      ppScenario,
      selectedPlan,
      setAmount,
      setMethodId,
      setScenario,
      setPPScenario,
      setSelectedPlan,
      markConfirmation,
      resetDraft
    }),
    [
      draft,
      ppScenario,
      selectedPlan,
      setAmount,
      setMethodId,
      setScenario,
      setPPScenario,
      setSelectedPlan,
      markConfirmation,
      resetDraft
    ]
  )

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>
}

export const usePrototype = () => {
  const ctx = useContext(PrototypeContext)
  if (!ctx) throw new Error("usePrototype must be used inside PrototypeProvider")
  return ctx
}
