import type { ComponentType } from 'react'

export type IconComp = ComponentType<{ size?: number | string; color?: string; variant?: 'Linear' | 'Bulk' | 'Bold' | 'Outline' | 'TwoTone'; className?: string }>

/** Predicate the shell calls to decide whether to render a node. */
export type PermissionPredicate = (permission: string) => boolean

export interface NavLeaf {
  id: string
  label: string
  icon?: IconComp
  /** Backend-driven permission token. Hidden when predicate returns false. */
  permission?: string
}

export interface NavItem {
  id: string
  label: string
  icon?: IconComp
  badge?: string | number
  children?: NavLeaf[]
  permission?: string
}

export interface NavGroup {
  id: string
  title: string
  items: NavItem[]
}

export interface RailSection {
  id: string
  label: string
  icon: IconComp
  /** Optional: omit/leave empty to render this section as a leaf (no expand). */
  groups?: NavGroup[]
  permission?: string
}
