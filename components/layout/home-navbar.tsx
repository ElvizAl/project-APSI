'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Heart, User, Menu, Check, ShoppingCart, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { AppLogoIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'

const mainNavItems = [
  { title: 'Beli Mobil', href: '/beli' },
  { title: 'Jual Mobil', href: '/jual' },
  { title: 'Tukar Tambah', href: '/tukar-tambah' },
  { title: 'Pre Order', href: '/pre-order' },
  { title: 'Simulasi Budget', href: '/simulasi' },
  { title: 'Bandingkan', href: '/bandingkan' },
  { title: 'Promo', href: '/promo' },
]

export function HomeNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { data: session, isPending: sessionLoading } = authClient.useSession()

  const user = session?.user
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'G'

  async function handleLogout() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white shadow-sm" : "bg-white border-b border-zinc-100"
    )}>
      <div className="hidden bg-zinc-900 text-zinc-300 py-1.5 md:block">
        <div className="max-w-7xl flex items-center justify-between text-[11px] font-medium tracking-wide uppercase mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-2.5 w-2.5 text-green-500" />
              </span>
              Lulus Inspeksi 150 Titik
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-2.5 w-2.5 text-green-500" />
              </span>
              Garansi Mesin & Transmisi 1 Tahun
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/bantuan" className="hover:text-white transition-colors">Pusat Bantuan</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Artikel & Berita</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4 lg:gap-8">

          {/* Left: Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden shrink-0 hover:bg-zinc-100 rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 border-r-0">
                <div className="p-6 bg-zinc-900 text-white">
                  <AppLogoIcon className="h-8 w-auto text-white mb-2" />
                  <p className="text-sm text-zinc-400">Platform E-Commerce Otomotif</p>
                </div>
                <div className="flex flex-col py-4">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-6 py-3 text-lg font-medium border-b border-zinc-100 hover:bg-zinc-50 hover:pl-8 transition-all"
                    >
                      {item.title}
                    </Link>
                  ))}
                  <div className="mt-8 px-6">
                    <Link href="/cabang" className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-colors font-medium">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      Temukan Cabang Kami
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2 group">
              <AppLogoIcon className="h-8 w-auto text-primary sm:h-10 group-hover:scale-105 transition-transform" />
              <span className="font-bold text-xl tracking-tight hidden sm:block text-zinc-900 group-hover:text-primary transition-colors">GLOTOMOTIF</span>
            </Link>
          </div>

          {/* Middle: Prominent Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-2xl">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Cari merk (e.g. Toyota), model, atau tipe..."
                className="w-full pl-11 pr-4 bg-zinc-100 border-transparent hover:bg-zinc-200/60 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary rounded-full h-11 transition-all text-sm font-medium placeholder:font-normal"
              />
              <div className="absolute inset-y-1 right-1">
                <Button size="sm" className="rounded-full h-full px-4 bg-zinc-900 hover:bg-zinc-800 text-white">
                  Cari
                </Button>
              </div>
            </div>
          </div>

            {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <Button variant="ghost" size="icon" className="rounded-full text-zinc-600 hover:text-primary hover:bg-primary/5 transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </Button>

              <div className="h-6 w-px bg-zinc-200 mx-2" />

              <Button variant="ghost" size="icon" className="rounded-full text-zinc-600 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* User Section */}
            {sessionLoading ? (
              // Skeleton saat loading
              <div className="h-10 w-10 rounded-full bg-zinc-100 animate-pulse" />
            ) : user ? (
              // Sudah login → Dropdown Avatar
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 bg-zinc-100 hover:bg-zinc-200 transition-colors group">
                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                      <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
                      <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-zinc-700 hidden sm:block max-w-[100px] truncate">
                      {user.name || 'Profil'}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-400 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl mt-1 shadow-lg">
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <p className="text-sm font-semibold text-zinc-800 truncate">{user.name || 'Pengguna'}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg mx-1 gap-2">
                    <Link href="/profile">
                      <User className="h-4 w-4 text-zinc-500" />
                      Profil Saya
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg mx-1 gap-2">
                      <Link href="/dashboard">
                        <LayoutDashboard className="h-4 w-4 text-zinc-500" />
                        Dashboard Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-lg mx-1 mb-1 gap-2 text-red-500 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Belum login → Tombol Masuk
              <Button asChild className="rounded-full h-10 px-5 lg:px-6 bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20">
                <Link href="/auth/sign-in">
                  <User className="h-4 w-4 mr-2 hidden sm:block" />
                  <span className="font-semibold text-sm">Masuk / Daftar</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
