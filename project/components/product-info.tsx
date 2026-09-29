"use client"
import { useCart } from "@/context/cart-context"

import { useState } from "react"
import {
  Check,
  Ruler,
  Truck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  formatPrice,
  type Product,
} from "@/lib/products"

type Props = {
  product: Product
}

const perks = [
  {
    icon: Truck,
    text: "Безкоштовна доставка\nвід 2000 грн",
  },
  {
    icon: ShieldCheck,
    text: "Примірка перед оплатою",
  },
  {
    icon: RefreshCw,
    text: "Легке повернення\n14 днів",
  },
]

export function ProductInfo({
  product,
}: Props) {
  const [color, setColor] = useState(
    product.colorOptions[0]?.key ??
      product.colors[0] ??
      ""
  )
  const { addItem } = useCart()

  const [size, setSize] = useState(
    product.sizes[0] ?? ""
  )

  function isSizeAvailable(
    currentSize: string
  ) {
    // Если варианты пока не заполнены —
    // считаем размеры доступными.
    if (
      !product.variants ||
      product.variants.length === 0
    ) {
      return true
    }

    return product.variants.some(
      (variant) =>
        variant.color === color &&
        variant.size ===
          currentSize &&
        variant.stock > 0
    )
  }

  const monthlyPrice = Math.ceil(product.price / 6)

  const selectedColor = product.colorOptions.find(
    (item) => item.key === color
  )
  
  const selectedImage =
    product.images.find(
      (image) => image.color === color
    )?.url ?? product.image
  
  function handleAddToCart() {
    if (!color || !size || !selectedColor) {
      return
    }
  
    addItem({
      productId: product.id,
      variantId: `${color}-${size}`,
  
      title: product.name,
      price: product.price,
  
      image: selectedImage,
  
      colorKey: selectedColor.key,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
  
      size,
      qty: 1,
    })
  }
  return (
    <div className="flex flex-col gap-5">
      {/* Title block */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {product.name}
        </h1>

        <p className="text-xs text-muted-foreground">
          Код товару: {product.sku}
        </p>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-bold md:text-3xl">
          {formatPrice(
            product.price
          )}
        </p>

        <p className="text-xs text-muted-foreground">
          Оплата частинами від{" "}
          {monthlyPrice} грн/міс
        </p>
      </div>

      {/* Color */}
      {product.colorOptions.length >
        0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">
            Колір:{" "}
            <span className="text-muted-foreground">
              {selectedColor?.name ??
                ""}
            </span>
          </p>

          <div className="flex gap-3">
            {product.colorOptions.map(
              (c) => (
                <button
                  key={c.key}
                  onClick={() => {
                    setColor(c.key)

                    const firstAvailableSize =
                      product.sizes.find(
                        (currentSize) => {
                          if (
                            product
                              .variants
                              .length ===
                            0
                          ) {
                            return true
                          }

                          return product.variants.some(
                            (
                              variant
                            ) =>
                              variant.color ===
                                c.key &&
                              variant.size ===
                                currentSize &&
                              variant.stock >
                                0
                          )
                        }
                      )

                    if (
                      firstAvailableSize
                    ) {
                      setSize(
                        firstAvailableSize
                      )
                    }
                  }}
                  aria-label={
                    c.name
                  }
                  title={c.name}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border transition",
                    color === c.key
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : "border-border"
                  )}
                  style={{
                    backgroundColor:
                      c.hex,
                  }}
                >
                  {color ===
                    c.key && (
                    <Check className="size-4 text-background" />
                  )}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Size */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Розмір:
        </p>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map(
            (s) => {
              const available =
                isSizeAvailable(s)

              return (
                <button
                  key={s}
                  disabled={
                    !available
                  }
                  onClick={() =>
                    setSize(s)
                  }
                  className={cn(
                    "flex h-10 min-w-11 items-center justify-center border px-3 text-sm font-medium transition",

                    size === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:border-foreground",

                    !available &&
                      "cursor-not-allowed opacity-30"
                  )}
                >
                  {s}
                </button>
              )
            }
          )}
        </div>

        <button className="flex items-center gap-2 self-start text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
          <Ruler className="size-4" />
          Таблиця розмірів
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-1">
        <Button
        onClick={handleAddToCart}
        className="h-13 w-full rounded-none text-sm font-bold tracking-widest">
          ДОДАТИ В КОШИК
        </Button>

        <Button
          variant="secondary"
          className="h-13 w-full rounded-none text-sm font-bold tracking-widest"
        >
          КУПИТИ В 1 КЛІК
        </Button>
      </div>

      {/* Perks */}
      <ul className="flex flex-col gap-4 pt-2">
        {perks.map((perk) => (
          <li
            key={perk.text}
            className="flex items-center gap-3"
          >
            <perk.icon className="size-5 shrink-0 text-muted-foreground" />

            <span className="whitespace-pre-line text-xs leading-snug text-muted-foreground">
              {perk.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}