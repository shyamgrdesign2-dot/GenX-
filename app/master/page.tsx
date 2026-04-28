'use client'

import { useRouter } from 'next/navigation'
import { Hospital } from 'iconsax-reactjs'
import { TPAppShell, NAV_CONFIG } from '@/components/tp-app-shell'

export default function MasterPage() {
  const router = useRouter()
  return (
    <TPAppShell
      sections={NAV_CONFIG}
      initialActiveLeafId="organization"
      appTag={{
        label: 'Master',
        icon: <Hospital size={14} variant="Bulk" color="var(--tp-violet-700)" />,
      }}
      profile={{ name: 'Musfiq Rizwan', avatarUrl: '/profile-avatar.png' }}
      switchAppEntry={{
        label: 'Switch product',
        onClick: () => router.push('/'),
      }}
    />
  )
}
