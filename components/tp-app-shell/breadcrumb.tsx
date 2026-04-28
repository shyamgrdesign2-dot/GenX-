'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  /** Display label. */
  label: string
  /** Optional click handler — when omitted the segment is non-interactive. */
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** Custom separator. Defaults to a slate-300 forward slash. */
  separator?: React.ReactNode
  className?: string
}

/**
 * Breadcrumb / stepper used at the top of any TP content surface.
 * Stand-alone and reusable: pass `items` from the route or the active leaf.
 */
export function Breadcrumb({ items, separator, className }: BreadcrumbProps) {
  const sep = separator ?? <span className="text-tp-slate-300">/</span>
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center gap-1.5 text-[12px] text-tp-slate-500 shrink-0',
        className,
      )}
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1
        const node = item.onClick ? (
          <button
            type="button"
            onClick={item.onClick}
            className={cn(
              'truncate transition-colors',
              last ? 'text-tp-slate-900 font-medium' : 'hover:text-tp-slate-700',
            )}
          >
            {item.label}
          </button>
        ) : (
          <span className={cn('truncate', last && 'text-tp-slate-900 font-medium')}>
            {item.label}
          </span>
        )
        return (
          <React.Fragment key={`${item.label}-${i}`}>
            {node}
            {!last && sep}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
