import type { Metadata, Viewport } from "next"
import "./globals.css"
import { PrototypeProvider } from "@/lib/store"
import { ThemeProvider, themeBootstrapScript } from "@/lib/theme"
import ThemeToggle from "@/components/ThemeToggle"
import ForceHardNav from "@/components/ForceHardNav"

export const metadata: Metadata = {
  title: "Replenish · Affirm PP prototype",
  description:
    "High-fidelity prototype of the purchasing-power replenishment experience (Phase 1)."
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
      {/* No-flash bootstrap. Reads the persisted theme from localStorage
          and sets `data-theme` on <html> synchronously, so the correct
          palette is painted on the very first frame. */}
      <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
    </head>
    <body className="min-h-screen bg-surface-page text-ink antialiased">
      <ThemeProvider>
        <PrototypeProvider>{children}</PrototypeProvider>
        {/* Fixed-position, viewport-corner toggle. Sits above every
            layout — flow index, /app/*, /emails/*, /storyboard. */}
        <ThemeToggle />
        {/* On the Quickhost build only: force internal clicks to hard-nav
            so the URL bar keeps the `.html` extension and refresh works. */}
        <ForceHardNav />
      </ThemeProvider>
    </body>
  </html>
)

export default RootLayout
