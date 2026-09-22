// Central icon set. Kept as inline SVG for full color control and zero deps.

import { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (props: IconProps) => ({
  width: props.size ?? 20,
  height: props.size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props
})

export const IconBell = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 8a6 6 0 1 1 12 0v5l1.5 3h-15L6 13V8Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
)

export const IconUser = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
)

export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const IconChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const IconChevronLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
)

export const IconClose = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const IconCheckCircle = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </svg>
)

export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12 5 5L20 7" />
  </svg>
)

export const IconAlertCircle = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16v.01" />
  </svg>
)

export const IconInfo = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8v.01" />
  </svg>
)

export const IconShield = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 4 6v6c0 4.5 3.2 8.4 8 9 4.8-.6 8-4.5 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const IconHome = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9Z" />
  </svg>
)

export const IconShop = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 8h18l-1.2 11a2 2 0 0 1-2 1.8H6.2a2 2 0 0 1-2-1.8L3 8Z" />
    <path d="M8 8V6a4 4 0 1 1 8 0v2" />
  </svg>
)

export const IconCard = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 15h4" />
  </svg>
)

export const IconActivity = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12h4l2-6 4 12 2-6h6" />
  </svg>
)

export const IconMenu = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const IconPlane = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2 12l20-8-5 20-4-8-11-4Z" />
  </svg>
)

export const IconHanger = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 8a2 2 0 1 1 2-2" />
    <path d="M12 8v3" />
    <path d="M3 18h18L12 11 3 18Z" />
  </svg>
)

export const IconTv = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="12" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
)

export const IconArrowUpRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
)

export const IconCircleDot = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
)

export const IconCircle = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
  </svg>
)

export const IconClock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const IconRefresh = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 4v5h-5" />
  </svg>
)

export const IconSpark = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v4" />
    <path d="M12 17v4" />
    <path d="M3 12h4" />
    <path d="M17 12h4" />
    <path d="m5.5 5.5 2.5 2.5" />
    <path d="m16 16 2.5 2.5" />
    <path d="m5.5 18.5 2.5-2.5" />
    <path d="m16 8 2.5-2.5" />
  </svg>
)

export const IconSettings = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </svg>
)

export const IconMessage = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 12a8 8 0 0 1-11.6 7.2L4 21l1.8-5.4A8 8 0 1 1 21 12Z" />
  </svg>
)

export const IconPlans = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3a9 9 0 1 0 9 9h-9V3Z" />
    <path d="M14 3.2A9 9 0 0 1 20.8 10H14V3.2Z" />
  </svg>
)

export const IconDeals = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 7V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
    <path d="M4 8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1l-1 10.5A2.5 2.5 0 0 1 16.5 21h-9A2.5 2.5 0 0 1 5 18.5L4 8Z" />
  </svg>
)

export const IconMoney = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2v20" />
    <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

export const IconWarningTriangle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5 2.5 20h19L12 3.5Z" />
    <path d="M12 10v4" />
    <path d="M12 17v.01" />
  </svg>
)

export const IconCalendar = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
  </svg>
)

export const IconArrowDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14" />
    <path d="M6 13l6 6 6-6" />
  </svg>
)

export const IconLink = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 10a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07l1.72-1.72" />
  </svg>
)

export const IconBank = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 10l9-6 9 6" />
    <path d="M5 10v8" />
    <path d="M12 10v8" />
    <path d="M19 10v8" />
    <path d="M3 20h18" />
  </svg>
)

export const IconRadioSelected = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none" />
  </svg>
)

export const IconRadioEmpty = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
  </svg>
)

export const IconEdit = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20h4l10.5-10.5-4-4L4 16v4Z" />
    <path d="M14 6l4 4" />
  </svg>
)
