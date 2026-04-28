import {
  Profile2User,
  Chart,
  ReceiptItem,
  Profile,
  Receipt2,
  Warning2,
  Box,
  Box1,
  Hierarchy,
  Hierarchy2,
  Setting2,
  TagUser,
  ShieldTick,
  Personalcard,
  Diagram,
  Building,
  Building3,
  TruckFast,
  Tag,
  Truck,
  ShoppingCart,
  DocumentSketch,
  BoxTick,
  Convertshape2,
  Note1,
  DocumentText,
  Activity,
  UserSquare,
  Layer,
} from 'iconsax-reactjs'
import { Pill, DashboardPieIcon, UserSettings } from './icons'
import type { RailSection } from './types'

/**
 * Pharma module sidebar configuration.
 *
 * Top-level sections (siblings):
 *   • Dashboard          (leaf)
 *   • Patient            (leaf)
 *   • Pharmacy           (leaf)
 *   • Reports            — Today's Medication Shell, User Base,
 *                          Cash Collection, Stock Snapshot
 *   • SEM                — Intense Issues, Conceptions, Stock Ledges, …
 *   • Master             — Branch, Store, Item Master, …
 *   • User Settings      — Users, Roles, Permissions, …
 */
export const PHARMA_NAV_CONFIG: RailSection[] = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardPieIcon },
  { id: 'patient', label: 'Patient', icon: Profile2User },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill },

  {
    id: 'reports',
    label: 'Reports',
    icon: Chart,
    groups: [
      {
        id: 'reports-flow',
        title: 'Reports',
        items: [
          { id: 'todays-medication-shell', label: "Today's Medication Shell", icon: ReceiptItem },
          { id: 'user-base', label: 'User Base', icon: Profile },
          { id: 'cash-collection', label: 'Cash Collection', icon: Receipt2 },
          { id: 'stock-snapshot', label: 'Stock Snapshot', icon: Warning2 },
        ],
      },
    ],
  },

  {
    id: 'sem',
    label: 'SEM',
    icon: Activity,
    groups: [
      {
        id: 'sem-flow',
        title: 'SEM',
        items: [
          { id: 'intense-issues', label: 'Intense Issues', icon: Warning2 },
          { id: 'conceptions', label: 'Conceptions', icon: Note1 },
          { id: 'stock-ledges', label: 'Stock Ledges', icon: DocumentText },
          { id: 'transfers', label: 'Transfers', icon: Truck },
          { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
          { id: 'rate-contracts', label: 'Rate Contracts', icon: DocumentSketch },
          { id: 'grn', label: 'G.R.N.', icon: BoxTick },
          { id: 'purchase-returns', label: 'Purchase Returns', icon: Convertshape2 },
          { id: 'current-stock', label: 'Current Stock', icon: Box },
          { id: 'open-stock', label: 'Open Stock', icon: Box1 },
          { id: 'label-barcode-settings', label: 'Label & Barcode Settings', icon: Tag },
        ],
      },
    ],
  },

  {
    id: 'pharma-master',
    label: 'Master',
    icon: Hierarchy2,
    groups: [
      {
        id: 'pharma-master-flow',
        title: 'Master',
        items: [
          { id: 'pharma-branch', label: 'Branch', icon: Building },
          { id: 'pharma-store', label: 'Store', icon: Building3 },
          { id: 'pharma-item-master', label: 'Item Master', icon: Box },
          { id: 'pharma-item-mapping', label: 'Item Mapping', icon: Layer },
          { id: 'pharma-vendors', label: 'Vendors', icon: TruckFast },
          { id: 'pharma-generic-master', label: 'Generic Master', icon: Hierarchy },
        ],
      },
    ],
  },

  {
    id: 'user-settings',
    label: 'User Settings',
    icon: UserSettings,
    groups: [
      {
        id: 'user-settings-flow',
        title: 'User Settings',
        items: [
          { id: 'users', label: 'Users', icon: Profile2User },
          { id: 'user-role-masters', label: 'User Role Masters', icon: TagUser },
          { id: 'permission-masters', label: 'Permission Masters', icon: ShieldTick },
          { id: 'user-roles', label: 'User Roles', icon: Personalcard },
          { id: 'role-permissions', label: 'Role Permissions', icon: ShieldTick },
          { id: 'user-permissions', label: 'User Permissions', icon: ShieldTick },
          { id: 'role-default-stats', label: 'Role Default Stats', icon: Diagram },
        ],
      },
    ],
  },
]

// Re-export a token map so docs can show the canonical permission strings.
export const PHARMA_PERMISSIONS = {
  ADMIN_ALL: 'pharma.admin',
  REPORTS_VIEW: 'pharma.reports.view',
  USER_SETTINGS_MANAGE: 'pharma.user-settings.manage',
} as const
