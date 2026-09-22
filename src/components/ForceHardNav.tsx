"use client"

// ---------------------------------------------------------------------------
// When we ship the prototype to Quickhost (SPCS), Quickhost only serves
// exact file paths. Our build post-processor rewrites every internal Link
// href to a `.html` sibling so hard-loads work, but Next.js's App-Router
// client-side navigation strips `.html` from the URL when it pushState's,
// which means a subsequent refresh or share of the URL bar value 404s.
//
// This component installs a document-level capture-phase click listener
// that intercepts internal navigation BEFORE Next.js Link's own handler
// runs. It forces a real browser navigation (`location.assign`) so the
// URL bar keeps the exact href — .html and all — and refreshes work.
//
// Only active when NEXT_PUBLIC_STATIC_HTML_ROUTES=1 (baked in at build
// time for Quickhost). In local dev it's a no-op, so Next.js SPA behavior
// is preserved for authors.
// ---------------------------------------------------------------------------

import { useEffect } from "react"

const ENABLED = process.env.NEXT_PUBLIC_STATIC_HTML_ROUTES === "1"

const ForceHardNav = () => {
  useEffect(() => {
    if (!ENABLED) return

    const handleClick = (event: MouseEvent) => {
      // Respect any modifier keys / non-left-clicks so users can still
      // open in a new tab, etc.
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.target && anchor.target !== "_self") return

      const href = anchor.getAttribute("href")
      if (!href) return
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return
      if (/^https?:\/\//i.test(href) && !href.includes(window.location.host)) return

      // Hash-only clicks: we set a runtime `<base>` on Quickhost, so
      // browsers would otherwise navigate to `<base>#hash` and reload the
      // page. Swallow the nav and just update the fragment on the CURRENT
      // page so `href="#"` behaves like the placeholder link authors expect.
      if (href.startsWith("#")) {
        event.preventDefault()
        event.stopImmediatePropagation()
        if (href.length > 1) window.location.hash = href.slice(1)
        return
      }

      // Force a browser-level navigation so the URL bar mirrors the href
      // exactly (including the `.html` we appended at build time).
      event.preventDefault()
      event.stopImmediatePropagation()
      window.location.assign(anchor.href)
    }

    document.addEventListener("click", handleClick, true) // capture-phase
    return () => document.removeEventListener("click", handleClick, true)
  }, [])

  return null
}

export default ForceHardNav
