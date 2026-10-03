"use client"

import { createClient } from "@/lib/supabase/client"

export type ProductColorInput = {
  id: string
  key: string
  name: string
  hex: string
  files: File[]
}

export type ProductVariantInput = {
  id: string
  color: string
  size: string
  stock: number
  price?: number
}

export type ProductDetailsInput = {
  composition?: string
  season?: string
  fit?: string
  set?: string
  pants?: string
  pockets?: string
  weight?: string
  dimensions?: string
  care?: string
}

export type CreateProductInput = {
  name: string
  slug: string
  sku: string

  description: string

  price: number
  compareAtPrice: number | null

  productType: string

  audience:
    | "boys"
    | "girls"
    | "unisex"

  categories: string[]
  sizes: string[]

  colors: ProductColorInput[]

  variants: ProductVariantInput[]

  details: ProductDetailsInput

  isFeatured: boolean
  isActive: boolean
}

function getExtension(file: File) {
  switch (file.type) {
    case "image/jpeg":
      return "jpg"

    case "image/png":
      return "png"

    case "image/webp":
      return "webp"

    default:
      return (
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg"
      )
  }
}

export async function createProduct(
  input: CreateProductInput
) {
  const supabase = createClient()

  let productId: string | null = null

  const uploadedPaths: string[] = []

  try {
    /*
     * 1. Сначала создаём черновик.
     *
     * Даже если менеджер хочет сразу
     * опубликовать товар, во время загрузки
     * фото он остаётся is_active = false.
     */
    const {
      data: product,
      error: createError,
    } = await supabase
      .from("products")
      .insert({
        name: input.name,
        slug: input.slug,
        sku: input.sku,

        description:
          input.description,

        price:
          input.price,

        compare_at_price:
          input.compareAtPrice,

        product_type:
          input.productType,

        audience:
          input.audience,

        categories:
          input.categories,

        sizes:
          input.sizes,

        colors:
          input.colors.map(
            (color) => ({
              key:
                color.key,

              name:
                color.name,

              hex:
                color.hex,
            })
          ),

        images: [],

        variants:
          input.variants,

        details:
          input.details,

        is_featured:
          input.isFeatured,

        is_active: false,
      })
      .select("id")
      .single()

    if (
      createError ||
      !product
    ) {
      throw (
        createError ||
        new Error(
          "Не вдалося створити товар."
        )
      )
    }

    productId =
      product.id

    /*
     * 2. Загружаем фотографии.
     */
    const images: {
      id: string
      url: string
      path: string
      color: string
      alt: string
      sort: number
    }[] = []

    for (
      const color
      of input.colors
    ) {
      for (
        let index = 0;
        index <
        color.files.length;
        index++
      ) {
        const file =
          color.files[index]

        const imageId =
          crypto.randomUUID()

        const extension =
          getExtension(file)

        /*
         * НИКАКИХ ПАПОК
         * вручную создавать не надо.
         */
        const path =
          `products/${productId}/${color.key}/${imageId}.${extension}`

        const {
          error:
            uploadError,
        } =
          await supabase.storage
            .from(
              "product-images"
            )
            .upload(
              path,
              file,
              {
                cacheControl:
                  "3600",

                upsert: false,

                contentType:
                  file.type,
              }
            )

        if (uploadError) {
          throw uploadError
        }

        uploadedPaths.push(
          path
        )

        const {
          data:
            publicUrlData,
        } =
          supabase.storage
            .from(
              "product-images"
            )
            .getPublicUrl(
              path
            )

        images.push({
          id: imageId,

          path,

          url:
            publicUrlData
              .publicUrl,

          color:
            color.key,

          alt:
            `${input.name} — ${color.name}`,

          sort:
            index,
        })
      }
    }

    /*
     * 3. Финально обновляем товар.
     */
    const {
      error:
        updateError,
    } = await supabase
      .from("products")
      .update({
        images,

        colors:
          input.colors.map(
            (color) => ({
              key:
                color.key,

              name:
                color.name,

              hex:
                color.hex,
            })
          ),

        variants:
          input.variants,

        sizes:
          input.sizes,

        details:
          input.details,

        is_featured:
          input.isFeatured,

        is_active:
          input.isActive,
      })
      .eq(
        "id",
        productId
      )

    if (updateError) {
      throw updateError
    }

    return {
      id: productId,
    }
  } catch (error) {
    /*
     * 4. Rollback.
     *
     * Если что-то упало:
     * удаляем уже загруженные фото.
     */
    if (
      uploadedPaths.length >
      0
    ) {
      await supabase.storage
        .from(
          "product-images"
        )
        .remove(
          uploadedPaths
        )
    }

    /*
     * Удаляем незавершённый товар.
     */
    if (productId) {
      await supabase
        .from("products")
        .delete()
        .eq(
          "id",
          productId
        )
    }

    throw error
  }
}