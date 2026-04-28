'use client'

import { useMemo, useState } from 'react'
import { TPTopNavBar } from '@/components/tp-ui/tp-top-nav-bar'
import { TPSidebar } from './tp-sidebar'
import { ContentSurface } from './content-surface'
import type { PermissionPredicate, RailSection } from './types'

export interface TPAppShellProps {
  /** Sidebar nav configuration. Pass the static config directly, or one
   *  shaped from a backend response. */
  sections: RailSection[]
  /** Optional starting leaf — typically the user's default landing page. */
  initialActiveLeafId?: string
  /** Optional permission predicate for backend-driven menu filtering. */
  hasPermission?: PermissionPredicate
  /** Header — clinic name shown in the dropdown. */
  clinicName?: string
  /** Header — user profile display info. */
  profile?: { name: string; avatarUrl?: string; initials?: string }
  /** Pill badge shown next to the brand logo so the user always knows
   *  which product they're in (e.g. "Master", "Pharma"). */
  appTag?: { label: string; icon?: React.ReactNode }
  /** Footer entry that takes the user back to the module hub. */
  switchAppEntry?: { label: string; onClick: () => void; icon?: React.ReactNode }
  /** Optional content renderer keyed off the active leaf id. Defaults to
   *  the bundled shimmer placeholder. */
  renderContent?: (ctx: { section: RailSection; activeLeafId: string | null }) => React.ReactNode
}

/**
 * TPAppShell — top nav + collapsible left sidebar + content surface.
 * Config-driven: pass `sections` to swap apps without touching the shell.
 */
export function TPAppShell({
  sections,
  initialActiveLeafId,
  hasPermission,
  clinicName = 'Rajeshwar eye clinic',
  profile = { name: 'Musfiq Rizwan', initials: 'MR' },
  appTag,
  switchAppEntry,
  renderContent,
}: TPAppShellProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    () => sections[0]?.id ?? '',
  )
  const [activeLeafId, setActiveLeafId] = useState<string | null>(
    () => initialActiveLeafId ?? null,
  )

  const sectionForLeaf = useMemo(() => {
    return (
      sections.find((s) =>
        s.id === activeLeafId ||
        (s.groups ?? []).some((g) =>
          g.items.some(
            (it) => it.id === activeLeafId || it.children?.some((c) => c.id === activeLeafId),
          ),
        ),
      ) ?? sections[0]
    )
  }, [sections, activeLeafId])

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-tp-slate-100">
      <TPTopNavBar
        variant="default"
        clinicName={clinicName}
        profile={profile}
        appTag={appTag}
      />

      <div className="flex flex-1 min-h-0">
        <TPSidebar
          sections={sections}
          activeSectionId={activeSectionId}
          activeLeafId={activeLeafId}
          onSectionChange={setActiveSectionId}
          onLeafSelect={setActiveLeafId}
          hasPermission={hasPermission}
          switchAppEntry={switchAppEntry}
        />

        <main className="flex-1 min-w-0 min-h-0 overflow-hidden flex flex-col bg-tp-slate-100">
          {renderContent ? (
            renderContent({ section: sectionForLeaf, activeLeafId })
          ) : (
            <ContentSurface section={sectionForLeaf} activeLeafId={activeLeafId} />
          )}
        </main>
      </div>
    </div>
  )
}
