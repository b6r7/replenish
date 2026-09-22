"use client"

// ---------------------------------------------------------------------------
// Theme system for the whole prototype.
//
// Strategy — CSS-variable swap on `<html data-theme="…">`:
//   Every semantic token in the prototype (`text-ink`, `bg-surface-card`,
//   `border-border`, …) resolves to a CSS custom property in globals.css.
//   Overriding those custom properties under `[data-theme="dark"]` swaps
//   the entire palette without touching a single component.
//
// Persistence — localStorage key `affirm-replenish-theme`. A tiny inline
// bootstrap script in `<head>` (see app/layout.tsx) reads the stored value
// before first paint and sets `data-theme` on `<html>` synchronously, so
// there is no light-to-dark flash on load.
//
// Illustration blend mode — light-matte DS videos use `mix-blend-multiply`
// against a light bg; dark-matte DS videos use `mix-blend-screen` against
// a dark bg. That switch is exposed as a `--illustration-blend` variable
// AND consumed by `<ThemedIllustration>`, which also swaps the mp4 src
// between `-light.mp4` and `-dark.mp4`.
// ---------------------------------------------------------------------------

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

export type Theme = "light" | "dark"

// Exposed as a module constant so the bootstrap script in <head> can share
// the exact same storage key without importing this client bundle.
export const THEME_STORAGE_KEY = "affirm-replenish-theme"

type ThemeContextValue = {
  theme: Theme
  setTheme: (next: Theme) => void
  toggle: () => void
  // `mounted` guards against hydration mismatch for consumers that render
  // theme-conditional markup (e.g. swapping sun/moon icons or video src).
  // Before hydration `mounted` is false; render a neutral placeholder.
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.dataset.theme = theme
  // Keep native form controls (checkboxes, scrollbars, autofill accents)
  // in step with the chosen theme.
  root.style.colorScheme = theme
}

type ProviderProps = {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ProviderProps) => {
  // Always start light on the server — the bootstrap script in <head>
  // will have already set `data-theme` to the persisted value before this
  // component hydrates, so the first paint is correct regardless.
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Sync React state with whatever the bootstrap script set on <html>.
  useEffect(() => {
    const stored = readStoredTheme()
    const active = stored ?? "light"
    setThemeState(active)
    applyTheme(active)
    setMounted(true)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    applyTheme(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Ignore quota / privacy-mode errors — theme still applies in-memory.
    }
  }, [])

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>")
  return ctx
}

// ---------------------------------------------------------------------------
// Bootstrap script — injected into <head> as an inline <script>. Runs
// synchronously before React hydrates so `data-theme` is set on <html>
// before the first paint, avoiding a light-to-dark flash.
// ---------------------------------------------------------------------------
export const themeBootstrapScript = `
(function(){
  try {
    var t = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
      document.documentElement.style.colorScheme = t;
    }
  } catch (e) {}
})();
`.trim()

const readStoredTheme = (): Theme | null => {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === "dark" || v === "light") return v
    return null
  } catch {
    return null
  }
}
