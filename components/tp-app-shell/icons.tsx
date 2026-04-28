'use client'

import * as React from 'react'
import type { IconComp } from './types'

/**
 * Custom icons that the iconsax library doesn't ship.
 * Each one matches the iconsax-reactjs `IconComp` shape (size / color / variant).
 *
 * ─── How to add a new icon ────────────────────────────────────────────────────
 * 1. Export a new const that satisfies `IconComp`:
 *      ({ size = 24, color = 'currentColor', variant = 'Linear', className }) => JSX
 * 2. Linear  → stroke-based paths (strokeWidth 1.5, strokeLinecap round)
 *    Bulk    → filled paths (opacity 0.4 on background shape, solid on foreground)
 * 3. Import it in nav-config-*.tsx and pass it as the `icon` prop on any
 *    RailSection / NavItem / NavLeaf.
 */

/**
 * Dashboard / Analytics pie-chart icon.
 *
 * Usage:
 *   import { DashboardPieIcon } from './icons'
 *   { id: 'dashboard', label: 'Dashboard', icon: DashboardPieIcon }
 *
 * Bulk variant fills both arcs; Linear variant strokes them at 1.5px.
 * Designed to replace the generic Element4 (grid) so that the "Dashboard"
 * nav entry is visually distinct from the "Switch product" footer button,
 * which also uses a grid-style icon.
 */
export const DashboardPieIcon: IconComp = ({ size = 24, color = 'currentColor', variant = 'Linear', className }) => {
  if (variant === 'Bulk') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={className}
      >
        <g clipPath="url(#dpi_bulk_clip)">
          {/* Background arc — the larger donut piece */}
          <path
            opacity="0.4"
            d="M20.0001 14.6998C19.0701 19.3298 14.6301 22.6898 9.58005 21.8698C5.79005 21.2598 2.74005 18.2098 2.12005 14.4198C1.31005 9.38977 4.65005 4.94977 9.26005 4.00977"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Foreground wedge */}
          <path
            d="M18.32 11.9992C20.92 11.9992 22 10.9992 21.04 7.7192C20.39 5.5092 18.49 3.6092 16.28 2.9592C13 1.9992 12 3.0792 12 5.6792V8.5592C12 10.9992 13 11.9992 15 11.9992H18.32Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="dpi_bulk_clip">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g clipPath="url(#dpi_linear_clip)">
        <path
          d="M18.32 11.9992C20.92 11.9992 22 10.9992 21.04 7.7192C20.39 5.5092 18.49 3.6092 16.28 2.9592C13 1.9992 12 3.0792 12 5.6792V8.5592C12 10.9992 13 11.9992 15 11.9992H18.32Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.0001 14.6998C19.0701 19.3298 14.6301 22.6898 9.58005 21.8698C5.79005 21.2598 2.74005 18.2098 2.12005 14.4198C1.31005 9.38977 4.65005 4.94977 9.26005 4.00977"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="dpi_linear_clip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

/** Capsule / pill icon — Pharmacy section. */
export const Pill: IconComp = ({ size = 24, color = 'currentColor', variant = 'Linear', className }) => {
  if (variant === 'Bulk') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={className}
      >
        <path
          opacity="0.4"
          d="M10.5 20.5 20.5 10.5a4.95 4.95 0 1 0-7-7L3.5 13.5a4.95 4.95 0 1 0 7 7Z"
          fill={color}
        />
        <path
          d="m13.5 3.5 7 7-5 5-7-7 5-5Z"
          fill={color}
        />
      </svg>
    )
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M10.5 20.5 20.5 10.5a4.95 4.95 0 1 0-7-7L3.5 13.5a4.95 4.95 0 1 0 7 7Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m8.5 8.5 7 7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ============================================================================
 * Medical icon set — sourced from DesignSystem/public/icons/medical/
 * Raw SVG files live at /public/icons/medical/<name>--(line|bulk|solid).svg
 *
 * Each component follows the same IconComp interface:
 *   variant="Linear"  → line style (stroke or filled outlines)
 *   variant="Bulk"    → two-tone (0.35 opacity background + solid foreground)
 *
 * To use in a nav config:
 *   import { Tablets, Stethoscope, Lab } from './icons'
 *   { id: 'pharmacy', label: 'Pharmacy', icon: Tablets }
 *
 * To add more icons from the medical set:
 *   1. Open /public/icons/medical/<name>--line.svg and --bulk.svg
 *   2. Copy the <path> elements
 *   3. Replace fill="black" with fill={color}
 *   4. For bulk: add opacity="0.35" on the background path
 * ============================================================================ */

/**
 * Tablets icon — recommended icon for Pharmacy / medication sections.
 * Source: tablets--line.svg / tablets--bulk.svg
 */
export const Tablets: IconComp = ({ size = 24, color = 'currentColor', variant = 'Linear', className }) => {
  if (variant === 'Bulk') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
        <path
          opacity="0.35"
          d="M6 15C6 15.1501 5.84418 15.2518 5.71176 15.1812C3.50323 14.0038 2 11.6775 2 9C2 5.13401 5.13401 2 9 2C11.6775 2 14.0038 3.50323 15.1812 5.71176C15.2518 5.84418 15.1501 6 15 6C10.0294 6 6 10.0294 6 15Z"
          fill={color}
        />
        <path
          d="M20.6064 10.8076C21.4817 11.9762 22 13.4276 22 15C22 18.866 18.866 22 15 22C13.4276 22 11.9762 21.4817 10.8076 20.6064L20.6064 10.8076ZM15 8C16.5724 8 18.0238 8.51829 19.1924 9.39355L9.39355 19.1914C8.51858 18.0229 8 16.5721 8 15C8 11.134 11.134 8 15 8Z"
          fill={color}
        />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M15 20C17.7614 20 20 17.7614 20 15C20 12.2386 17.7614 10 15 10C12.2386 10 10 12.2386 10 15C10 17.7614 12.2386 20 15 20ZM15 22C18.866 22 22 18.866 22 15C22 11.134 18.866 8 15 8C11.134 8 8 11.134 8 15C8 18.866 11.134 22 15 22Z"
        fill={color}
      />
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M19.7071 10.2929C20.0976 10.6834 20.0976 11.3166 19.7071 11.7071L11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071C9.90237 19.3166 9.90237 18.6834 10.2929 18.2929L18.2929 10.2929C18.6834 9.90237 19.3166 9.90237 19.7071 10.2929Z"
        fill={color}
      />
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M7.63437 2.13451C8.99224 1.86441 10.3997 2.00303 11.6788 2.53285C12.6533 2.93649 13.5199 3.55338 14.2175 4.33333C14.5857 4.74498 14.5505 5.37716 14.1388 5.74535C13.7272 6.11355 13.095 6.07832 12.7268 5.66667C12.2285 5.10955 11.6095 4.66892 10.9134 4.38061C9.99979 4.00217 8.99445 3.90315 8.02455 4.09608C7.05465 4.289 6.16373 4.76521 5.46447 5.46447C4.76521 6.16373 4.289 7.05465 4.09608 8.02455C3.90315 8.99446 4.00217 9.99979 4.38061 10.9134C4.66892 11.6095 5.10955 12.2285 5.66667 12.7268C6.07832 13.095 6.11355 13.7272 5.74535 14.1388C5.37716 14.5505 4.74498 14.5857 4.33333 14.2175C3.55338 13.5199 2.93649 12.6533 2.53285 11.6788C2.00303 10.3997 1.86441 8.99224 2.13451 7.63437C2.4046 6.2765 3.07129 5.02922 4.05026 4.05026C5.02922 3.07129 6.2765 2.4046 7.63437 2.13451Z"
        fill={color}
      />
    </svg>
  )
}

/**
 * Stethoscope icon — clinical consultation, OPD, doctor sections.
 * Source: stethoscope--line.svg / stethoscope--bulk.svg
 */
export const Stethoscope: IconComp = ({ size = 24, color = 'currentColor', variant = 'Linear', className }) => {
  if (variant === 'Bulk') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
        <path
          opacity="0.35"
          fillRule="evenodd" clipRule="evenodd"
          d="M17.25 10.75C16.1454 10.75 15.25 11.6454 15.25 12.75V18.25C15.25 20.7353 13.2353 22.75 10.75 22.75C8.26472 22.75 6.25 20.7353 6.25 18.25V13C6.25 12.5858 6.58579 12.25 7 12.25C7.41421 12.25 7.75 12.5858 7.75 13V18.25C7.75 19.9069 9.09315 21.25 10.75 21.25C12.4069 21.25 13.75 19.9069 13.75 18.25V12.75C13.75 10.817 15.317 9.25 17.25 9.25C19.183 9.25 20.75 10.817 20.75 12.75V14C20.75 14.4142 20.4142 14.75 20 14.75C19.5858 14.75 19.25 14.4142 19.25 14V12.75C19.25 11.6454 18.3546 10.75 17.25 10.75Z"
          fill={color}
        />
        <path
          opacity="0.35"
          fillRule="evenodd" clipRule="evenodd"
          d="M10 1.25C10.4142 1.25 10.75 1.58579 10.75 2V4C10.75 4.41421 10.4142 4.75 10 4.75C9.58579 4.75 9.25 4.41421 9.25 4V2C9.25 1.58579 9.58579 1.25 10 1.25Z"
          fill={color}
        />
        <path
          opacity="0.35"
          fillRule="evenodd" clipRule="evenodd"
          d="M4 1.25C4.41421 1.25 4.75 1.58579 4.75 2V4C4.75 4.41421 4.41421 4.75 4 4.75C3.58579 4.75 3.25 4.41421 3.25 4V2C3.25 1.58579 3.58579 1.25 4 1.25Z"
          fill={color}
        />
        <path
          d="M22 16C22 17.1046 21.1046 18 20 18C18.8954 18 18 17.1046 18 16C18 14.8954 18.8954 14 20 14C21.1046 14 22 14.8954 22 16Z"
          fill={color}
        />
        <path
          d="M3.25 4.00098C2.94668 4.22905 2.75 4.59128 2.75 5V8C2.75 10.3472 4.65279 12.25 7 12.25C9.34721 12.25 11.25 10.3472 11.25 8V5C11.25 4.591 11.0527 4.22902 10.749 4.00098L10.75 4V2.35645C11.9039 2.68316 12.75 3.7415 12.75 5V8C12.75 11.1756 10.1756 13.75 7 13.75C3.82436 13.75 1.25 11.1756 1.25 8V5C1.25 3.7415 2.09614 2.68316 3.25 2.35645V4.00098Z"
          fill={color}
        />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path d="M22 16C22 17.1046 21.1046 18 20 18C18.8954 18 18 17.1046 18 16C18 14.8954 18.8954 14 20 14C21.1046 14 22 14.8954 22 16Z" stroke={color} strokeWidth="1.5" />
      <path d="M4 3C2.89543 3 2 3.89543 2 5V8C2 10.7614 4.23858 13 7 13C9.76142 13 12 10.7614 12 8V5C12 3.89543 11.1046 3 10 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 13V18.25C7 20.3211 8.67893 22 10.75 22C12.8211 22 14.5 20.3211 14.5 18.25V12.75C14.5 11.2312 15.7312 10 17.25 10C18.7688 10 20 11.2312 20 12.75V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 2V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 2V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Injection / Syringe icon — vaccinations, injections, procedures.
 * Source: injection--line.svg / injection--bulk.svg
 */
export const Injection: IconComp = ({ size = 24, color = 'currentColor', variant = 'Linear', className }) => {
  if (variant === 'Bulk') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
        <path
          opacity="0.35"
          d="M13.4852 6.53531L8.29975 11.7208C7.99376 12.0268 7.79526 12.4237 7.73407 12.8521L7.49836 14.502C7.3098 15.822 8.44117 16.9533 9.76111 16.7648L11.411 16.5291C11.8394 16.4679 12.2364 16.2694 12.5424 15.9634L17.7278 10.7779C18.5089 9.9969 18.5089 8.73057 17.7278 7.94952L16.3136 6.53531C15.5326 5.75426 14.2662 5.75426 13.4852 6.53531Z"
          fill={color}
        />
        <path
          d="M9.76092 16.7652L11.4108 16.5295C11.8392 16.4683 12.2362 16.2698 12.5422 15.9638L16.3137 12.1925L9.24267 10.7783L8.29956 11.7212C7.99357 12.0272 7.79508 12.4241 7.73388 12.8525L7.49817 14.5024C7.30961 15.8224 8.44098 16.9537 9.76092 16.7652Z"
          fill={color}
        />
        <path
          opacity="0.35"
          fillRule="evenodd" clipRule="evenodd"
          d="M9.37105 14.9172C9.65709 15.2168 9.6461 15.6916 9.34651 15.9776L3.51791 21.5426C3.21832 21.8286 2.74358 21.8176 2.45754 21.518C2.1715 21.2185 2.18248 20.7437 2.48207 20.4577L8.31067 14.8927C8.61026 14.6067 9.08501 14.6176 9.37105 14.9172Z"
          fill={color}
        />
        <path
          fillRule="evenodd" clipRule="evenodd"
          d="M17.9045 2.46967C18.1974 2.17678 18.6723 2.17678 18.9652 2.46967L20.3661 3.87058C20.3707 3.87494 20.3752 3.87938 20.3798 3.88388C20.3843 3.88839 20.3887 3.89294 20.3931 3.89753L21.7936 5.2981C22.0865 5.59099 22.0865 6.06586 21.7936 6.35876C21.5007 6.65165 21.0259 6.65165 20.733 6.35876L19.8493 5.47504L17.5513 7.77297C17.2584 8.06587 16.7836 8.06587 16.4907 7.77297C16.1978 7.48008 16.1978 7.00521 16.4907 6.71231L18.7886 4.41438L17.9045 3.53033C17.6116 3.23744 17.6116 2.76256 17.9045 2.46967Z"
          fill={color}
        />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path d="M13.4852 6.53531L8.29975 11.7208C7.99376 12.0268 7.79526 12.4237 7.73407 12.8521L7.49836 14.502C7.3098 15.822 8.44117 16.9533 9.76111 16.7648L11.411 16.5291C11.8394 16.4679 12.2364 16.2694 12.5424 15.9634L17.7278 10.7779C18.5089 9.9969 18.5089 8.73057 17.7278 7.94952L16.3136 6.53531C15.5326 5.75426 14.2662 5.75426 13.4852 6.53531Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19.8496 4.41406L17.0212 7.24249" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.4351 3L21.2635 5.82843" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.24286 10.7781L16.3139 12.1923" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.82859 16.435L2.99999 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Lab / Test-tube icon — laboratory, pathology, diagnostics sections.
 * Source: lab--line.svg / lab--bulk.svg
 */
export const Lab: IconComp = ({ size = 24, color = 'currentColor', variant = 'Linear', className }) => {
  if (variant === 'Bulk') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
        <path
          d="M15.8455 22.0002H8.16547C3.97547 22.0002 3.14547 19.4702 4.50547 16.3902L5.94547 13.1202C5.94547 13.1202 9.00547 13.0002 12.0055 14.0002C15.0055 15.0002 17.8355 13.1102 17.8355 13.1102L18.0255 12.9902L19.5155 16.4002C20.8555 19.4802 19.9755 22.0002 15.8455 22.0002Z"
          fill={color}
        />
        <path
          opacity="0.35"
          d="M18.0258 12.992L17.8358 13.112C17.8358 13.112 15.0058 15.002 12.0058 14.002C9.0058 13.002 5.9458 13.122 5.9458 13.122L8.7458 6.74195H8.4458C7.7958 6.74195 7.1958 6.48195 6.7658 6.05195C6.3358 5.62195 6.0758 5.02195 6.0758 4.37195C6.0758 3.07195 7.1358 2.00195 8.4458 2.00195H15.5558C16.2158 2.00195 16.8058 2.27195 17.2358 2.70195C17.7958 3.26195 18.0858 4.08195 17.8658 4.95195C17.6058 6.03195 16.5658 6.74195 15.4458 6.74195H15.2858L18.0258 12.992Z"
          fill={color}
        />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path d="M8.15979 22C3.97979 22 3.13979 19.47 4.49979 16.39L8.74979 6.74H8.44979C7.79979 6.74 7.19979 6.48 6.76979 6.05C6.32979 5.62 6.06979 5.02 6.06979 4.37C6.06979 3.07 7.12979 2 8.43979 2H15.5498C16.2098 2 16.7998 2.27 17.2298 2.7C17.7898 3.26 18.0698 4.08 17.8598 4.95C17.5898 6.03 16.5498 6.74 15.4398 6.74H15.2798L19.4998 16.4C20.8498 19.48 19.9698 22 15.8298 22H8.15979Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.93994 13.1199C5.93994 13.1199 8.99994 12.9999 11.9999 13.9999C14.9999 14.9999 17.8299 13.1099 17.8299 13.1099" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Syrup / Bottle icon — liquid medication, syrups.
 * Source: syrup--line.svg / syrup--bulk.svg
 */
export const Syrup: IconComp = ({ size = 24, color = 'currentColor', variant = 'Linear', className }) => {
  if (variant === 'Bulk') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
        <path d="M7 3.5C7 2.67157 7.67157 2 8.5 2H15.5C16.3284 2 17 2.67157 17 3.5C17 4.32843 16.3284 5 15.5 5H8.5C7.67157 5 7 4.32843 7 3.5Z" fill={color} />
        <path opacity="0.35" d="M6 12.1407C6 10.8033 6.6684 9.5544 7.7812 8.81253L8.1094 8.59373C8.6658 8.2228 9 7.59834 9 6.92963V5H15V6.92963C15 7.59834 15.3342 8.2228 15.8906 8.59373L16.2188 8.81253C17.3316 9.5544 18 10.8033 18 12.1407V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V12.1407Z" fill={color} />
        <path d="M15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15Z" fill={color} />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5C16 4.32843 15.3284 5 14.5 5H9.5C8.67157 5 8 4.32843 8 3.5Z" stroke={color} strokeWidth="1.5" />
      <path d="M6 12.1407C6 10.8033 6.6684 9.5544 7.7812 8.81253L8.1094 8.59373C8.6658 8.2228 9 7.59834 9 6.92963V5H15V6.92963C15 7.59834 15.3342 8.2228 15.8906 8.59373L16.2188 8.81253C17.3316 9.5544 18 10.8033 18 12.1407V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V12.1407Z" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="15" r="3" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

/**
 * UserSettings / People-group icon — user management, roles & permissions sections.
 * Uses the custom icon provided in the TP Design System (people cluster shape).
 * Source: DesignSystem / GenX component library
 *
 * Usage:
 *   import { UserSettings } from './icons'
 *   { id: 'user-settings', label: 'User Settings', icon: UserSettings }
 *
 * ─── Bulk variant rules ────────────────────────────────────────────────────────
 * The Bulk variant is a TRUE two-tone fill icon — NOT a stroke icon with opacity.
 * It follows the same pattern as all iconsax Bulk icons:
 *
 *   • Outer left + right profiles  → fill={color}  opacity="0.4"  (background / muted)
 *   • Centre profile (head + body) → fill={color}  no opacity      (foreground / solid)
 *
 * ⚠️  Do NOT apply a uniform opacity to all paths — only the outer profile paths
 *     get opacity 0.4. The centre profile must always render at full opacity so the
 *     primary user stands out against the supporting ones.
 *
 * This icon is rendered with variant="Bulk" when the nav item is active/selected
 * (both in expanded list and in collapsed icon-only mode).
 * ──────────────────────────────────────────────────────────────────────────────
 */
export const UserSettings: IconComp = ({ size = 24, color = 'currentColor', variant = 'Linear', className }) => {
  if (variant === 'Bulk') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={className}
      >
        {/* outer right profile — muted (background layer) */}
        <path opacity="0.4" d="M17.53 7.77C17.46 7.76 17.39 7.76 17.32 7.77C15.77 7.72 14.54 6.45 14.54 4.89C14.54 3.3 15.83 2 17.43 2C19.02 2 20.32 3.29 20.32 4.89C20.31 6.45 19.08 7.72 17.53 7.77Z" fill={color} />
        <path opacity="0.4" d="M20.79 14.7004C19.67 15.4504 18.1 15.7304 16.65 15.5404C17.03 14.7204 17.23 13.8104 17.24 12.8504C17.24 11.8504 17.02 10.9004 16.6 10.0704C18.08 9.8704 19.65 10.1504 20.78 10.9004C22.36 11.9404 22.36 13.6504 20.79 14.7004Z" fill={color} />
        {/* outer left profile — muted (background layer) */}
        <path opacity="0.4" d="M6.44002 7.77C6.51002 7.76 6.58002 7.76 6.65002 7.77C8.20002 7.72 9.43002 6.45 9.43002 4.89C9.43002 3.3 8.14002 2 6.54002 2C4.95002 2 3.65002 3.29 3.65002 4.89C3.66002 6.45 4.89002 7.72 6.44002 7.77Z" fill={color} />
        <path opacity="0.4" d="M6.54999 12.8496C6.54999 13.8196 6.75999 14.7396 7.13999 15.5696C5.72999 15.7196 4.26 15.4196 3.18 14.7096C1.6 13.6596 1.6 11.9496 3.18 10.8996C4.25 10.1796 5.75999 9.88962 7.18 10.0496C6.77 10.8896 6.54999 11.8396 6.54999 12.8496Z" fill={color} />
        {/* centre profile — solid, full opacity (primary / foreground) */}
        <path d="M12.12 15.87C12.04 15.86 11.95 15.86 11.86 15.87C10.02 15.81 8.54999 14.3 8.54999 12.44C8.54999 10.54 10.08 9 11.99 9C13.89 9 15.43 10.54 15.43 12.44C15.43 14.3 13.97 15.81 12.12 15.87Z" fill={color} />
        <path d="M8.86999 17.9396C7.35999 18.9496 7.35999 20.6096 8.86999 21.6096C10.59 22.7596 13.41 22.7596 15.13 21.6096C16.64 20.5996 16.64 18.9396 15.13 17.9396C13.42 16.7896 10.6 16.7896 8.86999 17.9396Z" fill={color} />
      </svg>
    )
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g clipPath="url(#userset_clip)">
        {/* outer left profile */}
        <path d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.99994 14.4402C5.62994 14.6702 4.11994 14.4302 3.05994 13.7202C1.64994 12.7802 1.64994 11.2402 3.05994 10.3002C4.12994 9.59016 5.65994 9.35016 7.02994 9.59016" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* outer right profile */}
        <path d="M18.0001 7.16C17.9401 7.15 17.8701 7.15 17.8101 7.16C16.4301 7.11 15.3301 5.98 15.3301 4.58C15.3301 3.15 16.4801 2 17.9101 2C19.3401 2 20.4901 3.16 20.4901 4.58C20.4801 5.98 19.3801 7.11 18.0001 7.16Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.9699 14.4402C18.3399 14.6702 19.8499 14.4302 20.9099 13.7202C22.3199 12.7802 22.3199 11.2402 20.9099 10.3002C19.8399 9.59016 18.3099 9.35016 16.9399 9.59016" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* centre / primary profile */}
        <path d="M12.0001 14.6297C11.9401 14.6197 11.8701 14.6197 11.8101 14.6297C10.4301 14.5797 9.33008 13.4497 9.33008 12.0497C9.33008 10.6197 10.4801 9.46973 11.9101 9.46973C13.3401 9.46973 14.4901 10.6297 14.4901 12.0497C14.4801 13.4497 13.3801 14.5897 12.0001 14.6297Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.09021 17.7794C7.68021 18.7194 7.68021 20.2594 9.09021 21.1994C10.6902 22.2694 13.3102 22.2694 14.9102 21.1994C16.3202 20.2594 16.3202 18.7194 14.9102 17.7794C13.3202 16.7194 10.6902 16.7194 9.09021 17.7794Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="userset_clip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

/**
 * GivePill icon — dispensing medication to patients.
 * Source: give-pill--line.svg / give-pill--bulk.svg
 */
export const GivePill: IconComp = ({ size = 24, color = 'currentColor', variant = 'Linear', className }) => {
  if (variant === 'Bulk') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
        <path opacity="0.35" d="M16 5C16 3.34315 17.3431 2 19 2C20.6569 2 22 3.34315 22 5V11C22 12.6569 20.6569 14 19 14C17.3431 14 16 12.6569 16 11V5Z" fill={color} />
        <path d="M16 8H22V11C22 12.6569 20.6569 14 19 14C17.3431 14 16 12.6569 16 11V8Z" fill={color} />
        <path opacity="0.35" d="M4 10H2V19L6.31083 21.1554C7.42168 21.7108 8.64658 22 9.88854 22H18C19.1046 22 20 21.1046 20 20C20 18.8954 19.1046 18 18 18H16.4164C15.4849 18 14.5663 17.7831 13.7331 17.3666L11.0191 15.646C11.1111 15.5245 11.19 15.3899 11.2528 15.2434C11.6664 14.2784 11.2241 13.1605 10.2622 12.7397L4 10Z" fill={color} />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <rect x="16" y="2" width="6" height="12" rx="3" stroke={color} strokeWidth="1.5" />
      <path d="M16 8H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10H4L10.2622 12.7397C11.2241 13.1605 11.6664 14.2784 11.2528 15.2434C10.837 16.2136 9.71355 16.663 8.74342 16.2472L7 15.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.33541 18.3292C1.96493 18.1439 1.51442 18.2941 1.32918 18.6646C1.14394 19.0351 1.29411 19.4856 1.66459 19.6708L2 19L2.33541 18.3292ZM11.3354 15.3292L10.6646 14.9938L9.99377 16.3354L10.6646 16.6708L11 16L11.3354 15.3292ZM13.7331 17.3666L13.3977 18.0374L13.7331 17.3666ZM16.4164 18V18.75H18V18V17.25H16.4164V18ZM18 22V21.25H9.88854V22V22.75H18V22ZM6.31083 21.1554L6.64625 20.4846L2.33541 18.3292L2 19L1.66459 19.6708L5.97542 21.8262L6.31083 21.1554ZM13.7331 17.3666L14.0685 16.6957L11.3354 15.3292L11 16L10.6646 16.6708L13.3977 18.0374L13.7331 17.3666ZM9.88854 22V21.25C8.76302 21.25 7.65295 20.9879 6.64625 20.4846L6.31083 21.1554L5.97542 21.8262C7.19041 22.4337 8.53015 22.75 9.88854 22.75V22ZM20 20H19.25C19.25 20.6904 18.6904 21.25 18 21.25V22V22.75C19.5188 22.75 20.75 21.5188 20.75 20H20ZM18 18V18.75C18.6904 18.75 19.25 19.3096 19.25 20H20H20.75C20.75 18.4812 19.5188 17.25 18 17.25V18ZM16.4164 18V17.25C15.6014 17.25 14.7975 17.0602 14.0685 16.6957L13.7331 17.3666L13.3977 18.0374C14.335 18.506 15.3685 18.75 16.4164 18.75V18Z" fill={color} />
    </svg>
  )
}
