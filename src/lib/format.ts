const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const currencyFormatterCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

export const formatCurrency = (value: number, compact = false): string => {
  if (compact && Number.isInteger(value)) return currencyFormatterCompact.format(value)
  return currencyFormatter.format(value)
}

export const formatDate = (iso: string, opts?: Intl.DateTimeFormatOptions): string => {
  const date = new Date(iso)
  return date.toLocaleDateString("en-US", opts ?? { month: "short", day: "numeric", year: "numeric" })
}

export const formatShortDate = (iso: string): string => formatDate(iso, { month: "short", day: "numeric" })

export const formatTime = (iso: string): string => {
  const date = new Date(iso)
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ")

// Quickhost only serves files at their exact path — no index.html
// fallback — so every programmatic navigation must (a) include `.html`
// and (b) go through `location.assign` to bypass Next.js's client-side
// router (which doesn't know about `.html` routes). `basePath` is baked
// in at build time via `NEXT_PUBLIC_BASE_PATH`.
const STATIC_HTML_ROUTES = process.env.NEXT_PUBLIC_STATIC_HTML_ROUTES === "1"
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ""

export const staticRoute = (path: string): string => {
  if (!STATIC_HTML_ROUTES) return path
  if (path.startsWith("http") || path.endsWith(".html")) return path
  const [pathname] = path.split(/[?#]/)
  const suffix = path.slice(pathname.length)
  const withHtml = `${pathname.replace(/\/$/, "")}.html`
  return `${BASE_PATH}${withHtml}${suffix}`
}

// Programmatic hard navigation. On Quickhost builds this bypasses Next.js's
// client router entirely and does a real browser navigation to the .html
// sibling under the baked-in basePath. On dev builds it falls back to
// pushState via the passed-in Next.js router.
type RouterLike = { push: (p: string) => void; replace?: (p: string) => void }
export const hardNav = (path: string, router?: RouterLike, mode: "push" | "replace" = "push") => {
  if (STATIC_HTML_ROUTES) {
    if (typeof window !== "undefined") window.location.assign(staticRoute(path))
    return
  }
  if (mode === "replace" && router?.replace) return router.replace(path)
  router?.push(path)
}
