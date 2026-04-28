'use client'

import Link from 'next/link'
import { Hospital, Health, Hierarchy, ArrowRight2 } from 'iconsax-reactjs'

interface ModuleCard {
  href: string
  label: string
  description: string
  icon: React.ComponentType<{ size?: number; color?: string; variant?: 'Linear' | 'Bulk' }>
  available: boolean
}

const MODULES: ModuleCard[] = [
  {
    href: '/master',
    label: 'Master',
    description: 'Facility, operational, inventory & clinical configuration.',
    icon: Hospital,
    available: true,
  },
  {
    href: '/pharma',
    label: 'Pharma',
    description: 'Pharmacy operations, reports, stock & user management.',
    icon: Health,
    available: true,
  },
  {
    href: '#',
    label: 'OPD',
    description: 'Outpatient department workflows. Coming soon.',
    icon: Hierarchy,
    available: false,
  },
  {
    href: '#',
    label: 'IPD',
    description: 'Inpatient department workflows. Coming soon.',
    icon: Hierarchy,
    available: false,
  },
]

export default function ModuleHub() {
  return (
    <main className="min-h-screen w-screen bg-tp-slate-100 flex flex-col">
      <header className="px-[18px] py-[14px] flex items-center gap-2.5 bg-white border-b border-tp-slate-100">
        <img src="/tatva-practice-logo.svg" alt="TatvaPractice" style={{ height: 36 }} />
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold text-tp-violet-700"
          style={{
            backgroundImage:
              'linear-gradient(135deg, var(--tp-violet-50) 0%, var(--tp-violet-100) 60%, var(--tp-violet-50) 100%)',
          }}
        >
          Module Hub
        </span>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        <div className="text-center max-w-[520px]">
          <h1
            className="text-[24px] leading-[32px] font-semibold text-tp-slate-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Choose a product
          </h1>
          <p
            className="mt-2 text-[14px] text-tp-slate-500"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Pick which module to open. You can always come back here from the
            sidebar via the grid icon at the bottom.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[760px]">
          {MODULES.map((m) => {
            const Inner = (
              <article
                className={
                  'group relative h-full rounded-2xl border border-tp-slate-100 bg-white p-5 flex flex-col gap-3 transition-all ' +
                  (m.available
                    ? 'hover:border-tp-violet-200 hover:shadow-sm cursor-pointer'
                    : 'opacity-60 cursor-not-allowed')
                }
              >
                <span
                  className="grid place-items-center w-12 h-12 rounded-[14px]"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, var(--tp-violet-100) 0%, var(--tp-violet-50) 100%)',
                  }}
                >
                  <m.icon size={24} variant="Bulk" color="var(--tp-violet-700)" />
                </span>
                <div className="flex-1">
                  <h2
                    className="text-[16px] leading-[22px] font-semibold text-tp-slate-900"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {m.label}
                  </h2>
                  <p
                    className="mt-1 text-[12px] leading-[18px] text-tp-slate-500"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {m.description}
                  </p>
                </div>
                {m.available && (
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-tp-violet-700">
                    Open <ArrowRight2 size={14} color="var(--tp-violet-700)" />
                  </span>
                )}
              </article>
            )
            return m.available ? (
              <Link key={m.label} href={m.href} className="contents">
                {Inner}
              </Link>
            ) : (
              <div key={m.label}>{Inner}</div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
