import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

import {
  formatPrice,
  type Product,
} from "@/lib/products"

type Props = {
  products: Product[]
}

export function RecommendedProducts({
  products,
}: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold uppercase tracking-tight md:text-xl">
          Також може сподобатись
        </h2>

        <Link
          href="/catalog"
          className="shrink-0 text-xs font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Дивитись усі
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
        {products.map(
          (product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={
                    product.image ||
                    "/placeholder.svg"
                  }
                  alt={
                    product.name
                  }
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />

                <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background">
                  <Heart className="size-4" />
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  {product.name}
                </p>

                <p className="text-sm font-bold">
                  {formatPrice(
                    product.price
                  )}
                </p>

                <div className="flex gap-1.5">
                  {product.colorOptions.map(
                    (color) => (
                      <span
                        key={
                          color.key
                        }
                        className="size-3 rounded-full border border-border"
                        title={
                          color.name
                        }
                        style={{
                          backgroundColor:
                            color.hex,
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  )
}