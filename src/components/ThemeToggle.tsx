"use client"

// ---------------------------------------------------------------------------
// Global dark-mode toggle. Fixed to the top-right of the viewport so it
// sits OUTSIDE the iPhone frame on every route (flow index, /app/*,
// /emails/*, /storyboard) without threading a prop through every layout.
//
// Visual: a segmented pill with a sun on the left and moon on the right.
// The pill contains a sliding "thumb" that indicates the active mode.
// The whole control is a single button that toggles between states.
//
// Iframe suppression:
//   The storyboard page embeds every screen inside <iframe>s, and each
//   iframe renders the app's root layout — which would drop its own
//   toggle inside every phone frame. We detect `window.top !== window.self`
//   after mount and skip rendering in that case. The parent storyboard
//   toggle remains as the single source of control.
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react"
import { useTheme } from "@/lib/theme"

const SunIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const MoonIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
)

const ThemeToggle = () => {
  const { theme, toggle, mounted } = useTheme()
  const [embedded, setEmbedded] = useState(false)
  const isDark = theme === "dark"

  useEffect(() => {
    try {
      setEmbedded(window.top !== window.self)
    } catch {
      // Cross-origin iframe access throws — treat as embedded.
      setEmbedded(true)
    }
  }, [])

  // Don't render inside iframes — the parent document owns the toggle.
  if (embedded) return null

  const handleClick = () => toggle()

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <div className="fixed top-4 right-4 z-[100] print:hidden">
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="group relative h-9 w-[72px] rounded-pill-md bg-surface-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04),0_0_0_1px_rgba(255,255,255,0.02)_inset] hover:border-border transition-colors"
        // Suppress hydration flicker: before React syncs to the persisted
        // theme, the pill renders in its light-mode position. The label
        // update is negligible; the ARIA state settles on next tick.
        suppressHydrationWarning
      >
        {/* Sliding thumb */}
        <span
          aria-hidden="true"
          className="absolute top-1 left-1 h-7 w-7 rounded-full bg-brand transition-transform duration-300 ease-out will-change-transform"
          style={{
            transform: mounted && isDark ? "translateX(36px)" : "translateX(0px)"
          }}
        />
        {/* Icon row */}
        <span className="relative z-10 flex h-full items-center justify-between px-2">
          <span
            className={
              "flex h-7 w-7 items-center justify-center transition-colors " +
              (mounted && !isDark ? "text-brand-on" : "text-ink-tertiary")
            }
          >
            <SunIcon />
          </span>
          <span
            className={
              "flex h-7 w-7 items-center justify-center transition-colors " +
              (mounted && isDark ? "text-brand-on" : "text-ink-tertiary")
            }
          >
            <MoonIcon />
          </span>
        </span>
      </button>
    </div>
  )
}

export default ThemeToggle
