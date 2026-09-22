"use client"

// ---------------------------------------------------------------------------
// Theme-aware wrapper around the Affirm DS mp4 illustrations.
//
// Why this component exists:
//   Design-system illustrations ship as separate light/dark videos because
//   their alpha channel is baked into a solid matte matching the intended
//   surface color. We can't recolor the matte at runtime — we have to swap
//   the source.
//
//   The matte-erase strategy differs per theme:
//     - LIGHT: matte is #FFFFFF, surface is #F8F8FA. Since they're not
//       identical, we use `mix-blend-multiply` — white × anything = anything,
//       so the matte melts into the surface and only the colored pixels
//       remain.
//     - DARK: matte is #121319 (gray.950). The dark palette pins both
//       `--page-bg` and `--card-bg` to gray.950 exactly, so the matte
//       IS the surface. No blend mode needed — `mix-blend-mode: normal`.
//
//   Blend mode is driven by the `--illustration-blend` CSS variable so
//   theme changes propagate to every illustration without a React re-render.
//
// Usage:
//   <ThemedIllustration name="money_account" width={280} height={280} />
//
// The `name` is the DS asset name WITHOUT the `-light` / `-dark` suffix
// (e.g. "plan_paid", "purchasing_power", "money_account"). Both variants
// must exist under /public/illustrations/.
// ---------------------------------------------------------------------------

import { useTheme } from "@/lib/theme"
import { cn } from "@/lib/format"
import { illustrationManifest } from "@/lib/illustration-manifest"

type Props = {
  name: string
  // Explicit numeric width/height (px). Match the Figma spec value.
  width: number
  height: number
  className?: string
  // Set true to disable rendering on the server / before hydration; use
  // when parent layout can absorb a temporary blank box.
  suspendUntilMounted?: boolean
}

const ThemedIllustration = ({ name, width, height, className, suspendUntilMounted = false }: Props) => {
  const { theme, mounted } = useTheme()

  // Before hydration we render the light variant so SSR + first paint match.
  // Once mounted, we swap to whichever variant reflects the active theme.
  const variant: "light" | "dark" = mounted ? theme : "light"
  // We resolve the source from a base64 manifest bundled at build time
  // instead of a `/illustrations/*.mp4` URL. This lets the prototype ship
  // to Quickhost (SPCS), which doesn't allow .mp4 files.
  const src =
    illustrationManifest[`${name}-${variant}`] ??
    illustrationManifest[`${name}-light`]

  if (suspendUntilMounted && !mounted) {
    return <div style={{ width, height }} aria-hidden="true" />
  }

  return (
    <video
      // Key on variant so the browser reloads the correct source when
      // the user toggles themes at runtime (rather than caching the
      // previous src for the lifetime of the <video> element).
      key={variant}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className={cn(
        "object-contain pointer-events-none",
        // Tailwind arbitrary value → reads the CSS var set per theme in
        // globals.css (`multiply` for light, `normal` for dark).
        "[mix-blend-mode:var(--illustration-blend)]",
        className
      )}
      style={{ width, height }}
    />
  )
}

export default ThemedIllustration
