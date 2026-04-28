'use client'

import * as React from 'react'

/**
 * TutorialPlayIcon — circular play button used in the clinical (RxPad) top bar.
 * Matches the Figma "Tutorial" tile: gradient ring + white play triangle.
 */
export function TutorialPlayIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="13" stroke="url(#tpi_grad)" strokeWidth="1.5" />
      <path d="M11 10.2l7 3.8-7 3.8V10.2Z" fill="url(#tpi_grad)" />
      <defs>
        <linearGradient id="tpi_grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7B61FF" />
          <stop offset="1" stopColor="#4B4AD5" />
        </linearGradient>
      </defs>
    </svg>
  )
}
