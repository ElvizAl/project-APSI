'use client'

import * as React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop',
    badge: 'Penawaran Spesial',
    title: 'Mobil Impian Anda\nAda Di Sini',
    subtitle: 'Lebih dari 500 unit tersedia. Lulus inspeksi 150 titik, garansi 1 tahun.',
    cta: { label: 'Lihat Semua Mobil', href: '/beli' },
    ctaSecondary: { label: 'Simulasi Kredit', href: '/simulasi' },
    overlay: 'from-zinc-900/80 via-zinc-900/40 to-transparent',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop',
    badge: 'Tukar Tambah',
    title: 'Jual Mobil Lama,\nDapat Harga Terbaik',
    subtitle: 'Proses cepat, harga transparan. Langsung deal hari ini.',
    cta: { label: 'Jual Mobil Sekarang', href: '/jual' },
    ctaSecondary: { label: 'Tukar Tambah', href: '/tukar-tambah' },
    overlay: 'from-violet-900/80 via-violet-900/40 to-transparent',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop',
    badge: 'Pre Order',
    title: 'Pre-Order Mobil Baru\nSebelum Kehabisan',
    subtitle: 'Booking sekarang, bayar saat mobil siap dikirim. Stok terbatas!',
    cta: { label: 'Pre-Order Sekarang', href: '/pre-order' },
    ctaSecondary: { label: 'Lihat Promo', href: '/promo' },
    overlay: 'from-blue-900/80 via-blue-900/40 to-transparent',
  },
]

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ])
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()
  const scrollTo = (i: number) => emblaApi?.scrollTo(i)

  return (
    <div className="relative w-full overflow-hidden group">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0">
              {/* Image */}
              <div className="relative h-[380px] sm:h-[480px] lg:h-[560px] w-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
                {/* Gradient overlay */}
                <div className={cn('absolute inset-0 bg-gradient-to-r', slide.overlay)} />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
                  <div className="max-w-xl">
                    {/* Badge */}
                    <span className="inline-block bg-primary/90 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                      {slide.badge}
                    </span>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 whitespace-pre-line">
                      {slide.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-white/80 text-sm sm:text-base mb-6 leading-relaxed">
                      {slide.subtitle}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full px-6 bg-white text-zinc-900 hover:bg-zinc-100 font-bold shadow-lg"
                      >
                        <Link href={slide.cta.href}>{slide.cta.label}</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full px-6 bg-transparent border-white text-white hover:bg-white/10 font-semibold"
                      >
                        <Link href={slide.ctaSecondary.href}>{slide.ctaSecondary.label}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow Prev */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Sebelumnya"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Arrow Next */}
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Berikutnya"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              'rounded-full transition-all duration-300',
              selectedIndex === i
                ? 'bg-white w-6 h-2'
                : 'bg-white/50 w-2 h-2 hover:bg-white/80'
            )}
          />
        ))}
      </div>
    </div>
  )
}
