"use client"

// ---------------------------------------------------------------------------
// A believable iPhone 15 Pro-esque frame used to present every app screen
// on the storyboard and demo canvas.
// ---------------------------------------------------------------------------

import { ReactNode } from "react"
import { cn } from "@/lib/format"

type Props = {
  children: ReactNode
  label?: string
  step?: string
  className?: string
  tone?: "light" | "dark"
  showStatus?: boolean
}

export const PhoneStatusBar = ({ time = "9:41" }: { time?: string }) => {
  // Status bar always uses `text-ink`, which routes through the CSS var
  // that swaps with the active theme (dark ink on light screen, light
  // ink on dark screen). No explicit `tone` prop needed anymore — the
  // theme is the single source of truth.
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-0 h-[44px] px-6 flex items-center justify-between select-none z-30 pointer-events-none",
        "text-ink"
      )}
      aria-hidden="true"
    >
      <span className="text-[15px] font-semibold tracking-tight">{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Cellular */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="8" width="3" height="3" rx="0.5" fill="currentColor" />
          <rect x="4.5" y="6" width="3" height="5" rx="0.5" fill="currentColor" />
          <rect x="9" y="3" width="3" height="8" rx="0.5" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="currentColor" />
        </svg>
        {/* Wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 10.5c.66 0 1.2-.54 1.2-1.2s-.54-1.2-1.2-1.2-1.2.54-1.2 1.2.54 1.2 1.2 1.2Z" fill="currentColor" />
          <path
            d="M11 7c-.9-.9-2.15-1.5-3.5-1.5S4.9 6.1 4 7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M13.5 4.5C11.9 2.9 9.85 2 7.5 2S3.1 2.9 1.5 4.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        {/* Battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" />
          <rect x="23.5" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  )
}

const HomeIndicator = () => (
  <div
    className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none z-30"
    aria-hidden="true"
  >
    {/* `bg-ink/80` themes automatically via the `--ink` var override. */}
    <div className="w-[134px] h-[5px] rounded-full bg-ink/80" />
  </div>
)

const DynamicIsland = () => (
  <div
    className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] rounded-full bg-black z-40 pointer-events-none"
    aria-hidden="true"
  />
)

const DeviceFrame = ({ children, label, step, className, tone = "light", showStatus = true }: Props) => {
  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      {(label || step) && (
        <div className="pl-4 flex items-baseline gap-3">
          {step && <span className="marker-chip">{step}</span>}
          {label && <span className="text-h-sm text-ink font-display">{label}</span>}
        </div>
      )}
      <div
        className="relative rounded-[54px] p-[10px] bg-[#0a0a0d]"
        style={{ width: 390, height: 800 }}
      >
        {/* inner bezel */}
        <div className="absolute inset-[6px] rounded-[48px] bg-[#1c1c22]" />
        <div
          className={cn(
            "relative w-full h-full overflow-hidden rounded-[46px] phone-scroll",
            tone === "dark" ? "bg-ink" : "bg-surface-page"
          )}
        >
          <DynamicIsland />
          {showStatus && <PhoneStatusBar />}
          {/* The inner box is NOT the scroll container. AppShell owns its own
              scrollable region so the bottom tab bar can stay pinned. */}
          <div className="w-full h-full">{children}</div>
          <HomeIndicator />
        </div>
      </div>
    </div>
  )
}

export default DeviceFrame
