// ---------------------------------------------------------------------------
// Tailwind config.
//
// Colors, typography, spacing, and radii mirror @affirm/design-system 1:1:
//   - Primitive palette (`palette.*`) → tokens/colors.ts (base.color.*)
//   - Semantic aliases (`ink.*`, `brand.*`, `surface.*`, `border.*`, `signal.*`)
//     → theme/v2SemanticColorAliases.ts (light-mode Wave 2 redesign)
//   - Typography scale → theme/typography.ts (headline* + body*)
//   - Radii → theme/radius.ts (onPage/onSurface radiusOn*)
// ---------------------------------------------------------------------------

import type { Config } from "tailwindcss"

// Primitive palette lifted from tokens/colors.ts. Exposed under `palette.*`
// so components can pull specific ramp stops (e.g. bg-palette-indigo-100).
// Prefer the semantic aliases below for anything on customer-facing screens.
const palette = {
  indigo: {
    "050": "#F2F5FF",
    "075": "#DFE5FF",
    "100": "#CCD6FF",
    "200": "#A7B7FF",
    "250": "#9DADF9",
    "300": "#8396FF",
    "400": "#6372FF",
    "500": "#4A4AF4",
    "600": "#3C38D6",
    "700": "#2B21AB",
    "800": "#1B0D7C",
    "900": "#0E0053",
    "950": "#0A0340"
  },
  spruce: {
    "050": "#E9F8FF",
    "100": "#A9DFF8",
    "200": "#7CC3E1",
    "300": "#5EA4C2",
    "400": "#4087A4",
    "500": "#196B88",
    "600": "#005671",
    "700": "#004256",
    "800": "#002E3E",
    "900": "#001C27"
  },
  duskfall: {
    "050": "#F5F4FF",
    "100": "#D6D0FF",
    "200": "#B9ACFF",
    "300": "#9E8AF2",
    "400": "#836DD5",
    "500": "#694FBB",
    "600": "#51339D",
    "700": "#41118F",
    "800": "#2E086A",
    "900": "#1D0048"
  },
  orchid: {
    "050": "#FFEFFF",
    "100": "#FBC1FD",
    "200": "#EC96F0",
    "300": "#D671DC",
    "400": "#B856BE",
    "500": "#9F31A6",
    "600": "#840C8C",
    "700": "#65066B",
    "800": "#48034C",
    "900": "#2D0030"
  },
  dandelion: {
    "050": "#FFF4E0",
    "100": "#FFECC9",
    "200": "#FFE4B2",
    "300": "#FFDB9A",
    "400": "#FFD37F",
    "500": "#FFCA61",
    "600": "#D89E00",
    "700": "#956C00",
    "800": "#553C00",
    "900": "#221600"
  },
  gray: {
    white: "#FFFFFF",
    "020": "#F8F8FA",
    "050": "#EDEEF2",
    "100": "#DDDEE2",
    "150": "#CCCDD4",
    "200": "#BBBDC6",
    "250": "#ABADB8",
    "300": "#9B9EAA",
    "350": "#8B8F9C",
    "400": "#7C808E",
    "450": "#6D7180",
    "500": "#5F6272",
    "550": "#535766",
    "600": "#494C5A",
    "650": "#3F424E",
    "700": "#353743",
    "750": "#2D3039",
    "800": "#262830",
    "850": "#1F2128",
    "900": "#191A21",
    "950": "#121319",
    "970": "#07070D",
    black: "#000000"
  },
  red: {
    "050": "#FFF1F2",
    "100": "#FFC5C8",
    "200": "#FF959D",
    "300": "#EF6879",
    "400": "#DB485F",
    "500": "#B4193F",
    "600": "#96002F"
  },
  green: {
    "050": "#DFFFE4",
    "100": "#A6EAB2",
    "200": "#7CCE8C",
    "300": "#59B16D",
    "400": "#35944F",
    "500": "#007832"
  },
  yellow: {
    "050": "#FFF3E6",
    "300": "#CF8A30",
    "400": "#B6730F",
    "500": "#8B5500"
  },
  blue: {
    "050": "#E9F8FF",
    "300": "#5EA4C2",
    "400": "#4087A4",
    "500": "#196B88"
  }
} as const

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Primitive palette (base.color.* from tokens/colors.ts) ----
        palette,

        // ---- Semantic aliases (theme-aware via CSS variables) ----
        //
        // Every semantic color routes through a CSS custom property that
        // holds a space-separated `R G B` triplet. Tailwind's opacity
        // modifiers (e.g. `text-ink/80`) work because we wrap the var
        // in `rgb(... / <alpha-value>)`, which Tailwind fills at runtime.
        //
        // Light values are defined on `:root` in globals.css.
        // Dark values are defined on `[data-theme="dark"]` in globals.css.
        // A `<ThemeProvider>` (plus an inline bootstrap script in <head>)
        // manages the `data-theme` attribute.

        // Text (colorText*)
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          secondary: "rgb(var(--ink-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--ink-tertiary) / <alpha-value>)"
        },
        // Backgrounds (colorBg*)
        surface: {
          page: "rgb(var(--page-bg) / <alpha-value>)",
          card: "rgb(var(--card-bg) / <alpha-value>)",
          inset: "rgb(var(--inset-bg) / <alpha-value>)"
        },
        // Borders (colorBorder*)
        border: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          subtle: "rgb(var(--border-subtle) / <alpha-value>)"
        },
        // Brand — primary CTAs, links, accents.
        // NOTE: the Wave 2 spec ships two "primary" variants:
        //   - primary        → light indigo bg (indigo.050) with dark text
        //   - primary.static → dark indigo bg (indigo.950) with white text
        // Figma exports pin to `#0a0340` for Pay/See-my-plans, i.e. the
        // static variant. That's what we use as `brand.DEFAULT` in light.
        // In dark mode the brand shifts up to indigo.500 for AA contrast.
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          hover: "rgb(var(--brand-hover) / <alpha-value>)",
          pressed: "rgb(var(--brand-pressed) / <alpha-value>)",
          disabled: "rgb(var(--brand-disabled) / <alpha-value>)",
          accent: "rgb(var(--brand-accent) / <alpha-value>)",
          on: "rgb(var(--brand-on) / <alpha-value>)",
          link: "rgb(var(--brand-link) / <alpha-value>)"
        },
        // Usercomm (colorTextUsercomm*)
        signal: {
          error: "rgb(var(--error) / <alpha-value>)",
          success: "rgb(var(--success) / <alpha-value>)",
          warning: "rgb(var(--warning) / <alpha-value>)",
          info: "rgb(var(--info) / <alpha-value>)"
        }
      },
      fontFamily: {
        // Match theme/typography.ts family names exactly.
        display: [
          '"Axiforma for Affirm"',
          '"SF Pro Display"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif"
        ],
        body: [
          '"Calibre"',
          '"SF Pro Text"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif"
        ]
      },
      fontSize: {
        // From theme/typography.ts (headline* + body* variants).
        "h-2xl": ["52px", { lineHeight: "70px", letterSpacing: "-1px", fontWeight: "500" }],
        "h-xl": ["40px", { lineHeight: "54px", letterSpacing: "-1px", fontWeight: "500" }],
        "h-lg": ["32px", { lineHeight: "44px", letterSpacing: "-0.5px", fontWeight: "600" }],
        "h-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.25px", fontWeight: "600" }],
        "h-sm": ["18px", { lineHeight: "24px", letterSpacing: "0", fontWeight: "700" }],
        // body scale
        "b-xl": ["20px", { lineHeight: "30px", fontWeight: "400" }],
        "b-lg": ["18px", { lineHeight: "27px", fontWeight: "400" }],
        "b-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "b-sm": ["14px", { lineHeight: "21px", fontWeight: "400" }],
        "b-xs": ["12px", { lineHeight: "18px", fontWeight: "500" }]
      },
      borderRadius: {
        // theme/radius.ts:
        //   radiusOnPageDefault      = size.200 = 16px
        //   radiusOnSurfaceDefault   = size.100 = 8px
        //   radiusOnSurfaceInset     = size.025 = 2px
        //   radiusElevatedSurfaceDef = size.300 = 24px
        inset: "2px",
        input: "8px",
        card: "16px",   // onPage default (card_container)
        modal: "24px",  // elevated surface (bottom sheet, dialog)
        "pill-sm": "18px",
        "pill-md": "24px",
        "pill-lg": "32px"
      },
      spacing: {
        // theme/spacing.ts uses size.* multiples. Match the token step names
        // so components can request `pl-onsurface-md` etc. instead of raw px.
        "onsurface-sm": "4px",   // size.050
        "onsurface-md": "8px",   // size.100
        "onsurface-lg": "12px",  // size.150
        "onsurface-xl": "16px",  // size.200
        "onpage-md": "8px",      // spacingOnPageSectionVerticalMd
        "onpage-lg": "12px",     // spacingOnPageSectionVerticalLg
        "onpage-xl": "16px",     // spacingOnPageSectionVerticalXl
        "px-page": "16px"
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
}

export default config
