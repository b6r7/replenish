// ---------------------------------------------------------------------------
// Mock data used across the prototype. Values are intentionally chosen to
// match the visual concept image (Taylor, $125, next payment May 12).
// ---------------------------------------------------------------------------

export type User = {
  firstName: string
  lastName: string
  email: string
}

export type PaymentMethod = {
  id: string
  brand: "Visa" | "Mastercard" | "Bank"
  label: string
  last4: string
  isDefault: boolean
}

export type UpcomingPayment = {
  id: string
  amount: number
  dueDateISO: string
  planLabel: string
  status: "upcoming" | "scheduled" | "processing"
  merchant?: string
}

export type HistoryPayment = {
  id: string
  amount: number
  dateISO: string
  method: "manual" | "autopay"
  planLabel: string
  merchant: string
}

export type PaymentPlan = {
  id: string
  merchant: string
  productLabel: string
  productImage?: string
  totalAmount: number
  installmentAmount: number
  installmentsPaid: number
  installmentsTotal: number
  nextDueISO: string
  method: "biweekly" | "monthly"
}

export type ShopCategory = {
  id: string
  label: string
  icon: "electronics" | "home" | "travel" | "fashion"
}

export type ShopStore = {
  id: string
  name: string
  category: string
  accentColor: string
}

// ---------------------------------------------------------------------------

export const currentUser: User = {
  firstName: "Taylor",
  lastName: "Morgan",
  email: "taylor.morgan@example.com"
}

export const paymentMethods: PaymentMethod[] = [
  { id: "pm_chase_4421", brand: "Bank", label: "Chase checking", last4: "4421", isDefault: true },
  { id: "pm_visa_0329", brand: "Visa", label: "Visa debit", last4: "0329", isDefault: false },
  { id: "pm_mc_7714", brand: "Mastercard", label: "Mastercard debit", last4: "7714", isDefault: false }
]

// The "hero" plan used for manual payment on the confirmation screen.
export const activePlan: PaymentPlan = {
  id: "plan_nike_af1",
  merchant: "Nike",
  productLabel: "Air Force 1 '07",
  totalAmount: 120,
  installmentAmount: 30,
  installmentsPaid: 3,
  installmentsTotal: 4,
  nextDueISO: "2025-05-12",
  method: "biweekly"
}

export const upcomingPayments: UpcomingPayment[] = [
  {
    id: "up_1",
    amount: 125,
    dueDateISO: "2025-05-12",
    planLabel: "Best Buy · Sony WH-1000XM5",
    status: "upcoming"
  },
  {
    id: "up_2",
    amount: 125,
    dueDateISO: "2025-05-26",
    planLabel: "Best Buy · Sony WH-1000XM5",
    status: "scheduled"
  },
  {
    id: "up_3",
    amount: 125,
    dueDateISO: "2025-06-09",
    planLabel: "Best Buy · Sony WH-1000XM5",
    status: "scheduled"
  },
  {
    id: "up_4",
    amount: 125,
    dueDateISO: "2025-06-23",
    planLabel: "Best Buy · Sony WH-1000XM5",
    status: "scheduled"
  }
]

// ---------------------------------------------------------------------------
// Plans-tab data. Matches the Figma "Plans - Wave 2 - Payments" screen 1:1.
// ---------------------------------------------------------------------------

export type PlanStatus = "overdue" | "processing" | "autopay" | "default"

export type PlanRow = {
  id: string
  merchant: string
  logo: "apple" | "amazon" | "bonobos" | "bestbuy" | "nike"
  status: PlanStatus
  amount: number
  // Sub-line contents. Rendered per status.
  overdueDays?: number
  dueDateISO?: string
  installmentIndex?: number
  installmentsTotal?: number
  // Optional total balance still owed on this plan. Used by the "Remaining
  // balance" option on the Make a payment screen. When absent, that option
  // is hidden or falls back to amount × remaining installments.
  remainingBalance?: number
}

export type PlansOverview = {
  totalBalance: number
  dueThisMonth: number
  dueMonthLabel: string
  takeAction: PlanRow[]
  upcoming: {
    monthLabel: string
    total: number
    rows: PlanRow[]
  }[]
}

export const plansOverview: PlansOverview = {
  totalBalance: 7040,
  dueThisMonth: 305.97,
  dueMonthLabel: "June",
  takeAction: [
    {
      id: "plan_apple",
      merchant: "Apple",
      logo: "apple",
      status: "overdue",
      amount: 299.99,
      overdueDays: 3,
      remainingBalance: 299.99
    }
  ],
  upcoming: [
    {
      monthLabel: "June",
      total: 305.97,
      rows: [
        {
          id: "plan_amazon",
          merchant: "Amazon",
          logo: "amazon",
          status: "processing",
          amount: 89.99,
          dueDateISO: "2025-06-01",
          remainingBalance: 355.08
        },
        {
          id: "plan_bonobos",
          merchant: "Bonobos",
          logo: "bonobos",
          status: "autopay",
          amount: 10.99,
          dueDateISO: "2025-06-03",
          installmentIndex: 3,
          installmentsTotal: 6,
          remainingBalance: 43.96
        },
        {
          id: "plan_bestbuy_june",
          merchant: "Best Buy",
          logo: "bestbuy",
          status: "default",
          amount: 49.99,
          dueDateISO: "2025-06-05",
          installmentIndex: 2,
          installmentsTotal: 12,
          remainingBalance: 549.89
        }
      ]
    },
    {
      monthLabel: "July",
      total: 249.98,
      rows: [
        {
          id: "plan_amazon_jul",
          merchant: "Amazon",
          logo: "amazon",
          status: "default",
          amount: 89.99,
          dueDateISO: "2025-07-01",
          installmentIndex: 2,
          installmentsTotal: 4,
          remainingBalance: 269.97
        },
        {
          id: "plan_bestbuy_jul",
          merchant: "Best Buy",
          logo: "bestbuy",
          status: "default",
          amount: 49.99,
          dueDateISO: "2025-07-05",
          installmentIndex: 3,
          installmentsTotal: 12,
          remainingBalance: 499.90
        },
        {
          id: "plan_bonobos_jul",
          merchant: "Bonobos",
          logo: "bonobos",
          status: "autopay",
          amount: 10.99,
          dueDateISO: "2025-07-03",
          installmentIndex: 4,
          installmentsTotal: 6,
          remainingBalance: 32.97
        }
      ]
    }
  ]
}

export const historyPayments: HistoryPayment[] = [
  {
    id: "h_1",
    amount: 125,
    dateISO: "2025-04-28",
    method: "autopay",
    planLabel: "Best Buy · Sony WH-1000XM5",
    merchant: "Best Buy"
  },
  {
    id: "h_2",
    amount: 30,
    dateISO: "2025-04-14",
    method: "manual",
    planLabel: "Nike · Air Force 1 '07",
    merchant: "Nike"
  },
  {
    id: "h_3",
    amount: 30,
    dateISO: "2025-03-31",
    method: "autopay",
    planLabel: "Nike · Air Force 1 '07",
    merchant: "Nike"
  },
  {
    id: "h_4",
    amount: 125,
    dateISO: "2025-03-17",
    method: "autopay",
    planLabel: "Best Buy · Sony WH-1000XM5",
    merchant: "Best Buy"
  }
]

export const shopCategories: ShopCategory[] = [
  { id: "c_electronics", label: "Electronics", icon: "electronics" },
  { id: "c_home", label: "Home", icon: "home" },
  { id: "c_travel", label: "Travel", icon: "travel" },
  { id: "c_fashion", label: "Fashion", icon: "fashion" }
]

export const popularStores: ShopStore[] = [
  { id: "s_amazon", name: "Amazon", category: "Everything", accentColor: "#232f3e" },
  { id: "s_bestbuy", name: "Best Buy", category: "Electronics", accentColor: "#0046be" },
  { id: "s_target", name: "Target", category: "Everyday", accentColor: "#cc0000" },
  { id: "s_nike", name: "Nike", category: "Sport", accentColor: "#111111" }
]

// ---------------------------------------------------------------------------
// Purchasing power - the entire prototype hinges on this.
// ---------------------------------------------------------------------------

export type PPScenario =
  | "available_after_repayment" // headroom exists, replenished by payment
  | "available_unchanged" // repayment did not increase availability
  | "no_pp" // user has no PP at all
  | "no_headroom" // user has PP but no headroom to replenish
  | "decision_unavailable" // updated PP decision not yet ready

export type PPState = {
  scenario: PPScenario
  approvedLimit: number
  currentAvailable: number
  previousAvailable: number
  lastUpdatedISO: string
}

export const defaultPPState: PPState = {
  scenario: "available_after_repayment",
  approvedLimit: 2500,
  currentAvailable: 1250,
  previousAvailable: 1120,
  lastUpdatedISO: new Date().toISOString()
}

export const ppScenarioCopy: Record<PPScenario, { headline: string; body: string }> = {
  available_after_repayment: {
    headline: "Purchasing power is available",
    body: "Your recent payment restored some of your available spend."
  },
  available_unchanged: {
    headline: "Purchasing power is available",
    body: "Your available spend didn't change with this payment."
  },
  no_pp: {
    headline: "Purchasing power isn't available right now",
    body: "There's no active decision on file. Try again later."
  },
  no_headroom: {
    headline: "You're using all of your approved spend",
    body: "Future payments can free up room to spend again."
  },
  decision_unavailable: {
    headline: "We're still updating your purchasing power",
    body: "This can take a few minutes after a payment is received."
  }
}
