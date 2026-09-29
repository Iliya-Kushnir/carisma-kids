"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/products"

type Props = {
  product: Product
}

export function ProductDetails({ product }: Props) {
  const [active, setActive] = useState("description")

  const detailsList = [
    ["Склад", product.details.composition],
    ["Крій", product.details.fit],
    ["Сезон", product.details.season],
    ["Країна бренду", product.details.brand_country ?? "Україна"],
    ["Догляд", product.details.care ?? "Прання при 30°C"],
  ].filter(([, value]) => Boolean(value))

  const descriptionItems = [
    product.details.composition
      ? `Тканина: ${product.details.composition}`
      : null,

    product.details.season
      ? `Сезон: ${product.details.season}`
      : null,

    product.details.fit
      ? `Крій: ${product.details.fit}`
      : null,

    product.details.hood
      ? `Капюшон: ${product.details.hood}`
      : null,

    product.details.cuffs
      ? product.details.cuffs
      : null,
  ].filter(Boolean) as string[]

  const tabs = [
    {
      value: "description",
      label: "ОПИС",
      body: (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description || "Опис товару відсутній."}
          </p>

          {descriptionItems.length > 0 && (
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {descriptionItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2"
                >
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground" />

                  {item}
                </li>
              ))}
            </ul>
          )}
        </>
      ),
    },

    {
      value: "specs",
      label: "ХАРАКТЕРИСТИКИ",
      body: (
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          {detailsList.map(([key, value]) => (
            <li
              key={key}
              className="flex justify-between gap-4 border-b border-border/60 pb-2"
            >
              <span className="font-medium text-foreground">
                {key}
              </span>

              <span className="text-right">
                {value}
              </span>
            </li>
          ))}
        </ul>
      ),
    },

    {
      value: "care",
      label: "ДОГЛЯД",
      body: (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.details.care ??
            "Прати при температурі до 30°C у режимі для делікатних тканин. Не використовувати відбілювач. Прасувати при низькій температурі. Рекомендоване природне сушіння."}
        </p>
      ),
    },
  ]

  const current = tabs.find(
    (tab) => tab.value === active
  )!

  const detailImage =
    product.images[2]?.url ??
    product.images[1]?.url ??
    product.images[0]?.url ??
    "/placeholder.svg"

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid grid-cols-1 gap-8 bg-secondary p-6 md:grid-cols-2 md:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border/60 pb-3">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActive(tab.value)}
                className={cn(
                  "text-xs font-semibold tracking-wide transition-colors",
                  active === tab.value
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            {current.body}
          </div>
        </div>

        <div className="relative order-first aspect-[4/3] overflow-hidden md:order-last md:aspect-auto md:min-h-64">
          <Image
            src={detailImage}
            alt={`${product.name} — деталі`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  )
}