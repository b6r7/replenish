"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import DeviceFrame from "@/components/DeviceFrame"
import { IconChevronLeft } from "@/components/icons/Icon"

// ---------------------------------------------------------------------------
// Every route under /app is rendered inside a phone frame, on the neutral
// canvas that stakeholders see in the storyboard concept image.
//
// When rendered inside an iframe (i.e. on the storyboard canvas) we drop the
// outer canvas chrome so viewers don't see a phone-inside-a-phone.
// ---------------------------------------------------------------------------

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [embedded, setEmbedded] = useState(false)

  useEffect(() => {
    try {
      setEmbedded(window.top !== window.self)
    } catch {
      // cross-origin iframe -> definitely embedded
      setEmbedded(true)
    }
  }, [])

  if (embedded) {
    return (
      <div className="w-full h-screen bg-surface-page">
        <div className="w-full h-full">{children}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full canvas-grid flex flex-col">
      <div className="max-w-[1200px] w-full mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-b-sm text-ink-secondary hover:text-ink transition-colors"
        >
          <IconChevronLeft size={16} />
          Back to flow index
        </Link>
        <span className="marker-chip">Affirm · Replenish prototype</span>
      </div>
      <div className="flex-1 flex items-center justify-center py-8">
        <DeviceFrame>{children}</DeviceFrame>
      </div>
    </div>
  )
}

export default AppLayout
