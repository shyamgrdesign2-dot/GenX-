'use client'

import { useRouter } from 'next/navigation'
import { TPAppShell } from '@/components/tp-app-shell'
import { Pill } from '@/components/tp-app-shell/icons'
import { PHARMA_NAV_CONFIG } from '@/components/tp-app-shell/nav-config-pharma'

export default function PharmaPage() {
  const router = useRouter()
  return (
    <TPAppShell
      sections={PHARMA_NAV_CONFIG}
      initialActiveLeafId="dashboard"
      appTag={{
        label: 'Pharma',
        icon: <Pill size={14} variant="Bulk" color="var(--tp-violet-700)" />,
      }}
      profile={{ name: 'Musfiq Rizwan', avatarUrl: '/profile-avatar.png' }}
      switchAppEntry={{
        label: 'Switch product',
        onClick: () => router.push('/'),
      }}
    />
  )
}
