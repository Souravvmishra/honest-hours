'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface LogoProps {
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

/**
 * Logo component that automatically switches between white and black logos
 * based on the current theme
 */
export function Logo({ className = '', width = 120, height = 40, priority = false }: LogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which logo to use based on theme
  // Use resolvedTheme to handle 'system' theme
  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark')
  // Using transparent background PNGs
  const logoSrc = isDark ? '/honest-hours-dark.png' : '/honest-hours-light.png'

  // Show placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={className}
        style={{ width, height }}
        aria-label="HonestHours Logo"
      />
    )
  }

  return (
    <Image
      src={logoSrc}
      alt="HonestHours Logo"
      width={width}
      height={height}
      className={`${className} select-none`}
      priority={priority}
      style={{ objectFit: 'contain' }}
      unoptimized
    />
  )
}
