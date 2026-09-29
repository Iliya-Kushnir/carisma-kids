export type Category = string
export type ColorKey = string

export type ProductColor = {
  key: string
  name: string
  hex: string
}

export type ProductImage = {
  url: string
  path: string
  color: string | null
  alt: string
  sort: number
}

export type ProductVariant = {
  id?: string
  color: string
  size: string
  stock: number
}

export type ProductDetails = {
  composition?: string
  season?: string
  fit?: string
  hood?: string
  cuffs?: string

  [key: string]: string | undefined
}

export type Product = {
  id: string

  name: string

  // временная совместимость со старым ProductCard
  title: string

  slug: string
  sku: string

  price: number
  compare_at_price: number | null

  description: string

  product_type: string

  audience: 'boys' | 'girls' | 'unisex'

  categories: Category[]

  sizes: string[]

  colors: ColorKey[]

  colorOptions: ProductColor[]

  images: ProductImage[]

  variants: ProductVariant[]

  details: ProductDetails

  is_featured: boolean
  is_active: boolean

  // первая фотография товара
  image: string
}

export const CATEGORIES: Category[] = [
  'Хлопчикам',
  'Дівчаткам',
  'Худі',
  'Світшоти',
  'Футболки',
  'Штани',
  'Джинси',
  'Куртки',
  'Шорти',
  'Аксесуари',
]

export const SIZES = [
  '90',
  '100',
  '110',
  '120',
  '130',
  '140',
  '150',
  '160',
]

export const COLOR_META: Record<
  ColorKey,
  {
    label: string
    swatch: string
  }
> = {
  black: {
    label: 'Чорний',
    swatch: '#292825',
  },

  gray: {
    label: 'Сірий',
    swatch: '#85817B',
  },

  // оставляем и старый вариант названия
  grey: {
    label: 'Сірий',
    swatch: '#85817B',
  },

  beige: {
    label: 'Бежевий',
    swatch: '#CFC1AA',
  },

  cream: {
    label: 'Молочний',
    swatch: '#E8E2D4',
  },

  blue: {
    label: 'Синій',
    swatch: '#43566B',
  },

  white: {
    label: 'Білий',
    swatch: '#F5F5F5',
  },
}

export const PRICE_MIN = 0
export const PRICE_MAX = 5000

export function formatPrice(value: number) {
  return `${value.toLocaleString('uk-UA')} грн`
}

/*
  ВРЕМЕННАЯ совместимость со старым checkout-view.tsx.

  Каталог ЭТО НЕ ИСПОЛЬЗУЕТ.
  Каталог получает товары из Supabase.

  Когда будем переписывать корзину/checkout под Supabase —
  этот PRODUCTS удалим.
*/
export type LegacyProduct = {
  id: string
  title: string
  price: number
  image: string
  categories: Category[]
  sizes: string[]
  colors: ColorKey[]
}

export const PRODUCTS: LegacyProduct[] = []