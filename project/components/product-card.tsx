'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { formatPrice, type Product } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false)

  const productHref = `/products/${product.id}`

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-sm bg-secondary">
        <Link
          href={productHref}
          aria-label={product.title}
          className="block"
        >
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.title}
            className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        <button
          type="button"
          onClick={() => setWished((value) => !value)}
          aria-label={
            wished
              ? 'Прибрати з обраного'
              : 'Додати в обране'
          }
          aria-pressed={wished}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-background shadow-sm transition-transform hover:scale-105"
        >
          <Heart
            className={cn(
              'size-4 transition-colors',
              wished
                ? 'fill-foreground text-foreground'
                : 'text-foreground'
            )}
          />
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
          <Link
            href={productHref}
            className="transition-opacity hover:opacity-60"
          >
            {product.title}
          </Link>
        </h3>

        <p className="text-base font-bold text-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  )
}