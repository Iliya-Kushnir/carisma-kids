'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { FiltersPanel } from '@/components/filters-panel'
import { ProductCard } from '@/components/product-card'

import {
  PRICE_MIN,
  PRICE_MAX,
  type Product,
  type Category,
  type ColorKey,
} from '@/lib/products'

const PAGE_SIZE = 8

type FiltersState = {
  categories: Category[]
  sizes: string[]
  colors: ColorKey[]
  price: [number, number]
}



const INITIAL: FiltersState = {
  categories: ['Хлопчикам'],
  sizes: [],
  colors: [],
  price: [PRICE_MIN, PRICE_MAX],
}
type CatalogViewProps = {
    products: Product[]
  }
  
  export function CatalogView({ products }: CatalogViewProps) {
  const [filters, setFilters] =
    useState<FiltersState>(INITIAL)

  const [visible, setVisible] =
    useState(PAGE_SIZE)

  const [
    mobileFiltersOpen,
    setMobileFiltersOpen,
  ] = useState(false)

  function toggle<T>(
    list: T[],
    value: T
  ): T[] {
    return list.includes(value)
      ? list.filter(
          (item) => item !== value
        )
      : [...list, value]
  }

  function update(
    patch: Partial<FiltersState>
  ) {
    setFilters((current) => ({
      ...current,
      ...patch,
    }))

    setVisible(PAGE_SIZE)
  }

  const filtered = useMemo(() => {
    return products.filter((product) => {
      // Категория
      if (
        filters.categories.length > 0 &&
        !filters.categories.some(
          (category) =>
            product.categories.includes(
              category
            )
        )
      ) {
        return false
      }

      // Размер
      if (
        filters.sizes.length > 0 &&
        !filters.sizes.some((size) =>
          product.sizes.includes(size)
        )
      ) {
        return false
      }

      // Цвет
      if (
        filters.colors.length > 0 &&
        !filters.colors.some((color) =>
          product.colors.includes(color)
        )
      ) {
        return false
      }

      // Цена
      if (
        product.price <
          filters.price[0] ||
        product.price >
          filters.price[1]
      ) {
        return false
      }

      return true
    })
  }, [products, filters])

  const shown = filtered.slice(
    0,
    visible
  )

  const panelProps = {
    filters,

    onToggleCategory: (
      category: Category
    ) =>
      update({
        categories: toggle(
          filters.categories,
          category
        ),
      }),

    onToggleSize: (size: string) =>
      update({
        sizes: toggle(
          filters.sizes,
          size
        ),
      }),

    onToggleColor: (
      color: ColorKey
    ) =>
      update({
        colors: toggle(
          filters.colors,
          color
        ),
      }),

    onPriceChange: (
      price: [number, number]
    ) => update({ price }),

    onReset: () => {
      setFilters(INITIAL)
      setVisible(PAGE_SIZE)
    },
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-10">
      <Breadcrumbs
        items={[
          'Головна',
          'Хлопчикам',
          'Костюми',
        ]}
      />

      <div className="mt-8 flex flex-col gap-2 md:mt-10">
        <h1 className="font-heading text-4xl font-extrabold uppercase tracking-tight text-foreground md:text-5xl">
          Каталог
        </h1>

        <p className="text-sm text-muted-foreground">
          Знайдено товарів:{' '}
          {filtered.length}
        </p>
      </div>

      {/* MOBILE FILTER BUTTON */}

      <div className="mt-6 lg:hidden">
        <button
          type="button"
          onClick={() =>
            setMobileFiltersOpen(true)
          }
          className="flex items-center gap-2 rounded-sm border border-foreground px-4 py-3 text-sm font-bold uppercase tracking-wide"
        >
          <SlidersHorizontal className="size-4" />

          Фільтри
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-10 lg:mt-10 lg:flex-row lg:gap-12">
        {/* DESKTOP SIDEBAR */}

        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-32">
            <FiltersPanel
              {...panelProps}
            />
          </div>
        </aside>

        {/* PRODUCTS */}

        <div className="flex-1">
          {shown.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border text-center">
              <p className="font-heading text-lg font-bold uppercase">
                Нічого не знайдено
              </p>

              <p className="text-sm text-muted-foreground">
                Спробуйте змінити
                параметри фільтра.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 md:gap-y-10 xl:grid-cols-4">
              {shown.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}
            </div>
          )}

          {/* LOAD MORE */}

          {visible <
            filtered.length && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisible(
                    (current) =>
                      current +
                      PAGE_SIZE
                  )
                }
                className="rounded-sm border border-foreground px-10 py-4 text-sm font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Показати ще
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() =>
              setMobileFiltersOpen(
                false
              )
            }
            aria-hidden="true"
          />

          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-heading text-lg font-extrabold uppercase">
                Фільтри
              </span>

              <button
                type="button"
                aria-label="Закрити фільтри"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <FiltersPanel
                {...panelProps}
              />
            </div>

            <div className="border-t border-border p-4">
              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
                className="w-full rounded-sm bg-foreground py-4 text-sm font-bold uppercase tracking-widest text-background"
              >
                Показати{' '}
                {filtered.length}{' '}
                товарів
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}