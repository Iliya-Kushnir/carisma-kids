import { createClient } from '@/lib/supabase/server'

import type {
  Product,
  ProductColor,
  ProductImage,
  ProductVariant,
  ProductDetails,
} from '@/lib/products'

function normalizeProduct(product: any): Product {
  const colorOptions: ProductColor[] = Array.isArray(product.colors)
    ? product.colors
    : []

  const images: ProductImage[] = Array.isArray(product.images)
    ? [...product.images].sort(
        (a, b) =>
          Number(a.sort ?? 0) -
          Number(b.sort ?? 0)
      )
    : []

  const variants: ProductVariant[] = Array.isArray(product.variants)
    ? product.variants
    : []

  const details: ProductDetails =
    product.details &&
    typeof product.details === 'object'
      ? product.details
      : {}

  return {
    id: product.id,

    name: product.name,

    // для старого ProductCard
    title: product.name,

    slug: product.slug,

    sku: product.sku,

    price: Number(product.price),

    compare_at_price:
      product.compare_at_price !== null &&
      product.compare_at_price !== undefined
        ? Number(product.compare_at_price)
        : null,

    description: product.description ?? '',

    product_type: product.product_type,

    audience: product.audience,

    categories: product.categories ?? [],

    sizes: product.sizes ?? [],

    colors: colorOptions.map(
      (color) => color.key
    ),

    colorOptions,

    images,

    variants,

    details,

    is_featured:
      product.is_featured ?? false,

    is_active:
      product.is_active ?? true,

    image:
      images[0]?.url ??
      '/products/placeholder.png',
  }
}

export async function getProducts(): Promise<Product[]> {
  const supabase =
    await createClient()

  const { data, error } =
    await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', {
        ascending: false,
      })

  if (error) {
    console.error(
      'getProducts error:',
      error
    )

    throw new Error(
      'Не вдалося отримати товари'
    )
  }

  return (data ?? []).map(
    normalizeProduct
  )
}

export async function getProductById(
  id: string
): Promise<Product | null> {
  const supabase =
    await createClient()

  const { data, error } =
    await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

  if (error || !data) {
    return null
  }

  return normalizeProduct(data)
}

export async function getRelatedProducts(
  productId: string,
  productType: string,
  limit = 5
): Promise<Product[]> {
  const supabase =
    await createClient()

  const { data, error } =
    await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq(
        'product_type',
        productType
      )
      .neq('id', productId)
      .limit(limit)

  if (error) {
    console.error(
      'getRelatedProducts error:',
      error
    )

    return []
  }

  return (data ?? []).map(
    normalizeProduct
  )
}