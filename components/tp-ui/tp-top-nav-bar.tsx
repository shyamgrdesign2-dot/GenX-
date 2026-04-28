"use client"

import * as React from "react"
import {
  ArrowLeft,
  Eye,
  FileText,
  LogIn,
  MoreVertical,
  ChevronDown,
  User,
  Save,
  LayoutTemplate,
  StickyNote,
} from "lucide-react"
import { Notification, Setting2, ArrowDown2 as IxArrowDown } from "iconsax-reactjs"
import { Bell, Settings } from "lucide-react"
import { TutorialPlayIcon } from "@/components/tp-ui/TutorialPlayIcon"
import { cn } from "@/lib/utils"

/* ============================================================================
 * DEV NOTE — TPTopNavBar  (components/tp-ui/tp-top-nav-bar.tsx)
 * ============================================================================
 *
 * OVERVIEW
 * ────────
 * A 62 px fixed-height application header that comes in two variants:
 *
 *   variant="default"   — Home / module shell.
 *                         Logo + optional app-tag pill on the left.
 *                         Toolbar icons + clinic switcher + avatar on the right.
 *
 *   variant="clinical"  — RxPad / clinical workflow.
 *                         Back button + patient context on the left.
 *                         Action buttons (Preview / Draft / End Visit) on the right.
 *
 * ─── TOOLBAR ICON BUTTONS  (ToolbarIconButton)  ──────────────────────────────
 * Every tappable icon in the toolbar uses the same 42 × 42 px tile:
 *
 *   • Background  : bg-tp-slate-100 (grey chip), hover → bg-tp-slate-200
 *   • Border-radius: 10.5 px  (rounded-[10.5px])
 *   • Icon size   : 24 px, stroke 1.5 px (Linear variant) or filled (Bulk)
 *   • Padding     : 8.4 px (icon is optically centred inside the chip)
 *
 * Composition rules:
 *   1. Icon-only    →  just pass the icon as children; add aria-label.
 *   2. Icon + text  →  wrap in a <button> with `flex items-center gap-2`
 *                      and include the text as a sibling <span>.
 *                      See the "Preview" / "Draft" buttons in the clinical variant.
 *   3. Icon + badge →  pass `badge` prop; a 10.5 px red dot appears top-right.
 *   4. Dropdown     →  add an <ArrowDown2> (size 16) after the label text.
 *                      See the ClinicDropdown pattern below.
 *
 * ─── CLINIC DROPDOWN BUTTON  ─────────────────────────────────────────────────
 * The clinic switcher is a wide icon-button that follows the same tile style
 * but has a variable-width text label and a chevron:
 *
 *   <ClinicPinIcon size={24} />  ←  24 px, strokeWidth 1.5
 *   <span>{clinicName}</span>
 *   <ArrowDown2 size={16} />
 *
 * On viewports < md the text + chevron are hidden so only the icon chip shows.
 * To customise the clinic list, wire `clinicName` from a server-fetched list
 * and add an onClick handler that opens a <Popover> or <DropdownMenu>.
 *
 * ─── PROFILE AVATAR — THREE VARIANTS  ────────────────────────────────────────
 * The 42 × 42 px avatar circle at the far-right supports three display modes.
 * Choose based on what you have at runtime:
 *
 *   A. Photo URL  →  pass `profile.avatarUrl`
 *      Renders an <img> that covers the circle with object-cover.
 *
 *   B. Initials   →  pass `profile.initials` (e.g. "MR")
 *      Renders a 2-letter monogram inside the circle using tp-slate-700.
 *      Example:
 *        profile={{ name: 'Musfiq Rizwan', initials: 'MR' }}
 *      (Wire up initials extraction: `name.split(' ').map(w => w[0]).join('').slice(0,2)`)
 *
 *   C. Default icon  →  pass neither avatarUrl nor initials
 *      Renders `<ProfileBulkIcon>` — a silhouette person SVG in tp-slate-700.
 *
 * To extend: add an onClick to the avatar div and show a <DropdownMenu> with
 * "Profile", "Logout", etc.
 *
 * ─── APP TAG PILL  ────────────────────────────────────────────────────────────
 * Pass `appTag={{ label: 'Pharma', icon: <Pill size={14} ... /> }}` to render a
 * violet shimmer pill next to the logo that tells the user which module they're in.
 * Omit the prop entirely on screens where no product context is needed (e.g. login).
 *
 * ─── DESIGN TOKENS  ──────────────────────────────────────────────────────────
 *   Height          62px  (hard-coded; do not change — matches Figma spec)
 *   Logo height     32px
 *   Icon size       24px, stroke 1.5px
 *   Icon tile       42 × 42 px, rounded-[10.5px], bg-tp-slate-100
 *   Badge dot       10.5 × 10.5 px, #E11D48, 1.05px white border
 *   Gradient divider 1.05px wide, 42px tall, fades to transparent at both ends
 *   Font            var(--font-sans) / Inter
 *
 * ─── PROPS REFERENCE  ────────────────────────────────────────────────────────
 *   variant         "default" | "clinical"         default: "default"
 *   clinicName      string                         clinic label in the dropdown
 *   profile         { name, avatarUrl?, initials? } drives avatar rendering
 *   appTag          { label, icon? }               module pill next to logo
 *   actions         NavAction[]                    extra toolbar icon buttons
 *   patient         { name, age, gender, ... }     clinical variant only
 *   onBack          () => void                     clinical back-button handler
 *   className       string                         extra classes on <header>
 *
 * ─── EXTENDING THE TOOLBAR  ──────────────────────────────────────────────────
 * For one-off icon buttons (e.g. Help, AI, Theme toggle) use <ToolbarIconButton>
 * directly — it is exported from this file:
 *
 *   import { ToolbarIconButton } from '@/components/tp-ui/tp-top-nav-bar'
 *   <ToolbarIconButton label="Help" onClick={openHelp}>
 *     <InfoCircle size={24} variant="Linear" color="var(--tp-slate-700)" />
 *   </ToolbarIconButton>
 *
 * ============================================================================ */

/**
 * TPTopNavBar — TP Design System application header.
 *
 * See the DEV NOTE block above for full usage guidance, variant descriptions,
 * icon-button rules, avatar variants, and design token reference.
 */

interface NavAction {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  badge?: number
  /** Text label shown next to icon (e.g., "Preview") */
  text?: string
  /** Button variant for styled actions */
  variant?: "default" | "outline" | "primary"
}

interface TPTopNavBarProps {
  variant?: "default" | "clinical"
  /** Left section content */
  leftContent?: React.ReactNode
  /** App title */
  title?: string
  subtitle?: string
  /** Action icons in the right area */
  actions?: NavAction[]
  /** Profile display */
  profile?: {
    name: string
    avatarUrl?: string
    initials?: string
  }
  /** Patient context — shown in clinical variant */
  patient?: {
    name: string
    age: number
    gender: string
    bloodGroup?: string
    uhid?: string
  }
  /** Clinic name for dropdown */
  clinicName?: string
  /** Back button handler (clinical variant) */
  onBack?: () => void
  /** Optional search area */
  showSearch?: boolean
  onSearchClick?: () => void
  /** Mobile hamburger */
  onMenuClick?: () => void
  className?: string
  /** Optional pill badge displayed beside the logo to communicate which
   *  product/app the user is currently inside (e.g. "Master", "Pharma"). */
  appTag?: { label: string; icon?: React.ReactNode }
}

/* ── App tag pill (violet shimmer, no stroke) ── */
function AppTagPill({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold text-tp-violet-700"
      style={{
        fontFamily: "var(--font-sans)",
        letterSpacing: "-0.1px",
        backgroundImage:
          "linear-gradient(135deg, var(--tp-violet-50) 0%, var(--tp-violet-100) 60%, var(--tp-violet-50) 100%)",
      }}
    >
      {icon}
      <span>{label}</span>
    </span>
  )
}

/* ── Profile avatar icon (Bulk variant) ── */
function ProfileBulkIcon({ size = 26, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path opacity="0.4" d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill={color} />
      <path d="M12 14.5C6.99 14.5 2.91 17.86 2.91 22C2.91 22.28 3.13 22.5 3.41 22.5H20.59C20.87 22.5 21.09 22.28 21.09 22C21.09 17.86 17.01 14.5 12 14.5Z" fill={color} />
    </svg>
  )
}

/* ── Clinic / hospital building icon ── */
function ClinicPinIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 22H22" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 2H7C4 2 3 3.79 3 6V22H21V6C21 3.79 20 2 17 2Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.06 15H9.92998C9.41998 15 8.98999 15.42 8.98999 15.94V22H14.99V15.94C15 15.42 14.58 15 14.06 15Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6V11" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 8.5H14.5" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Divider matching Figma exactly ── */
function NavDivider() {
  return (
    <div
      className="shrink-0 opacity-80"
      style={{
        width: "1.05px",
        height: 42,
        background:
          "linear-gradient(to bottom, rgba(208,213,221,0.2) 0%, #d0d5dd 50%, rgba(208,213,221,0.2) 100%)",
      }}
    />
  )
}

/* ── Icon button (42px container) — exported so teams can add one-off icons ── */
export function ToolbarIconButton({
  children,
  label,
  onClick,
  badge,
  className: extraClass,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
  badge?: number
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex shrink-0 items-center justify-center bg-tp-slate-100 hover:bg-tp-slate-200 rounded-[10.5px] transition-colors",
        extraClass,
      )}
      style={{ width: 42, height: 42, padding: "8.4px" }}
      aria-label={label}
    >
      {children}
      {badge != null && badge > 0 && (
        <span
          className="absolute flex items-center justify-center"
          style={{
            width: 10.5,
            height: 10.5,
            top: -1.14,
            right: -1.14,
            borderRadius: "50%",
            backgroundColor: "#E11D48",
            border: "1.05px solid white",
          }}
        />
      )}
    </button>
  )
}

export function TPTopNavBar({
  variant = "default",
  leftContent,
  title,
  subtitle,
  actions = [],
  profile,
  patient,
  clinicName = "Rajeshwar eye clinic",
  onBack,
  showSearch = false,
  onSearchClick,
  onMenuClick,
  className,
  appTag,
}: TPTopNavBarProps) {
  // ── Clinical / RxPad variant ──
  if (variant === "clinical") {
    return (
      <header
        className={cn("relative flex shrink-0 items-center bg-white", className)}
        style={{ height: 62 }}
        data-name="Rxpad_Header"
      >
        <div className="flex items-center gap-[16px] pr-[16px] py-[10px] size-full">
          {/* Back button — 80px panel */}
          <button
            type="button"
            onClick={onBack}
            className="relative flex shrink-0 items-center justify-center bg-white"
            style={{
              width: 80,
              height: 60,
              padding: "20px 15px",
              borderRight: "0.5px solid #f1f1f5",
              borderBottom: "0.5px solid #f1f1f5",
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={24} color="#454551" />
          </button>

          {/* Patient info */}
          <div className="flex flex-1 items-center min-h-px min-w-[280px]">
            <div className="flex items-center gap-[6px] shrink-0">
              {/* Avatar */}
              <div
                className="relative flex shrink-0 items-center justify-center bg-[#f1f1f5] rounded-full"
                style={{ width: 40, height: 40 }}
              >
                <User size={22} color="#545460" />
              </div>

              {/* Name + age */}
              <div className="flex flex-col items-start shrink-0" style={{ width: 108 }}>
                <div className="flex items-center gap-[2px] w-full">
                  <p
                    className="shrink-0 text-[#454551]"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: 150,
                      lineHeight: "normal",
                    }}
                  >
                    {patient?.name || "Patient Name"}
                  </p>
                  <ChevronDown size={16} color="#454551" className="shrink-0" />
                </div>
                <div
                  className="flex items-start w-full"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 400,
                    fontSize: 12,
                    lineHeight: "18px",
                    letterSpacing: "0.1px",
                  }}
                >
                  <span className="shrink-0 text-[#454551]">
                    {patient?.gender || "M"}
                  </span>
                  <span className="shrink-0 text-[#e2e2ea] text-center w-[8px]">|</span>
                  <span className="shrink-0 text-[#454551]">
                    {patient?.age ? `${patient.age}y` : "25y"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar actions */}
          <div className="flex items-center gap-[14px] shrink-0">
            {/* Tutorial icon */}
            <div className="shrink-0 flex items-center justify-center" style={{ width: 42, height: 42 }}>
              <TutorialPlayIcon size={28} />
            </div>

            <NavDivider />

            {/* Template */}
            <ToolbarIconButton label="Template">
              <LayoutTemplate size={20} color="#454551" />
            </ToolbarIconButton>

            {/* Save */}
            <ToolbarIconButton label="Save">
              <Save size={20} color="#454551" />
            </ToolbarIconButton>

            {/* Customisation */}
            <ToolbarIconButton label="Customisation">
              <Settings size={20} color="#454551" />
            </ToolbarIconButton>

            {/* Custom Canvas */}
            <ToolbarIconButton label="Custom Canvas" badge={1}>
              <StickyNote size={20} color="#454551" />
            </ToolbarIconButton>

            <NavDivider />

            {/* Preview */}
            <button
              type="button"
              className="flex shrink-0 items-center justify-center gap-[6.3px] bg-[#f1f1f5] rounded-[10.5px]"
              style={{ height: 42, padding: "8px 16px" }}
            >
              <Eye size={20} color="#454551" />
              <span
                className="shrink-0 text-center text-[#454551]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "14.7px",
                  lineHeight: "normal",
                }}
              >
                Preview
              </span>
            </button>

            {/* Draft */}
            <button
              type="button"
              className="relative flex shrink-0 items-center justify-center gap-[6.3px] rounded-[10.5px]"
              style={{
                height: 42,
                padding: "8px 16px",
                border: "1.05px solid #4b4ad5",
                borderRadius: "11.025px",
              }}
            >
              <FileText size={20} color="#4B4AD5" />
              <span
                className="shrink-0 text-center text-[#4b4ad5]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "14.7px",
                  lineHeight: "normal",
                }}
              >
                Draft
              </span>
            </button>

            {/* End Visit */}
            <button
              type="button"
              className="flex shrink-0 items-center justify-center gap-[6.3px] bg-[#4b4ad5] rounded-[10.5px]"
              style={{ height: 42, padding: "8px 16px" }}
            >
              <LogIn size={20} color="white" />
              <span
                className="shrink-0 text-center text-white"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "14.7px",
                  lineHeight: "normal",
                }}
              >
                End
              </span>
            </button>

            {/* More options */}
            <div className="flex shrink-0 items-center justify-center" style={{ width: 25.2, height: 25.2 }}>
              <MoreVertical size={20} color="#454551" />
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: "0.5px", backgroundColor: "#f1f1f5" }}
        />
      </header>
    )
  }

  // ── Default / Home variant ──
  return (
    <header
      className={cn("relative z-10 flex shrink-0 items-center bg-white", className)}
      style={{ height: 62 }}
      data-name="Home_Header"
    >
      <div className="flex items-center gap-[16px] px-[18px] py-[10px] size-full">
        {/* ── Left: Brand Logo + optional app tag ── */}
        <div className="flex flex-1 items-center gap-2.5 min-h-px min-w-0 overflow-hidden">
          {leftContent ? (
            leftContent
          ) : (
            <div className="relative shrink-0 flex items-center" style={{ height: 32 }}>
              <img
                src="/tatva-practice-logo.svg"
                alt="TatvaPractice"
                style={{ height: 32, width: 'auto' }}
              />
            </div>
          )}
          {appTag && <AppTagPill label={appTag.label} icon={appTag.icon} />}
        </div>

        {/* ── Right: Toolbar ── */}
        <div className="flex items-center gap-[14px] shrink-0">
          {/* Notifications */}
          <ToolbarIconButton label="Notifications" badge={3}>
            <Notification size={24} variant="Linear" color="var(--tp-slate-700)" />
          </ToolbarIconButton>

          {/* Settings */}
          <ToolbarIconButton label="Settings">
            <Setting2 size={24} variant="Linear" color="var(--tp-slate-700)" />
          </ToolbarIconButton>

          {/* Clinic dropdown */}
          <button
            type="button"
            className="flex shrink-0 items-center justify-center gap-[6.3px] bg-tp-slate-100 hover:bg-tp-slate-200 rounded-[10.5px] transition-colors"
            style={{ height: 42, padding: "8px 16px" }}
            title={clinicName}
          >
            <ClinicPinIcon size={24} color="var(--tp-slate-700)" />
            <div className="hidden md:flex items-center" style={{ maxWidth: 138.6 }}>
              <span
                className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "normal",
                  color: "var(--tp-slate-700)",
                }}
              >
                {clinicName}
              </span>
            </div>
            <IxArrowDown size={16} variant="Linear" color="var(--tp-slate-700)" className="hidden md:block" />
          </button>

          {/* Profile avatar
               Variant A — photo:    profile.avatarUrl is set → shows <img>
               Variant B — initials: profile.initials is set  → shows 2-letter monogram
               Variant C — default:  neither set              → shows silhouette icon */}
          {profile && (
            <div
              className="relative shrink-0 flex items-center justify-center rounded-full overflow-hidden bg-tp-slate-100"
              style={{
                width: 42,
                height: 42,
                outline: '2px solid #ffffff',
                outlineOffset: '1.5px',
              }}
              title={profile.name}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
              ) : profile.initials ? (
                <span
                  className="text-[14px] font-semibold text-tp-slate-700 select-none"
                  style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.3px" }}
                  aria-label={profile.name}
                >
                  {profile.initials.slice(0, 2).toUpperCase()}
                </span>
              ) : (
                <ProfileBulkIcon size={28} color="var(--tp-slate-700)" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom border */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ bottom: -1, height: 1, backgroundColor: "var(--tp-slate-50)" }}
      />
    </header>
  )
}

/**
 * Default action configurations for common use cases.
 */
export function defaultNavActions(): NavAction[] {
  return [
    {
      icon: <Bell size={20} color="#454551" />,
      label: "Notifications",
      badge: 3,
    },
    {
      icon: <Settings size={20} color="#454551" />,
      label: "Settings",
    },
  ]
}
