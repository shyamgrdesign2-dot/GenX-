import {
  Building,
  Building4,
  Hospital,
  People,
  ShieldTick,
  Setting2,
  House2,
  Activity,
  Box1,
  Box,
  Personalcard,
  Profile2User,
  CardEdit,
  Calendar,
  Calendar2,
  ClipboardText,
  TaskSquare,
  Diagram,
  Receipt2,
  ReceiptItem,
  Truck,
  TruckFast,
  ShoppingCart,
  Bag2,
  BoxTick,
  Convertshape2,
  Warning2,
  DocumentText1,
  DocumentText,
  DocumentSketch,
  Note1,
  Heart,
  HeartCircle,
  Stickynote,
  Health,
  Maximize3,
  Tag,
  TagUser,
  TagCross,
  Layer,
  Code,
  Hierarchy,
  Briefcase,
  CodeCircle,
  Building3,
} from 'iconsax-reactjs'
import type { RailSection } from './types'

// iconsax sometimes ships an icon under a slightly different name; alias to a verified one.
const HospitalSafe = Hospital

export const NAV_CONFIG: RailSection[] = [
  /* ────────────────────────────  1. Facility  ──────────────────────────── */
  {
    id: 'facility',
    label: 'Facility',
    icon: Building,
    groups: [
      {
        id: 'facility-master',
        title: 'Facility Master',
        items: [
          {
            id: 'facility-setup',
            label: 'Facility SetUp',
            icon: Building4,
            children: [
              { id: 'organization', label: 'Organization', icon: Building },
              { id: 'department', label: 'Department', icon: Hierarchy },
              { id: 'wing-floor-ward', label: 'Wing / Floor / Ward', icon: Building3 },
              { id: 'profit-center', label: 'Profit Center', icon: Briefcase },
              { id: 'ot-room', label: 'OT Room', icon: Diagram },
              { id: 'room', label: 'Room', icon: House2 },
              { id: 'bed-category-charges', label: 'Bed Category & Charges', icon: Tag },
              { id: 'bed', label: 'Bed', icon: HospitalSafe },
              { id: 'bed-layout-designer', label: 'Bed Layout Designer', icon: Maximize3 },
            ],
          },
          {
            id: 'provider-community-setup',
            label: 'Provider Community Setup',
            icon: People,
            children: [
              { id: 'employee', label: 'Employee', icon: Personalcard },
              { id: 'supplier', label: 'Supplier', icon: TruckFast },
              { id: 'manufacturer', label: 'Manufacturer', icon: Building3 },
            ],
          },
          {
            id: 'security-identity',
            label: 'Security & Identity',
            icon: ShieldTick,
            children: [
              { id: 'user-management', label: 'User Management', icon: Profile2User },
              { id: 'role-management', label: 'Role Management', icon: TagUser },
            ],
          },
          {
            id: 'configurations',
            label: 'Configurations',
            icon: Setting2,
            children: [
              { id: 'facility-configuration', label: 'Facility Configuration', icon: Setting2 },
              { id: 'document-series-configuration', label: 'Document Series Configuration', icon: DocumentText1 },
            ],
          },
        ],
      },
    ],
  },

  /* ────────────────────────────  2. Operational  ──────────────────────────── */
  {
    id: 'operational',
    label: 'Operational',
    icon: Activity,
    groups: [
      {
        id: 'operational-flow',
        title: 'Operational',
        items: [
          { id: 'appointment-management', label: 'Appointment Management', icon: Calendar2 },
          { id: 'registration', label: 'Registration / Patient Management', icon: Profile2User },
          { id: 'billing', label: 'Billing / Cash Management', icon: ReceiptItem },
          { id: 'queue-management', label: 'Queue Management', icon: TaskSquare },
          { id: 'adt', label: 'Admission / Discharge / Transfer', icon: House2 },
          { id: 'scheduling', label: 'Scheduling', icon: Calendar },
          { id: 'service-management', label: 'Service Management', icon: Briefcase },
          { id: 'package-management', label: 'Package Management', icon: Layer },
          { id: 'insurance-tpa', label: 'Insurance / TPA Handling', icon: ShieldTick },
        ],
      },
    ],
  },

  /* ────────────────────────────  3. Inventory  ──────────────────────────── */
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Bag2,
    groups: [
      {
        id: 'inventory-flow',
        title: 'Inventory',
        items: [
          { id: 'item-master', label: 'Item Master', icon: Box },
          { id: 'category-subcategory', label: 'Category / Subcategory', icon: Hierarchy },
          { id: 'supplier-mapping', label: 'Supplier Mapping', icon: Bag2 },
          { id: 'purchase-order', label: 'Purchase Order', icon: ShoppingCart },
          { id: 'goods-receipt', label: 'Goods Receipt (GRN)', icon: TruckFast },
          { id: 'stock-management', label: 'Stock Management', icon: BoxTick },
          { id: 'batch-expiry', label: 'Batch / Expiry Tracking', icon: Warning2 },
          { id: 'issue-consumption', label: 'Issue / Consumption', icon: DocumentText },
          { id: 'store-warehouse', label: 'Store / Warehouse Management', icon: Building3 },
          { id: 'stock-transfer', label: 'Stock Transfer', icon: Truck },
          { id: 'returns', label: 'Returns (Purchase / Sales)', icon: Convertshape2 },
        ],
      },
    ],
  },

  /* ────────────────────────────  4. Clinical  ──────────────────────────── */
  {
    id: 'clinical',
    label: 'Clinical',
    icon: HospitalSafe,
    groups: [
      {
        id: 'clinical-flow',
        title: 'Clinical',
        items: [
          { id: 'emr', label: 'Patient Records (EMR)', icon: ClipboardText },
          { id: 'consultation-notes', label: 'Consultation Notes', icon: Note1 },
          { id: 'diagnosis', label: 'Diagnosis', icon: Health },
          { id: 'prescription', label: 'Prescription', icon: DocumentText1 },
          { id: 'lab-orders', label: 'Lab Orders', icon: TagCross },
          { id: 'radiology-orders', label: 'Radiology Orders', icon: Maximize3 },
          { id: 'ot-management', label: 'OT Management', icon: Diagram },
          { id: 'nursing-notes', label: 'Nursing Notes', icon: Stickynote },
          { id: 'vitals-monitoring', label: 'Vitals Monitoring', icon: HeartCircle },
          { id: 'discharge-summary', label: 'Discharge Summary', icon: Receipt2 },
          { id: 'clinical-templates', label: 'Clinical Templates', icon: DocumentSketch },
        ],
      },
    ],
  },
]
