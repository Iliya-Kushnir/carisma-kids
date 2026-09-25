'use client'

import { useState } from 'react'
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'ГОЛОВНА', href: '#' },
  { label: 'КАТАЛОГ', href: '#', hasDropdown: true },
  { label: 'ДІВЧАТКАМ', href: '#' },
  { label: 'ХЛОПЧИКАМ', href: '#' },
  { label: 'ПРО НАС', href: '#' },
  { label: 'ДОСТАВКА І ОПЛАТА', href: '#' },
]

function Logo() {
  return (
    <a href="#" className="flex items-center gap-3" aria-label="Carisma KIDS — на головну">
      <img
        src="/carisma-logo.png"
        alt="Carisma KIDS"
        className="size-14 shrink-0 rounded-full object-cover"
      />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
          carisma
        </span>
        <span className="mt-0.5 text-[0.6rem] font-medium tracking-[0.5em] text-muted-foreground">
          · KIDS ·
        </span>
      </span>
    </a>
  )
}

export function SiteHeader({ cartCount = 0 }: { cartCount?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background">
      {/* Announcement bar */}
      <div className="flex items-center justify-center gap-2 bg-foreground px-4 py-3 text-background">
        <ShoppingBag className="size-4" aria-hidden="true" />
        <p className="text-xs font-semibold tracking-widest">
          БЕЗКОШТОВНА ДОСТАВКА ВІД 2500 ГРН
        </p>
      </div>

      {/* Main nav */}
      <div className="border-b border-border">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden"
              aria-label="Відкрити меню"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-6" />
            </button>
            <Logo />
          </div>

          <nav className="hidden lg:block" aria-label="Головна навігація">
            <ul className="flex items-center gap-7 xl:gap-9">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-1 text-sm font-bold tracking-wide text-foreground transition-opacity hover:opacity-60"
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <ChevronDown className="size-4" aria-hidden="true" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4 md:gap-5">
            <button type="button" aria-label="Пошук" className="transition-opacity hover:opacity-60">
              <Search className="size-5" />
            </button>
            <button type="button" aria-label="Кабінет" className="hidden transition-opacity hover:opacity-60 sm:block">
              <User className="size-5" />
            </button>
            <button type="button" aria-label="Список бажань" className="transition-opacity hover:opacity-60">
              <Heart className="size-5" />
            </button>
            <button
              type="button"
              aria-label={`Кошик, товарів: ${cartCount}`}
              className="relative transition-opacity hover:opacity-60"
            >
              <ShoppingBag className="size-5" />
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-foreground text-[0.6rem] font-bold text-background">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">
          <div className="flex h-20 items-center justify-between border-b border-border px-4">
            <Logo />
            <button type="button" aria-label="Закрити меню" onClick={() => setMobileOpen(false)}>
              <X className="size-6" />
            </button>
          </div>
          <nav className="px-6 py-6" aria-label="Мобільна навігація">
            <ul className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-lg font-bold tracking-wide text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
