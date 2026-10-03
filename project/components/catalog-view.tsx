"use client"

import {
  useMemo,
  useState,
} from "react"

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"

import {
  SlidersHorizontal,
  X,
} from "lucide-react"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { FiltersPanel } from "@/components/filters-panel"
import { ProductCard } from "@/components/product-card"

import {
  PRICE_MIN,
  PRICE_MAX,
  type Product,
  type Category,
  type ColorKey,
} from "@/lib/products"

const PAGE_SIZE = 8

type FiltersState = {
  categories: Category[]
  sizes: string[]
  colors: ColorKey[]
  price: [number, number]
}

type CatalogViewProps = {
  products: Product[]
}

const INITIAL: FiltersState = {
  categories: [],
  sizes: [],
  colors: [],
  price: [
    PRICE_MIN,
    PRICE_MAX,
  ],
}

const AUDIENCE_CATEGORIES = {
  Хлопчикам: "boys",
  Дівчаткам: "girls",
} as const

export function CatalogView({
  products,
}: CatalogViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams =
    useSearchParams()

  const [
    visible,
    setVisible,
  ] = useState(PAGE_SIZE)

  const [
    mobileFiltersOpen,
    setMobileFiltersOpen,
  ] = useState(false)

  /*
   * URL — единственный источник истины.
   *
   * /catalog
   * categories = []
   *
   * /catalog?category=Дівчаткам
   * categories = ["Дівчаткам"]
   */
  const queryString = searchParams.toString()

  const filters = useMemo<FiltersState>(() => {
    const params = new URLSearchParams(queryString)
  
    const categories =
      params.getAll("category") as Category[]
  
    const sizes =
      params.getAll("size")
  
    const colors =
      params.getAll("color") as ColorKey[]
  
    const minRaw = params.get("min")
    const maxRaw = params.get("max")
  
    const parsedMin =
      minRaw !== null
        ? Number(minRaw)
        : PRICE_MIN
  
    const parsedMax =
      maxRaw !== null
        ? Number(maxRaw)
        : PRICE_MAX
  
    const min = Number.isFinite(parsedMin)
      ? Math.max(
          PRICE_MIN,
          Math.min(parsedMin, PRICE_MAX)
        )
      : PRICE_MIN
  
    const max = Number.isFinite(parsedMax)
      ? Math.max(
          PRICE_MIN,
          Math.min(parsedMax, PRICE_MAX)
        )
      : PRICE_MAX
  
    return {
      categories,
      sizes,
      colors,
  
      price: [
        Math.min(min, max),
        Math.max(min, max),
      ],
    }
  }, [queryString])

  /*
   * Обновление URL.
   */
  function updateUrl(
    next: FiltersState
  ) {
    const params =
      new URLSearchParams()

    next.categories.forEach(
      (category) => {
        params.append(
          "category",
          category
        )
      }
    )

    next.sizes.forEach(
      (size) => {
        params.append(
          "size",
          size
        )
      }
    )

    next.colors.forEach(
      (color) => {
        params.append(
          "color",
          color
        )
      }
    )

    if (
      next.price[0] !==
      PRICE_MIN
    ) {
      params.set(
        "min",
        String(
          next.price[0]
        )
      )
    }

    if (
      next.price[1] !==
      PRICE_MAX
    ) {
      params.set(
        "max",
        String(
          next.price[1]
        )
      )
    }

    const query =
      params.toString()

    setVisible(
      PAGE_SIZE
    )

    router.replace(
      query
        ? `${pathname}?${query}`
        : pathname,
      {
        scroll: false,
      }
    )
  }

  function update(
    patch: Partial<FiltersState>
  ) {
    updateUrl({
      ...filters,
      ...patch,
    })
  }

  function toggle<T>(
    list: T[],
    value: T
  ): T[] {
    return list.includes(
      value
    )
      ? list.filter(
          (item) =>
            item !== value
        )
      : [
          ...list,
          value,
        ]
  }

  /*
   * При выборе пола не разрешаем
   * одновременно Хлопчикам + Дівчаткам.
   *
   * Но типы одежды остаются.
   */
  function toggleCategory(
    category: Category
  ) {
    const isAudience =
      category in
      AUDIENCE_CATEGORIES

    if (!isAudience) {
      update({
        categories: toggle(
          filters.categories,
          category
        ),
      })

      return
    }

    const typeCategories =
      filters.categories.filter(
        (item) =>
          !(
            item in
            AUDIENCE_CATEGORIES
          )
      )

    const alreadySelected =
      filters.categories.includes(
        category
      )

    update({
      categories:
        alreadySelected
          ? typeCategories
          : [
              category,
              ...typeCategories,
            ],
    })
  }

  /*
   * Фильтрация.
   */
  const filtered =
    useMemo(() => {
      return products.filter(
        (product) => {
          /*
           * Пол.
           */
          const audienceFilters =
            filters.categories.filter(
              (
                category
              ): category is keyof typeof AUDIENCE_CATEGORIES =>
                category in
                AUDIENCE_CATEGORIES
            )

          if (
            audienceFilters.length >
            0
          ) {
            const matchesAudience =
              audienceFilters.some(
                (category) => {
                  const expected =
                    AUDIENCE_CATEGORIES[
                      category
                    ]

                  return (
                    product.audience ===
                      expected ||
                    product.audience ===
                      "unisex"
                  )
                }
              )

            if (
              !matchesAudience
            ) {
              return false
            }
          }

          /*
           * Тип одежды.
           */
          const typeFilters =
            filters.categories.filter(
              (category) =>
                !(
                  category in
                  AUDIENCE_CATEGORIES
                )
            )

          if (
            typeFilters.length >
            0
          ) {
            const matchesType =
              typeFilters.some(
                (category) =>
                  product.categories.includes(
                    category
                  )
              )

            if (
              !matchesType
            ) {
              return false
            }
          }

          /*
           * Размер.
           */
          if (
            filters.sizes
              .length > 0
          ) {
            const matchesSize =
              filters.sizes.some(
                (size) =>
                  product.sizes.includes(
                    size
                  )
              )

            if (
              !matchesSize
            ) {
              return false
            }
          }

          /*
           * Цвет.
           */
          if (
            filters.colors
              .length > 0
          ) {
            const matchesColor =
              filters.colors.some(
                (color) =>
                  product.colors.includes(
                    color
                  )
              )

            if (
              !matchesColor
            ) {
              return false
            }
          }

          /*
           * Цена.
           */
          if (
            product.price <
              filters
                .price[0] ||
            product.price >
              filters.price[1]
          ) {
            return false
          }

          return true
        }
      )
    }, [
      products,
      filters,
    ])

  const shown =
    filtered.slice(
      0,
      visible
    )

  const panelProps = {
    filters,

    onToggleCategory:
      toggleCategory,

    onToggleSize: (
      size: string
    ) => {
      update({
        sizes: toggle(
          filters.sizes,
          size
        ),
      })
    },

    onToggleColor: (
      color: ColorKey
    ) => {
      update({
        colors: toggle(
          filters.colors,
          color
        ),
      })
    },

    onPriceChange: (
      price: [
        number,
        number,
      ]
    ) => {
      update({
        price,
      })
    },

    onReset: () => {
      updateUrl(INITIAL)
    },
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-10">
      <Breadcrumbs
        items={[
          "Головна",
          "Каталог",
        ]}
      />

      <div className="mt-8 flex flex-col gap-2 md:mt-10">
        <h1 className="font-heading text-4xl font-extrabold uppercase tracking-tight text-foreground md:text-5xl">
          Каталог
        </h1>

        <p className="text-sm text-muted-foreground">
          Знайдено товарів:{" "}
          {filtered.length}
        </p>
      </div>

      {/* MOBILE */}

      <div className="mt-6 lg:hidden">
        <button
          type="button"
          onClick={() =>
            setMobileFiltersOpen(
              true
            )
          }
          className="flex items-center gap-2 rounded-sm border border-foreground px-4 py-3 text-sm font-bold uppercase tracking-wide"
        >
          <SlidersHorizontal className="size-4" />

          Фільтри
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-10 lg:mt-10 lg:flex-row lg:gap-12">
        {/* DESKTOP FILTERS */}

        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-32">
            <FiltersPanel
              {...panelProps}
            />
          </div>
        </aside>

        {/* PRODUCTS */}

        <div className="flex-1">
          {shown.length ===
          0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border text-center">
              <p className="font-heading text-lg font-bold uppercase">
                Нічого не
                знайдено
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
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                  />
                )
              )}
            </div>
          )}

          {visible <
            filtered.length && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisible(
                    (
                      current
                    ) =>
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
                Показати{" "}
                {
                  filtered.length
                }{" "}
                товарів
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}