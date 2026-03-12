'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AppLogoIcon } from '@/components/icons'

export function PageLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Setiap ganti halaman → tampilkan overlay sebentar
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
        <AppLogoIcon className="h-14 w-14 text-primary animate-[pulse_1s_ease-in-out_infinite]" />
        <p className="text-sm font-medium text-zinc-400 tracking-wide">Memuat...</p>
      </div>
    </div>
  )
}
