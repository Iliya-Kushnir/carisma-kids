'use client'

import { cn } from '@/lib/utils'
import {
  CATEGORIES,
  SIZES,
  COLOR_META,
  PRICE_MIN,
  PRICE_MAX,
  formatPrice,
  type Category,
  type ColorKey,
} from '@/lib/products'

type FiltersState = {
  categories: Category[]
  sizes: string[]
  colors: ColorKey[]
  price: [number, number]
}

type Props = {
  filters: FiltersState
  onToggleCategory: (c: Category) => void
  onToggleSize: (s: string) => void
  onToggleColor: (c: ColorKey) => void
  onPriceChange: (price: [number, number]) => void
  onReset: () => void
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground">
      {children}
    </h3>
  )
}

function PriceSlider({
  value,
  onChange,
}: {
  value: [number, number]
  onChange: (v: [number, number]) => void
}) {
  const [min, max] = value
  const leftPct = ((min - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const rightPct = ((max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  return (
    <div>
      <div className="relative h-6">
        <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-border" />
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-foreground"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={10}
          value={min}
          aria-label="Мінімальна ціна"
          onChange={(e) =>
            onChange([Math.min(Number(e.target.value), max - 10), max])
          }
          className="price-range absolute top-0 h-6 w-full appearance-none bg-transparent"
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={10}
          value={max}
          aria-label="Максимальна ціна"
          onChange={(e) =>
            onChange([min, Math.max(Number(e.target.value), min + 10)])
          }
          className="price-range absolute top-0 h-6 w-full appearance-none bg-transparent"
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  )
}

export function FiltersPanel({
  filters,
  onToggleCategory,
  onToggleSize,
  onToggleColor,
  onPriceChange,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-extrabold uppercase tracking-tight">
          Фільтри
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium uppercase tracking-wider text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Скинути
        </button>
      </div>

      {/* Categories */}
      <div className="border-t border-border pt-8">
        <SectionTitle>Категорії</SectionTitle>
        <ul className="flex flex-col gap-3">
          {CATEGORIES.map((cat) => {
            const active = filters.categories.includes(cat)
            return (
              <li key={cat}>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-sm border transition-colors',
                      active
                        ? 'border-foreground bg-foreground'
                        : 'border-border bg-background',
                    )}
                  >
                    {active && (
                      <svg viewBox="0 0 12 12" className="size-3 text-background" fill="none">
                        <path
                          d="M2.5 6.5L5 9L9.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={active}
                    onChange={() => onToggleCategory(cat)}
                  />
                  <span
                    className={cn(
                      'transition-colors',
                      active ? 'font-semibold text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {cat}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Price */}
      <div className="border-t border-border pt-8">
        <SectionTitle>Ціна, грн</SectionTitle>
        <PriceSlider value={filters.price} onChange={onPriceChange} />
      </div>

      {/* Sizes */}
      <div className="border-t border-border pt-8">
        <SectionTitle>Розмір (зріст, см)</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const active = filters.sizes.includes(size)
            return (
              <button
                key={size}
                type="button"
                onClick={() => onToggleSize(size)}
                aria-pressed={active}
                className={cn(
                  'flex h-10 min-w-11 items-center justify-center rounded-sm border px-3 text-sm font-medium transition-colors',
                  active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-foreground hover:border-foreground',
                )}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="border-t border-border pt-8">
        <SectionTitle>Колір</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(COLOR_META) as ColorKey[]).map((key) => {
            const active = filters.colors.includes(key)
            const meta = COLOR_META[key]
            return (
              <button
                key={key}
                type="button"
                onClick={() => onToggleColor(key)}
                aria-pressed={active}
                aria-label={meta.label}
                title={meta.label}
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border transition-all',
                  active ? 'border-foreground' : 'border-border',
                )}
              >
                <span
                  className="size-6 rounded-full border border-black/10"
                  style={{ backgroundColor: meta.swatch }}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
