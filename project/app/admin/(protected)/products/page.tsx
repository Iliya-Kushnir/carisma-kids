import Link from "next/link"

import {
  Plus,
  Package,
} from "lucide-react"

import { createClient } from "@/lib/supabase/server"

type ProductImage = {
  url?: string
}

type ProductVariant = {
  stock?: number
}

export default async function AdminProductsPage() {
  const supabase =
    await createClient()

  const {
    data: products,
    error,
  } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        sku,
        price,
        images,
        variants,
        is_active,
        is_featured,
        created_at
      `
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    )

  if (error) {
    console.error(
      "Admin products error:",
      error
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Каталог
          </p>

          <h1 className="text-3xl font-bold">
            Товари
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Керування товарами
            магазину.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex h-11 items-center justify-center gap-2 bg-foreground px-5 text-sm font-bold uppercase tracking-wide text-background"
        >
          <Plus className="size-4" />

          Додати товар
        </Link>
      </div>

      <div className="overflow-hidden border border-border bg-background">
        {!products ||
        products.length ===
          0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <Package className="mb-4 size-10 text-muted-foreground" />

            <h2 className="font-bold">
              Товарів поки немає
            </h2>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Створіть перший
              товар через
              адмін-панель.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-4">
                    Товар
                  </th>

                  <th className="px-5 py-4">
                    SKU
                  </th>

                  <th className="px-5 py-4">
                    Ціна
                  </th>

                  <th className="px-5 py-4">
                    Залишок
                  </th>

                  <th className="px-5 py-4">
                    Статус
                  </th>

                  <th className="px-5 py-4 text-right">
                    Дії
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(
                  (product) => {
                    const images =
                      Array.isArray(
                        product.images
                      )
                        ? (product.images as ProductImage[])
                        : []

                    const variants =
                      Array.isArray(
                        product.variants
                      )
                        ? (product.variants as ProductVariant[])
                        : []

                    const stock =
                      variants.reduce(
                        (
                          total,
                          variant
                        ) =>
                          total +
                          Number(
                            variant.stock ??
                              0
                          ),
                        0
                      )

                    const image =
                      images[0]
                        ?.url

                    return (
                      <tr
                        key={
                          product.id
                        }
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="size-14 shrink-0 overflow-hidden bg-muted">
                              {image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={
                                    image
                                  }
                                  alt={
                                    product.name
                                  }
                                  className="size-full object-cover"
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center">
                                  <Package className="size-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="font-semibold">
                                {
                                  product.name
                                }
                              </p>

                              {product.is_featured && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Рекомендований
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {product.sku ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold">
                          {Number(
                            product.price
                          ).toLocaleString(
                            "uk-UA"
                          )}{" "}
                          грн
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {stock}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={
                              product.is_active
                                ? "inline-flex bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700"
                                : "inline-flex bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                            }
                          >
                            {product.is_active
                              ? "Активний"
                              : "Чернетка"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-sm font-semibold underline underline-offset-4"
                          >
                            Редагувати
                          </Link>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}