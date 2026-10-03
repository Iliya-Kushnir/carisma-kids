import { createClient } from "@/lib/supabase/server"

import type {
  Product,
  ProductColor,
  ProductImage,
  ProductVariant,
  ProductDetails,
} from "@/lib/products"

/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

function normalizeProduct(product: any): Product {
  const colorOptions: ProductColor[] =
    Array.isArray(product.colors)
      ? product.colors
      : []

  const images: ProductImage[] =
    Array.isArray(product.images)
      ? [...product.images].sort(
          (a, b) =>
            Number(a.sort ?? 0) -
            Number(b.sort ?? 0)
        )
      : []

  const variants: ProductVariant[] =
    Array.isArray(product.variants)
      ? product.variants
      : []

  const details: ProductDetails =
    product.details &&
    typeof product.details === "object"
      ? product.details
      : {}

  return {
    id: product.id,

    name: product.name,

    // Совместимость со старым ProductCard
    title: product.name,

    slug: product.slug,

    sku: product.sku,

    price: Number(product.price),

    compare_at_price:
      product.compare_at_price !== null &&
      product.compare_at_price !== undefined
        ? Number(
            product.compare_at_price
          )
        : null,

    description:
      product.description ?? "",

    product_type:
      product.product_type ?? "",

    audience:
      product.audience ??
      "unisex",

    categories:
      Array.isArray(
        product.categories
      )
        ? product.categories
        : [],

    sizes:
      Array.isArray(
        product.sizes
      )
        ? product.sizes
        : [],

    colors:
      colorOptions.map(
        (color) =>
          color.key
      ),

    colorOptions,

    images,

    variants,

    details,

    is_featured:
      product.is_featured ??
      false,

    is_active:
      product.is_active ??
      true,

    image:
      images[0]?.url ??
      "/placeholder.svg",
  }
}

/* =========================================================
   ALL PRODUCTS
========================================================= */

export async function getProducts(): Promise<
  Product[]
> {
  const supabase =
    await createClient()

  const { data, error } =
    await supabase
      .from("products")
      .select("*")
      .eq(
        "is_active",
        true
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )

  if (error) {
    console.error(
      "getProducts error:",
      error
    )

    throw new Error(
      "Не вдалося отримати товари"
    )
  }

  return (
    data ?? []
  ).map(
    normalizeProduct
  )
}

/* =========================================================
   SINGLE PRODUCT
========================================================= */

export async function getProductById(
  id: string
): Promise<Product | null> {
  const supabase =
    await createClient()

  const { data, error } =
    await supabase
      .from("products")
      .select("*")
      .eq(
        "id",
        id
      )
      .eq(
        "is_active",
        true
      )
      .single()

  if (
    error ||
    !data
  ) {
    return null
  }

  return normalizeProduct(
    data
  )
}

/* =========================================================
   RELATED PRODUCTS
========================================================= */

export async function getRelatedProducts(
  currentProduct: Product,
  limit = 5
): Promise<Product[]> {
  const supabase =
    await createClient()

  /*
   * Получаем активные товары,
   * кроме текущего.
   *
   * Не фильтруем сразу по product_type,
   * потому что если другого товара
   * такого типа нет — рекомендации
   * вообще исчезнут.
   */
  const { data, error } =
    await supabase
      .from("products")
      .select("*")
      .eq(
        "is_active",
        true
      )
      .neq(
        "id",
        currentProduct.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(50)

  if (error) {
    console.error(
      "getRelatedProducts error:",
      error
    )

    return []
  }

  const products =
    (data ?? []).map(
      normalizeProduct
    )

  /*
   * Оцениваем каждый товар.
   *
   * Чем больше score —
   * тем выше он будет
   * в рекомендациях.
   */
  const scoredProducts =
    products.map(
      (product) => {
        let score = 0

        /* ---------------------
           SAME PRODUCT TYPE
        --------------------- */

        if (
          product.product_type &&
          product.product_type ===
            currentProduct.product_type
        ) {
          score += 100
        }

        /* ---------------------
           SAME CATEGORIES
        --------------------- */

        const sharedCategories =
          product.categories.filter(
            (category) =>
              currentProduct.categories.includes(
                category
              )
          )

        score +=
          sharedCategories.length *
          30

        /* ---------------------
           SAME AUDIENCE
        --------------------- */

        if (
          product.audience ===
          currentProduct.audience
        ) {
          score += 25
        } else if (
          product.audience ===
            "unisex" ||
          currentProduct.audience ===
            "unisex"
        ) {
          score += 10
        }

        /* ---------------------
           FEATURED
        --------------------- */

        if (
          product.is_featured
        ) {
          score += 5
        }

        /* ---------------------
           HAS STOCK
        --------------------- */

        const hasStock =
          product.variants.some(
            (variant) =>
              Number(
                variant.stock
              ) > 0
          )

        if (hasStock) {
          score += 3
        }

        return {
          product,
          score,
        }
      }
    )

  /*
   * Сначала самые похожие.
   *
   * Если похожих мало,
   * остальные активные товары
   * всё равно смогут попасть
   * в блок.
   */
  scoredProducts.sort(
    (a, b) =>
      b.score -
      a.score
  )

  return scoredProducts
    .slice(
      0,
      limit
    )
    .map(
      (item) =>
        item.product
    )
}