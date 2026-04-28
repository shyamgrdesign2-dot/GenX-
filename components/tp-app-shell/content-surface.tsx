'use client'

import { Breadcrumb } from './breadcrumb'
import type { RailSection } from './types'

export function ContentSurface({
  section,
  activeLeafId,
}: {
  section: RailSection
  activeLeafId: string | null
}) {
  const leafLabel =
    activeLeafId && activeLeafId !== section.id ? humanize(activeLeafId) : null
  const items = leafLabel
    ? [{ label: section.label }, { label: leafLabel }]
    : [{ label: section.label }]

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden" style={{ padding: 18 }}>
      <Breadcrumb items={items} />

      <div className="flex-1 min-h-0 rounded-2xl bg-tp-slate-0 border border-tp-slate-100 p-5 md:p-6 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div className="space-y-2">
            <div className="h-5 w-48 rounded-md tp-shimmer" />
            <div className="h-3 w-72 rounded-md tp-shimmer" />
          </div>
          <div className="h-9 w-28 rounded-md tp-shimmer" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 shrink-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl tp-shimmer" />
          ))}
        </div>

        <div className="flex-1 min-h-0 rounded-xl tp-shimmer" />
      </div>

      <style jsx>{`
        .tp-shimmer {
          background: linear-gradient(
            90deg,
            var(--tp-slate-100) 0%,
            var(--tp-slate-50) 50%,
            var(--tp-slate-100) 100%
          );
          background-size: 200% 100%;
          animation: tpShimmer 1.6s ease-in-out infinite;
        }
        @keyframes tpShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tp-shimmer { animation: none; }
        }
      `}</style>
    </div>
  )
}

function humanize(id: string) {
  return id
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}
