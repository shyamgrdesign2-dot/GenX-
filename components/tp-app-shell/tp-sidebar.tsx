'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowDown2, ArrowRight2, Element4, SearchNormal1, SidebarLeft } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import type { NavGroup, NavItem, NavLeaf, PermissionPredicate, RailSection } from './types'

/* ============================================================================
 * DEV NOTE — TPSidebar  (components/tp-app-shell/tp-sidebar.tsx)
 * ============================================================================
 *
 * OVERVIEW
 * ────────
 * A config-driven, 3-level collapsible navigation sidebar that renders inside
 * TPAppShell. It is fully prop-driven — no hard-coded routes or menu items.
 * To swap products (Master → Pharma → OPD …) you only need to change the
 * `sections` prop; the shell, collapse logic, and active-state tracking are
 * reused unchanged.
 *
 * ─── NAV STRUCTURE (3 levels)  ───────────────────────────────────────────────
 *
 *   Level 1 — RailSection  (the top-level group shown in the sidebar rail)
 *     id, label, icon (IconComp), groups?, permission?
 *     A section with no groups is a "leaf section" — clicking it selects it directly.
 *
 *   Level 2 — NavItem  (rows inside an expanded section)
 *     id, label, icon?, badge?, children? (NavLeaf[]), permission?
 *     If children are present, hovering opens a L3 flyout popover.
 *     If no children, clicking calls onLeafSelect(item.id).
 *
 *   Level 3 — NavLeaf  (items inside a flyout)
 *     id, label, icon?, permission?
 *     Clicking calls onLeafSelect(leaf.id).
 *
 * Build your nav config as a RailSection[] array and pass it as `sections`.
 * See `nav-config.tsx` (Master) and `nav-config-pharma.tsx` (Pharma) for examples.
 *
 * ─── PROPS REFERENCE  ────────────────────────────────────────────────────────
 *
 *   sections          RailSection[]           The full nav tree for this product.
 *   activeSectionId   string                  Which L1 section is currently selected.
 *                                             Controlled from the parent (TPAppShell).
 *   activeLeafId      string | null           The deepest active item (L2 leaf or L3 leaf).
 *                                             Drives all active-state highlighting.
 *   onSectionChange   (id: string) => void    Called when the user clicks a section header.
 *   onLeafSelect      (id: string) => void    Called when the user picks a leaf node.
 *   hasPermission     (perm: string) => bool  Optional. When provided, any nav node whose
 *                                             `permission` key returns false is hidden.
 *                                             Sections with no visible children are also
 *                                             hidden automatically.
 *   switchAppEntry    { label, onClick, icon? }  Optional. Renders a product-switcher
 *                                             button pinned to the sidebar footer.
 *                                             Typically routes back to the Module Hub (/).
 *
 * ─── ACTIVE STATE RULES  ──────────────────────────────────────────────────────
 * Only the deepest selected node receives the blue "active" treatment.
 * All ancestor nodes receive a neutral "ancestor" treatment (no blue).
 *
 *   Expanded sidebar:
 *     • L1 section header  — slate background + chevron rotated; no blue.
 *     • L2 item (ancestor) — bg-tp-blue-50, icon blue-Bulk, text tp-blue-500.
 *     • L2 leaf (active)   — bg-tp-blue-50, icon blue-Bulk, text tp-blue-600 semibold.
 *     • L3 leaf (active)   — bg-tp-blue-50, text tp-blue-500 semibold.
 *
 *   Collapsed sidebar:
 *     • The L1 section that contains the active leaf is promoted to the
 *       TP "primary" collapsed pattern:
 *         bg: rgba(75,74,213,0.10)
 *         3 px left bar: bg-tp-blue-500 rounded-r-full
 *         icon chip:     bg-tp-blue-500 (solid blue)
 *         icon color:    #ffffff (white)
 *         label:         text-tp-blue-700 font-semibold
 *
 * ─── COLLAPSE BEHAVIOUR  ─────────────────────────────────────────────────────
 * The sidebar starts expanded. Two things can collapse it:
 *
 *   1. Tablet breakpoint (≤ 1024 px) — a `matchMedia` listener auto-collapses
 *      the sidebar on narrow viewports. This only fires while `userToggled` is
 *      false, so a manual expand on mobile is respected for the session.
 *
 *   2. Toggle button — the collapse/expand chevron button (SidebarLeft icon).
 *      Sets `userToggled = true` to suppress the media-query auto-collapse.
 *
 * To force-collapse from a parent, control the sidebar width externally or
 * add a `defaultCollapsed?: boolean` prop and initialise `collapsed` from it.
 *
 * ─── FLYOUT / PORTAL LAYER  ──────────────────────────────────────────────────
 * L3 sub-menus and collapsed-mode section menus are rendered via
 * `createPortal(…, document.body)` at `position: fixed`.
 *
 * This means they are NOT clipped by the sidebar's `overflow: hidden` or any
 * parent scroll container — they always render above everything else.
 *
 * The <FlyoutHost> component manages:
 *   • open/close on mouseEnter / mouseLeave / focus / blur
 *   • a 160 ms close delay so the user can move from trigger → flyout
 *   • live position updates on scroll and window resize (useLayoutEffect)
 *   • ESC key to close
 *
 * ─── PERMISSION FILTERING  ────────────────────────────────────────────────────
 * Pass a `hasPermission` predicate to hide nav items the user can't access:
 *
 *   <TPSidebar
 *     hasPermission={(perm) => userPermissions.includes(perm)}
 *     ...
 *   />
 *
 * Each RailSection / NavItem / NavLeaf accepts an optional `permission` string.
 * If the predicate returns false for that string, the node is hidden.
 * A section whose every child is filtered out is also hidden.
 *
 * ─── SEARCH  ──────────────────────────────────────────────────────────────────
 * The expanded header contains a live text filter. Typing narrows sections,
 * groups, items, and leaves — all matched via case-insensitive substring.
 * The filtered tree auto-expands all matching sections so results are visible.
 *
 * ─── SWITCH PRODUCT FOOTER  ───────────────────────────────────────────────────
 * Pass `switchAppEntry` to render a pinned footer button:
 *
 *   switchAppEntry={{
 *     label: 'Switch product',
 *     onClick: () => router.push('/'),
 *     // icon?: <MyIcon /> — defaults to Element4 (grid) if omitted
 *   }}
 *
 *   Collapsed mode → centred icon chip, native tooltip "View other products".
 *   Expanded mode  → left-aligned row: icon chip + label text.
 *
 * ─── HOW TO ADD A NEW PRODUCT  ────────────────────────────────────────────────
 * 1. Create `components/tp-app-shell/nav-config-<product>.tsx`
 *    following the RailSection[] pattern in nav-config-pharma.tsx.
 * 2. Create `app/<product>/page.tsx`:
 *      <TPAppShell
 *        sections={MY_NAV_CONFIG}
 *        initialActiveLeafId="dashboard"
 *        appTag={{ label: 'MyProduct', icon: <MyIcon size={14} ... /> }}
 *        switchAppEntry={{ label: 'Switch product', onClick: () => router.push('/') }}
 *      />
 * 3. Add a card for the new product in `app/page.tsx` (the Module Hub).
 *
 * ─── DESIGN TOKENS  ───────────────────────────────────────────────────────────
 *   Expanded width         236 px  (W_EXPANDED)
 *   Collapsed width         80 px  (W_COLLAPSED)
 *   Transition      220 ms cubic-bezier(.2,.8,.2,1) on `width`
 *   L1 icon chip     40 × 40 px, rounded-[12px]
 *   L2 icon chip     28 × 28 px (transparent bg)
 *   L3 icon chip     24 × 24 px (transparent bg)
 *   Active leaf      bg-tp-blue-50 / text-tp-blue-600 / icon tp-blue-500
 *   Ancestor         bg-tp-blue-50 / text-tp-blue-500 / icon tp-blue-500 Bulk
 *   Section expanded bg-tp-slate-50
 *   Hover            bg-tp-slate-50 or bg-tp-slate-100
 *   Fonts            var(--font-sans) / Inter, var(--font-heading) / Mulish
 *
 * ============================================================================ */

interface TPSidebarProps {
  sections: RailSection[]
  activeSectionId: string
  activeLeafId: string | null
  onSectionChange: (id: string) => void
  onLeafSelect: (id: string) => void
  /** Optional permission predicate. When set, nodes whose `permission` returns
   *  false are hidden. Sections that have no remaining children also hide. */
  hasPermission?: PermissionPredicate
  /** Footer entry that takes the user back to the module hub. Pinned to the
   *  bottom of the sidebar in both expanded and collapsed states. */
  switchAppEntry?: { label: string; onClick: () => void; icon?: React.ReactNode }
}

const W_EXPANDED = 236
const W_COLLAPSED = 80

export function TPSidebar({
  sections: rawSections,
  activeSectionId,
  activeLeafId,
  onSectionChange,
  onLeafSelect,
  hasPermission,
  switchAppEntry,
}: TPSidebarProps) {
  const sections = useMemo(
    () => filterByPermissions(rawSections, hasPermission),
    [rawSections, hasPermission],
  )
  const [collapsed, setCollapsed] = useState(false)
  const [userToggled, setUserToggled] = useState(false)
  const [query, setQuery] = useState('')
  // Multiple sections may be open at once — clicking a different section no
  // longer auto-collapses the previously-open one.
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(
    () => new Set([activeSectionId]),
  )

  // When transitioning from collapsed → expanded, ensure the section that
  // contains the active leaf is open (so the user lands back in context).
  const prevCollapsed = useRef(collapsed)
  useEffect(() => {
    if (prevCollapsed.current === true && collapsed === false) {
      const sec = sections.find((s) => sectionContainsLeaf(s, activeLeafId))
      if (sec) {
        setOpenSectionIds((prev) => {
          if (prev.has(sec.id)) return prev
          const next = new Set(prev)
          next.add(sec.id)
          return next
        })
      }
    }
    prevCollapsed.current = collapsed
  }, [collapsed, activeLeafId, sections])

  // When the active leaf changes (user picked a leaf), keep only the section
  // that owns that leaf open and collapse any other sections the user had
  // explored. Manual section-toggle clicks don't change activeLeafId, so
  // multi-open is still possible while the user is browsing.
  useEffect(() => {
    if (!activeLeafId) return
    const sec = sections.find((s) => sectionContainsLeaf(s, activeLeafId))
    if (sec) setOpenSectionIds(new Set([sec.id]))
  }, [activeLeafId, sections])

  useEffect(() => {
    if (typeof window === 'undefined' || userToggled) return
    const mql = window.matchMedia('(max-width: 1024px)')
    const apply = () => setCollapsed(mql.matches)
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [userToggled])

  const filtered = useMemo(() => filterSections(sections, query), [sections, query])

  const handleSectionClick = (id: string) => {
    onSectionChange(id)
    setOpenSectionIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggle = () => {
    setUserToggled(true)
    setCollapsed((c) => !c)
  }

  // Clicking a section in collapsed mode expands the sidebar and navigates to it
  const handleCollapsedSectionClick = (id: string) => {
    onSectionChange(id)
    setOpenSectionIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setUserToggled(true)
    setCollapsed(false)
  }

  return (
    <aside
      className="relative h-full shrink-0 bg-tp-slate-0 border-r border-tp-slate-100 flex flex-col"
      style={{
        width: collapsed ? W_COLLAPSED : W_EXPANDED,
        transition: 'width 220ms cubic-bezier(.2,.8,.2,1)',
        overflow: 'visible',
      }}
      aria-label="Primary navigation"
    >
      {collapsed ? (
        /* ── Collapsed header: grey chip expand button + gradient divider ── */
        <>
          <div className="shrink-0 flex items-center justify-center pt-3 pb-2.5">
            <button
              type="button"
              onClick={toggle}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="grid place-items-center w-10 h-10 rounded-[10px] bg-tp-slate-50 text-tp-slate-500 hover:bg-tp-slate-100 hover:text-tp-blue-600 transition-colors"
            >
              <SidebarLeft size={20} strokeWidth={1.5} variant="Linear" className="rotate-180" />
            </button>
          </div>
          <div
            className="shrink-0 mx-3"
            style={{
              height: '1px',
              background: 'linear-gradient(to right, rgba(208,213,221,0.1) 0%, #d0d5dd 50%, rgba(208,213,221,0.1) 100%)',
            }}
          />
        </>
      ) : (
        /* ── Expanded header: search bar + separate grey collapse button ── */
        <div className="px-3 pt-3 pb-2 shrink-0 flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0 h-[40px] rounded-[10px] bg-tp-slate-50 border border-tp-slate-200 px-3 focus-within:bg-tp-slate-0 focus-within:border-tp-blue-500 transition">
            <SearchNormal1 size={16} variant="Linear" color="var(--tp-slate-500)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search…"
              className="flex-1 min-w-0 bg-transparent outline-none text-[12px] text-tp-slate-900 placeholder:text-tp-slate-300"
              style={{ fontFamily: 'var(--font-sans)' }}
            />
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="shrink-0 grid place-items-center w-9 h-9 rounded-[10px] bg-tp-slate-50 text-tp-slate-500 hover:bg-tp-slate-100 hover:text-tp-blue-600 transition-colors"
          >
            <SidebarLeft size={20} strokeWidth={1.5} variant="Linear" />
          </button>
        </div>
      )}

      {/* Sections */}
      <div className={cn(
        'flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col',
        '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        collapsed ? 'px-0 pt-2 pb-4 gap-0' : 'px-3 pt-2 pb-4 gap-[6px]',
      )}>
        {filtered.length === 0 ? (
          <p className="px-2 py-6 text-[14px] text-tp-slate-500">No matches.</p>
        ) : (
          filtered.map((section) => {
            const leaf = isLeafSection(section)
            return (
              <Section
                key={section.id}
                section={section}
                collapsed={collapsed}
                expanded={!leaf && !collapsed && (openSectionIds.has(section.id) || !!query)}
                isActive={activeSectionId === section.id}
                activeLeafId={activeLeafId}
                onSectionClick={() => {
                  if (leaf) {
                    onLeafSelect(section.id)
                    return
                  }
                  if (collapsed) handleCollapsedSectionClick(section.id)
                  else handleSectionClick(section.id)
                }}
                onLeafSelect={onLeafSelect}
              />
            )
          })
        )}
      </div>

      {switchAppEntry && (
        <div className="shrink-0 border-t border-tp-slate-100 px-3 py-2.5 flex justify-center">
          {/* Icon-only button in both collapsed and expanded states.
              Title/aria-label provides the accessible tooltip on hover. */}
          <button
            type="button"
            onClick={switchAppEntry.onClick}
            className="grid place-items-center w-10 h-10 rounded-[10px] bg-tp-slate-50 hover:bg-tp-slate-100 text-tp-slate-500 hover:text-tp-blue-600 transition-colors"
            title="View other products"
            aria-label="View other products"
          >
            {switchAppEntry.icon ?? (
              <Element4 size={18} variant="Linear" color="currentColor" />
            )}
          </button>
        </div>
      )}
    </aside>
  )
}

/* ─────────────────────────  Section (Level 1)  ───────────────────────── */

function Section({
  section,
  collapsed,
  expanded,
  isActive,
  activeLeafId,
  onSectionClick,
  onLeafSelect,
}: {
  section: RailSection
  collapsed: boolean
  expanded: boolean
  isActive: boolean
  activeLeafId: string | null
  onSectionClick: () => void
  onLeafSelect: (id: string) => void
}) {
  const Icon = section.icon
  const containsActive = sectionContainsLeaf(section, activeLeafId)
  const tone: 'ancestor' | 'idle' = containsActive ? 'ancestor' : 'idle'
  const leafSection = isLeafSection(section)

  if (collapsed) {
    const collapsedActive = tone === 'ancestor'
    const trigger = (open: boolean, bind: object, ref?: React.Ref<any>) => (
      <button
        type="button"
        ref={ref as React.RefObject<HTMLButtonElement>}
        onClick={onSectionClick}
        {...bind}
        className={cn(
          'group relative flex w-full flex-col items-center gap-1.5 py-3 transition-colors',
          collapsedActive
            ? 'bg-[rgba(75,74,213,0.10)]'
            : 'hover:bg-tp-slate-50',
        )}
        style={{ borderRadius: 0 }}
        title={section.label}
        aria-current={collapsedActive ? 'page' : undefined}
      >
        {collapsedActive && (
          <span
            aria-hidden
            className="absolute left-0 inset-y-0 w-[3px] bg-tp-blue-500 rounded-r-full"
          />
        )}
        <span
          className={cn(
            'grid place-items-center w-10 h-10 rounded-[12px] transition-colors',
            collapsedActive
              ? 'bg-tp-blue-500'
              : 'bg-tp-slate-100 group-hover:bg-tp-slate-200',
          )}
        >
          <Icon
            size={22}
            variant={collapsedActive ? 'Bulk' : 'Linear'}
            color={collapsedActive ? '#ffffff' : 'var(--tp-slate-600)'}
          />
        </span>
        <span
          className={cn(
            'text-[12px] leading-tight tracking-[-0.1px] truncate max-w-[64px] px-0.5',
            collapsedActive
              ? 'text-tp-blue-700 font-semibold'
              : 'text-tp-slate-500 font-medium',
          )}
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {section.label}
        </span>
      </button>
    )

    if (leafSection) return trigger(false, {})
    return (
      <FlyoutHost offset={8} anchor={(open, bind, ref) => trigger(open, bind, ref)}>
        <SectionFlyout section={section} activeLeafId={activeLeafId} onLeafSelect={onLeafSelect} />
      </FlyoutHost>
    )
  }

  /* ── Expanded sidebar, leaf section (no children to expand) ── */
  if (leafSection) {
    const isActiveLeaf = activeLeafId === section.id
    return (
      <button
        type="button"
        onClick={onSectionClick}
        className={cn(
          'group w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-[10px] transition-colors',
          isActiveLeaf ? 'bg-tp-blue-50 hover:bg-tp-blue-100' : 'hover:bg-tp-slate-50',
        )}
      >
        <span
          className={cn(
            'grid place-items-center w-10 h-10 rounded-[12px] shrink-0 transition-colors',
            isActiveLeaf ? 'bg-tp-blue-500' : 'bg-tp-slate-100 group-hover:bg-tp-slate-200',
          )}
        >
          <Icon
            size={22}
            variant={isActiveLeaf ? 'Bulk' : 'Linear'}
            color={isActiveLeaf ? '#ffffff' : 'var(--tp-slate-600)'}
          />
        </span>
        <span
          className={cn(
            'flex-1 text-[14px] leading-[20px] truncate',
            isActiveLeaf ? 'text-tp-blue-700 font-semibold' : 'text-tp-slate-700 font-medium',
          )}
          style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.28px' }}
        >
          {section.label}
        </span>
      </button>
    )
  }

  return (
    <div className="flex flex-col">
      {(() => {
        const showCollapsedActive = !expanded && containsActive
        return (
          <button
            type="button"
            onClick={onSectionClick}
            aria-expanded={expanded}
            className={cn(
              'group w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-[10px] transition-colors',
              expanded
                ? 'bg-tp-slate-50 hover:bg-tp-slate-100'
                : showCollapsedActive
                  ? 'bg-tp-blue-50 hover:bg-tp-blue-100'
                  : 'hover:bg-tp-slate-50',
            )}
          >
            <span
              className={cn(
                'grid place-items-center w-10 h-10 rounded-[12px] shrink-0 transition-colors',
                showCollapsedActive
                  ? 'bg-tp-blue-500'
                  : expanded
                    ? 'bg-tp-slate-200 group-hover:bg-tp-slate-200'
                    : 'bg-tp-slate-100 group-hover:bg-tp-slate-200',
              )}
            >
              <Icon
                size={22}
                variant={showCollapsedActive ? 'Bulk' : 'Linear'}
                color={showCollapsedActive ? '#ffffff' : 'var(--tp-slate-600)'}
              />
            </span>
            <span
              className={cn(
                'flex-1 text-[14px] leading-[20px] truncate',
                showCollapsedActive
                  ? 'text-tp-blue-700 font-semibold'
                  : 'text-tp-slate-700 font-medium',
              )}
              style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.28px' }}
            >
              {section.label}
            </span>
            <ArrowDown2
              size={14}
              color={showCollapsedActive ? 'var(--tp-blue-500)' : 'var(--tp-slate-400)'}
              className={cn('transition-transform shrink-0', expanded && 'rotate-180')}
            />
          </button>
        )
      })()}

      {expanded && (
        <div className="relative mt-1 mb-1.5 ml-[18px]">
          <span aria-hidden className="absolute left-0 top-1.5 bottom-1.5 w-px bg-tp-slate-100" />
          <div className="pl-3 flex flex-col gap-2.5">
            {(section.groups ?? []).map((group, _i, arr) => (
              <GroupBlock
                key={group.id}
                group={group}
                showTitle={arr.length > 1}
                activeLeafId={activeLeafId}
                onLeafSelect={onLeafSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────  Group + Items (Level 2)  ───────────────────────── */

function GroupBlock({
  group,
  showTitle = true,
  activeLeafId,
  onLeafSelect,
}: {
  group: NavGroup
  showTitle?: boolean
  activeLeafId: string | null
  onLeafSelect: (id: string) => void
}) {
  return (
    <div>
      {showTitle && group.title && (
        <p
          className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-tp-slate-400"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {group.title}
        </p>
      )}
      <ul className="flex flex-col gap-0.5">
        {group.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            activeLeafId={activeLeafId}
            onLeafSelect={onLeafSelect}
          />
        ))}
      </ul>
    </div>
  )
}

function ItemRow({
  item,
  activeLeafId,
  onLeafSelect,
}: {
  item: NavItem
  activeLeafId: string | null
  onLeafSelect: (id: string) => void
}) {
  const Icon = item.icon
  const hasChildren = !!item.children?.length
  const isActiveLeaf = !hasChildren && activeLeafId === item.id
  const isAncestor = hasChildren && item.children!.some((c) => c.id === activeLeafId)

  const row = (open: boolean, bind: object, ref?: React.Ref<any>) => (
    <button
      type="button"
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={() => {
        if (!hasChildren) onLeafSelect(item.id)
      }}
      {...bind}
      className={cn(
        'group/row relative w-full flex items-center gap-2 px-3 py-2 text-left transition-colors rounded-[8px]',
        isActiveLeaf || isAncestor
          ? 'bg-tp-blue-50'
          : open
            ? 'bg-tp-slate-100'
            : 'hover:bg-tp-slate-50',
      )}
      aria-haspopup={hasChildren ? 'menu' : undefined}
      aria-expanded={hasChildren ? open : undefined}
      title={item.label}
    >
      {Icon ? (
        <span className="grid place-items-center w-[28px] h-[28px] shrink-0 bg-transparent">
          <Icon
            size={18}
            variant={isActiveLeaf || isAncestor ? 'Bulk' : 'Linear'}
            color={isActiveLeaf || isAncestor ? 'var(--tp-blue-500)' : 'var(--tp-slate-600)'}
          />
        </span>
      ) : null}
      <span
        className={cn(
          'flex-1 text-[14px] leading-[20px] truncate',
          isActiveLeaf
            ? 'text-tp-blue-600 font-semibold'
            : isAncestor
              ? 'text-tp-blue-500 font-semibold'
              : 'text-tp-slate-700 font-medium',
        )}
        style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.24px' }}
      >
        {item.label}
      </span>
      {hasChildren && (
        <ArrowRight2
          size={14}
          color={isActiveLeaf || isAncestor ? 'var(--tp-blue-500)' : 'var(--tp-slate-400)'}
          className="shrink-0"
        />
      )}
    </button>
  )

  return (
    <li>
      {hasChildren ? (
        <FlyoutHost
          offset={10}
          anchor={(open, bind, ref) => row(open, bind, ref)}
        >
          <SubItemList
            title={item.label}
            items={item.children!}
            activeLeafId={activeLeafId}
            onLeafSelect={onLeafSelect}
          />
        </FlyoutHost>
      ) : (
        row(false, {})
      )}
    </li>
  )
}

/* ─────────────────────────  Section Flyout (collapsed mode)  ───────────────────────── */

function SectionFlyout({
  section,
  activeLeafId,
  onLeafSelect,
}: {
  section: RailSection
  activeLeafId: string | null
  onLeafSelect: (id: string) => void
}) {
  return (
    <div className="relative">
      <div
        className="relative w-[240px] max-h-[72vh] overflow-y-auto rounded-[12px] bg-tp-slate-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ boxShadow: '0 10px 24px rgba(23, 23, 37, 0.12), 0 1px 2px rgba(23,23,37,0.05)' }}
      >
        {/* Section heading — small uppercase neutral label */}
        <div className="px-3 pt-3 pb-1.5">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.10em] text-tp-slate-400"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {section.label}
          </p>
        </div>
        <div className="px-2 pb-2.5 flex flex-col gap-3">
          {(section.groups ?? []).map((group, _i, arr) => (
            <div key={group.id}>
              {arr.length > 1 && group.title && (
                <p
                  className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.10em] text-tp-slate-400"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {group.title}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <FlyoutItem
                    key={item.id}
                    item={item}
                    activeLeafId={activeLeafId}
                    onLeafSelect={onLeafSelect}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FlyoutItem({
  item,
  activeLeafId,
  onLeafSelect,
}: {
  item: NavItem
  activeLeafId: string | null
  onLeafSelect: (id: string) => void
}) {
  const Icon = item.icon
  const hasChildren = !!item.children?.length
  const isActiveLeaf = !hasChildren && activeLeafId === item.id
  const isAncestor = hasChildren && item.children!.some((c) => c.id === activeLeafId)

  const buttonClass = cn(
    'group/fitem w-full flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-left transition-colors',
    isActiveLeaf || isAncestor
      ? 'bg-tp-blue-50'
      : 'hover:bg-tp-slate-50',
  )

  const iconChip = Icon ? (
    <span className="grid place-items-center w-[28px] h-[28px] shrink-0 bg-transparent">
      <Icon
        size={18}
        variant={isActiveLeaf || isAncestor ? 'Bulk' : 'Linear'}
        color={isActiveLeaf || isAncestor ? 'var(--tp-blue-500)' : 'var(--tp-slate-600)'}
      />
    </span>
  ) : null

  const label = (
    <span
      className={cn(
        'flex-1 text-[12px] leading-[20px] truncate',
        isActiveLeaf
          ? 'text-tp-blue-600 font-semibold'
          : isAncestor
            ? 'text-tp-blue-500 font-semibold'
            : 'text-tp-slate-700 font-medium',
      )}
      style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.20px' }}
    >
      {item.label}
    </span>
  )

  if (hasChildren) {
    return (
      <li>
        <FlyoutHost
          offset={8}
          anchor={(_open, bind, ref) => (
            <button
              type="button"
              ref={ref as React.RefObject<HTMLButtonElement>}
              {...bind}
              className={buttonClass}
              title={item.label}
            >
              {iconChip}
              {label}
              <ArrowRight2
                size={12}
                color={isAncestor ? 'var(--tp-slate-600)' : 'var(--tp-slate-400)'}
                className="shrink-0"
              />
            </button>
          )}
        >
          <SubItemList
            title={item.label}
            items={item.children!}
            activeLeafId={activeLeafId}
            onLeafSelect={onLeafSelect}
          />
        </FlyoutHost>
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => onLeafSelect(item.id)}
        className={buttonClass}
        title={item.label}
      >
        {iconChip}
        {label}
      </button>
    </li>
  )
}

function SubItemList({
  title,
  items,
  activeLeafId,
  onLeafSelect,
}: {
  title?: string
  items: NavLeaf[]
  activeLeafId: string | null
  onLeafSelect: (id: string) => void
}) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute left-[-5px] top-3 w-2.5 h-2.5 rotate-45 bg-tp-slate-0"
        style={{ boxShadow: '-1px 1px 1px rgba(23, 23, 37, 0.04)' }}
      />
      <div
        className="relative w-[200px] max-h-[60vh] flex flex-col rounded-[12px] bg-tp-slate-0 overflow-hidden"
        style={{ boxShadow: '0 10px 24px rgba(23, 23, 37, 0.10), 0 1px 2px rgba(23,23,37,0.04)' }}
      >
        {title && (
          <div className="px-3 pt-2.5 pb-1">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.10em] text-tp-slate-400"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </p>
          </div>
        )}
        <ul className="flex-1 min-h-0 overflow-y-auto py-1.5 px-1 flex flex-col [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {items.map((leaf) => {
            const active = activeLeafId === leaf.id
            const LeafIcon = leaf.icon
            return (
              <li key={leaf.id}>
                <button
                  type="button"
                  onClick={() => onLeafSelect(leaf.id)}
                  className={cn(
                    'w-full flex items-center gap-2 text-left text-[12px] leading-[20px] px-2.5 py-2 rounded-[8px] transition-colors',
                    active
                      ? 'bg-tp-blue-50 text-tp-blue-500 font-semibold'
                      : 'text-tp-slate-700 hover:bg-tp-slate-50 hover:text-tp-slate-900',
                  )}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {LeafIcon && (
                    <span className="grid place-items-center w-[24px] h-[24px] shrink-0">
                      <LeafIcon
                        size={16}
                        variant={active ? 'Bulk' : 'Linear'}
                        color={active ? 'var(--tp-blue-500)' : 'var(--tp-slate-500)'}
                      />
                    </span>
                  )}
                  <span className="flex-1 truncate">{leaf.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/* ─────────────────────────  FlyoutHost  ───────────────────────── */

interface FlyoutBind {
  onMouseEnter: () => void
  onMouseLeave: () => void
  onFocus: () => void
  onBlur: () => void
}

function FlyoutHost({
  anchor,
  children,
  offset = 8,
}: {
  anchor: (open: boolean, bind: FlyoutBind, ref: React.RefObject<HTMLElement>) => React.ReactNode
  children: React.ReactNode
  offset?: number
}) {
  const triggerRef = useRef<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 160)
  }
  const openNow = () => {
    cancelClose()
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      setCoords({ left: r.right + offset, top: r.top })
    }
    setOpen(true)
  }

  useLayoutEffect(() => {
    if (!open) return
    const update = () => {
      if (triggerRef.current) {
        const r = triggerRef.current.getBoundingClientRect()
        setCoords({ left: r.right + offset, top: r.top })
      }
    }
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, offset])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      cancelClose()
    }
  }, [])

  const bind: FlyoutBind = {
    onMouseEnter: openNow,
    onMouseLeave: scheduleClose,
    onFocus: openNow,
    onBlur: scheduleClose,
  }

  return (
    <>
      {anchor(open, bind, triggerRef as React.RefObject<HTMLElement>)}
      {mounted && open && coords
        ? createPortal(
            <div
              role="menu"
              className="fixed z-[60]"
              style={{
                left: coords.left,
                top: Math.max(8, coords.top - 4),
              }}
              onMouseEnter={openNow}
              onMouseLeave={scheduleClose}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

/* ─────────────────────────  Helpers  ───────────────────────── */

function isLeafSection(section: RailSection): boolean {
  const groups = section.groups ?? []
  return groups.length === 0 || groups.every((g) => g.items.length === 0)
}

function sectionContainsLeaf(section: RailSection, leafId: string | null): boolean {
  if (!leafId) return false
  if (isLeafSection(section)) return section.id === leafId
  for (const g of section.groups ?? []) {
    for (const it of g.items) {
      if (it.id === leafId) return true
      if (it.children?.some((c) => c.id === leafId)) return true
    }
  }
  return false
}

function filterSections(sections: RailSection[], q: string): RailSection[] {
  const query = q.trim().toLowerCase()
  if (!query) return sections
  const out: RailSection[] = []
  for (const s of sections) {
    if (s.label.toLowerCase().includes(query)) {
      out.push(s)
      continue
    }
    if (isLeafSection(s)) continue
    const groups: NavGroup[] = []
    for (const g of s.groups ?? []) {
      const items: NavItem[] = []
      for (const it of g.items) {
        const itMatch = it.label.toLowerCase().includes(query)
        const kids = it.children?.filter((c) => c.label.toLowerCase().includes(query)) ?? []
        if (itMatch || kids.length) {
          items.push({ ...it, children: kids.length ? kids : it.children })
        }
      }
      if (items.length) groups.push({ ...g, items })
    }
    if (groups.length) out.push({ ...s, groups })
  }
  return out
}

function filterByPermissions(
  sections: RailSection[],
  hasPermission?: PermissionPredicate,
): RailSection[] {
  if (!hasPermission) return sections
  const allowed = (perm?: string) => !perm || hasPermission(perm)
  const out: RailSection[] = []
  for (const s of sections) {
    if (!allowed(s.permission)) continue
    const wasLeaf = isLeafSection(s)
    const newGroups: NavGroup[] = []
    for (const g of s.groups ?? []) {
      const items: NavItem[] = []
      for (const it of g.items) {
        if (!allowed(it.permission)) continue
        const kids = it.children?.filter((c) => allowed(c.permission))
        if (it.children && (!kids || kids.length === 0)) continue
        items.push({ ...it, children: kids })
      }
      if (items.length) newGroups.push({ ...g, items })
    }
    // If the section had children originally but everything was filtered out, hide it.
    if (!wasLeaf && newGroups.length === 0) continue
    out.push({ ...s, groups: newGroups })
  }
  return out
}
