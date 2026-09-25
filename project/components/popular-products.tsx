"use client"

import Image from "next/image"
import { Heart, ArrowRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

type Product = {
  name: string
  price: string
  image: string
  colors: string[]
}

const products: Product[] = [
  {
    name: "Костюм оверсайз",
    price: "1 290 грн",
    image: "/images/v2/prod-suit.png",
    colors: ["#c9b79c", "#9a8f80", "#2b2b2b"],
  },
  {
    name: "Футболка basic",
    price: "590 грн",
    image: "/images/v2/prod-tshirt.png",
    colors: ["#c9b79c", "#8a8078", "#2b2b2b"],
  },
  {
    name: "Худі street",
    price: "890 грн",
    image: "/images/v2/prod-hoodie.png",
    colors: ["#c9b79c", "#7d7468", "#2b2b2b"],
  },
  {
    name: "Джинси wide",
    price: "990 грн",
    image: "/images/v2/prod-jeans.png",
    colors: ["#9fb3c8", "#4a5b6d", "#2b2b2b"],
  },
  {
    name: "Світшот оверсайз",
    price: "790 грн",
    image: "/images/v2/prod-sweat.png",
    colors: ["#c9b79c", "#9a8f80", "#2b2b2b"],
  },
]

export function PopularProducts() {
  return (
    <section id="catalog" className="bg-background py-10 lg:py-14">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-[0.15em] text-foreground lg:text-xl">
            БЕСТСЕЛЕРИ
          </h2>
          <a
            href="#"
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Дивитись усі
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false)

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-label={liked ? "Прибрати з обраного" : "Додати в обране"}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-colors hover:bg-background"
        >
          <Heart className={cn("h-4 w-4", liked && "fill-foreground")} />
        </button>
      </div>
      <h3 className="mt-3 text-sm font-medium text-foreground">{product.name}</h3>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{product.price}</p>
      <div className="mt-2 flex items-center gap-1.5">
        {product.colors.map((c, i) => (
          <span
            key={i}
            className="h-3.5 w-3.5 rounded-full border border-border"
            style={{ backgroundColor: c }}
            aria-hidden="true"
          />
        ))}
      </div>
    </article>
  )
}
