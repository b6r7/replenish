"use client"

// ---------------------------------------------------------------------------
// Client-side password gate for the deployed prototype.
//
// This is NOT a security control — the site is a static export on GitHub
// Pages, so the password lives in the JS bundle and can be read by anyone
// who cares. The gate exists to prevent casual URL-sharing and search-engine
// indexing of an in-flight prototype. Treat it like a "don't-share-yet"
// speed bump, not access control.
//
// Behaviour:
//   - On first load, render a full-viewport prompt (matches prototype palette)
//   - On correct submit, persist an unlock flag to localStorage and render
//     the app underneath — no reload, no route change
//   - No unlock UI is shown once the flag is set (subsequent visits render
//     the prototype directly)
// ---------------------------------------------------------------------------

import { useEffect, useState, FormEvent } from "react"

const STORAGE_KEY = "replenish_unlocked_v1"
// Sentinel — see block comment above re: this is a speed bump, not security.
const PASSWORD = "affirmin"

type Props = { children: React.ReactNode }

const PasswordGate = ({ children }: Props) => {
  // `unlocked` starts undefined so we don't flash the gate on top of an
  // already-authenticated session while the localStorage read is pending.
  const [unlocked, setUnlocked] = useState<boolean | undefined>(undefined)
  const [entry, setEntry] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      setUnlocked(window.localStorage.getItem(STORAGE_KEY) === "1")
    } catch {
      setUnlocked(false)
    }
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (entry.trim().toLowerCase() === PASSWORD) {
      try {
        window.localStorage.setItem(STORAGE_KEY, "1")
      } catch {}
      setUnlocked(true)
      setError(false)
      return
    }
    setError(true)
  }

  const handleChange = (value: string) => {
    setEntry(value)
    if (error) setError(false)
  }

  if (unlocked === undefined) return null
  if (unlocked) return <>{children}</>

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-page text-ink px-6">
      {/* Backdrop glow — organic depth, avoids the "solid-color login" cliché */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 10%, rgb(var(--brand) / 0.18), transparent 60%), radial-gradient(50% 50% at 90% 90%, rgb(var(--brand) / 0.10), transparent 70%)"
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-3xl border border-border-subtle bg-surface-card/95 backdrop-blur-md p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-block h-2 w-2 rounded-full bg-brand" />
          <span className="text-b-xs uppercase tracking-[0.14em] text-ink-secondary font-medium">
            Prototype · protected
          </span>
        </div>

        <h1 className="font-display text-h-lg text-ink leading-tight">
          Affirm Purchasing Power
          <br />
          <span className="text-ink-secondary">Replenishment prototype</span>
        </h1>

        <p className="mt-3 text-b-md text-ink-secondary">
          Enter the demo password to continue.
        </p>

        <label htmlFor="gate-password" className="sr-only">
          Password
        </label>
        <input
          id="gate-password"
          type="password"
          autoComplete="off"
          autoFocus
          value={entry}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Password"
          aria-invalid={error}
          aria-describedby={error ? "gate-error" : undefined}
          className={
            "mt-6 w-full rounded-xl border bg-surface-inset px-4 py-3 text-b-md text-ink placeholder:text-ink-tertiary outline-none transition " +
            (error
              ? "border-signal-error focus:ring-2 focus:ring-signal-error/40"
              : "border-border-subtle focus:border-brand focus:ring-2 focus:ring-brand/30")
          }
        />

        {error && (
          <p id="gate-error" role="alert" className="mt-2 text-b-sm text-signal-error">
            That's not the demo password. Try again.
          </p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-brand text-brand-on font-semibold text-b-md px-4 py-3 hover:bg-brand-hover active:scale-[0.99] transition"
        >
          Enter
        </button>

        <p className="mt-6 text-b-xs text-ink-tertiary leading-relaxed">
          Internal alignment prototype. Not for external sharing. Content and
          numbers are illustrative — none of this is production behavior.
        </p>
      </form>
    </div>
  )
}

export default PasswordGate
