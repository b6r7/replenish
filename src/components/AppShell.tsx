"use client"

// ---------------------------------------------------------------------------
// The AppShell wraps every "inside-the-app" screen. It provides:
//   - top header with title and a slot for right-side actions
//   - scrollable content area
//   - persistent bottom tab bar
// The parent DeviceFrame supplies the status bar + home indicator.
// ---------------------------------------------------------------------------

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/format"
import DsIcon, { DsIconName } from "./DsIcon"

type TabDef = {
  href: string
  label: string
  icon: DsIconName
  matcher: (path: string) => boolean
}

// Names sourced from @affirm/design-system/src/core/Icon/icons/*. Sticking
// with production glyph names keeps a1:1 visual parity with the app.
const tabs: TabDef[] = [
  { href: "/app/home", label: "Home", icon: "home", matcher: (p) => p === "/app/home" },
  { href: "/app/shop", label: "Deals", icon: "tag", matcher: (p) => p.startsWith("/app/shop") },
  { href: "/app/checkout", label: "Card", icon: "card", matcher: (p) => p.startsWith("/app/checkout") },
  {
    href: "/app/payments",
    label: "Plans",
    icon: "activity",
    matcher: (p) => p.startsWith("/app/payments") || p.startsWith("/app/purchasing-power")
  },
  { href: "/app/home?money=1", label: "Money", icon: "money", matcher: () => false }
]

export const TabBar = () => {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Primary"
      className="absolute inset-x-0 bottom-0 pb-[26px] pt-2 px-3 bg-surface-card border-t border-border-subtle z-20"
    >
      <ul className="flex items-end justify-between">
        {tabs.map((tab) => {
          const active = tab.matcher(pathname ?? "")
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-1 py-1 rounded-input transition-colors",
                  active ? "text-brand-link" : "text-ink-tertiary hover:text-ink"
                )}
              >
                <DsIcon name={tab.icon} size={24} />
                <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

type AppHeaderProps = {
  title?: string
  eyebrow?: string
  leading?: ReactNode
  trailing?: ReactNode
  transparent?: boolean
}

export const AppHeader = ({ title, eyebrow, leading, trailing, transparent }: AppHeaderProps) => (
  <div
    className={cn(
      "sticky top-0 z-10 pt-[52px] pb-3 px-4 flex items-center justify-between",
      transparent ? "bg-transparent" : "bg-surface-page/85 backdrop-blur"
    )}
  >
    <div className="flex items-center gap-3 min-w-0">
      {leading}
      <div className="min-w-0">
        {eyebrow && <p className="text-b-xs text-ink-tertiary uppercase tracking-wider">{eyebrow}</p>}
        {title && <h1 className="font-display text-h-sm text-ink truncate">{title}</h1>}
      </div>
    </div>
    <div className="flex items-center gap-1">{trailing}</div>
  </div>
)

type AppShellProps = {
  children: ReactNode
  header?: ReactNode
  // A sticky bottom action area (e.g. primary CTA on a modal flow). When
  // provided, `hideTabBar` is implied.
  footer?: ReactNode
  hideTabBar?: boolean
  fullBleed?: boolean
  className?: string
  // Override the page background when a Figma spec uses pure white
  // (e.g. onboarding / intro flows) instead of the app's off-white
  // `surface-page` (#f8f8fa). Applies to the outer wrapper and to the
  // sticky footer strip so the transparent header + white body + footer
  // all read as one continuous surface.
  pageBg?: "surface-page" | "surface-card"
}

const AppShell = ({
  children,
  header,
  footer,
  hideTabBar = false,
  fullBleed = false,
  className,
  pageBg = "surface-page"
}: AppShellProps) => {
  const tabBarHidden = hideTabBar || Boolean(footer)
  const bgClass = pageBg === "surface-card" ? "bg-surface-card" : "bg-surface-page"
  return (
    // The shell fills the phone viewport exactly. `overflow-hidden` at the
    // root confines scrolling to <main>, which keeps the bottom tab bar (or
    // sticky footer) pinned to the phone's bottom edge instead of scrolling
    // with content.
    <div className={cn("relative h-full w-full flex flex-col overflow-hidden", bgClass)}>
      {header}
      <main
        className={cn(
          "flex-1 min-h-0 overflow-y-auto phone-scroll",
          // Full-bleed screens (e.g. hero-led layouts) drop the horizontal
          // padding and status-bar clearance so content can extend edge to edge.
          !fullBleed && "px-4",
          !fullBleed && !header && "pt-[64px]",
          // Bottom padding accounts for the fixed tab bar / footer.
          footer
            ? "pb-[24px]"
            : tabBarHidden
            ? "pb-6"
            : fullBleed
            ? "pb-[86px]"
            : "pb-[110px]",
          className
        )}
      >
        {children}
      </main>
      {footer && (
        <div
          className={cn(
            "shrink-0 px-4 pt-3 pb-6 z-20",
            pageBg === "surface-card"
              ? "bg-surface-card"
              : "bg-surface-card border-t border-border-subtle"
          )}
        >
          {footer}
        </div>
      )}
      {!tabBarHidden && <TabBar />}
    </div>
  )
}

export default AppShell
