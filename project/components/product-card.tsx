'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice, type Product } from '@/lib/products'
import Link from 'next/link'

export function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false)

  return (
    <Link 
    href={`/products/${product.id}`}
    className="group block"
    >
        <article className="group flex flex-col">
        <div className="relative overflow-hidden rounded-sm bg-secondary">
            <a href="#" aria-label={product.title}>
            <img
                src={product.image || '/placeholder.svg'}
                alt={product.title}
                className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
            />
            </a>
            <button
            type="button"
            onClick={() => setWished((v) => !v)}
            aria-label={wished ? 'Прибрати з обраного' : 'Додати в обране'}
            aria-pressed={wished}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background shadow-sm transition-transform hover:scale-105"
            >
            <Heart
                className={cn(
                'size-4 transition-colors',
                wished ? 'fill-foreground text-foreground' : 'text-foreground',
                )}
            />
            </button>
        </div>

        <div className="mt-4 flex flex-col gap-1">
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
            <a href="#" className="transition-opacity hover:opacity-60">
                {product.title}
            </a>
            </h3>
            <p className="text-base font-bold text-foreground">
            {formatPrice(product.price)}
            </p>
        </div>
        </article>
    </Link>
  )
}
