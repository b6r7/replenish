import type { Metadata, Viewport } from "next"
import "./globals.css"
import { PrototypeProvider } from "@/lib/store"
import { ThemeProvider, themeBootstrapScript } from "@/lib/theme"
import ThemeToggle from "@/components/ThemeToggle"
import ForceHardNav from "@/components/ForceHardNav"
import PasswordGate from "@/components/PasswordGate"

// Intentionally minimal, non-descriptive metadata. This prototype is deployed
// to a public URL (GitHub Pages) but we don't want it discoverable via search
// engines, social-preview scrapes, or share cards. See below for the full set
// of robots directives applied at the <head> level.
export const metadata: Metadata = {
  title: "—",
  description: " ",
  // The default OpenGraph/Twitter absence combined with `robots: none` below
  // prevents any preview surfaces (Slack, iMessage, X, LinkedIn) from
  // rendering a rich card if the URL is ever pasted.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1
    }
  },
  // Prevent the browser from sending a `Referer` header when the user
  // navigates away — so this URL never leaks into other sites' analytics.
  referrer: "no-referrer"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e14" }
  ]
}

// `suppressHydrationWarning` on <html> because the inline bootstrap script
// mutates the `data-theme` attribute + `color-scheme` inline style before
// React hydrates. Without this suppression, React would warn about the
// mismatch between server-rendered markup and client-mutated DOM.
const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      {/* Belt-and-suspenders discoverability lockdown. Written verbatim
          in case any renderer skips Next.js's generated metadata tags. */}
      <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate" />
      <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="referrer" content="no-referrer" />
      {/* No-flash bootstrap. Reads the persisted theme from localStorage
          and sets `data-theme` on <html> synchronously, so the correct
          palette is painted on the very first frame. */}
      <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
    </head>
    <body className="min-h-screen bg-surface-page text-ink antialiased">
      <ThemeProvider>
        <PasswordGate>
          <PrototypeProvider>{children}</PrototypeProvider>
          {/* Fixed-position, viewport-corner toggle. Sits above every
              layout — flow index, /app/*, /emails/*, /storyboard. */}
          <ThemeToggle />
          {/* On the Quickhost build only: force internal clicks to hard-nav
              so the URL bar keeps the `.html` extension and refresh works. */}
          <ForceHardNav />
        </PasswordGate>
      </ThemeProvider>
    </body>
  </html>
)

export default RootLayout
