"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const tabs = [
  {
    value: "description",
    label: "ОПИС",
    body: (
      <>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Стильне худі oversize для хлопчиків. Виготовлене з якісної бавовни з додаванням еластану — м&apos;яке,
          приємне до тіла та добре тримає форму. Ідеально підходить для повсякденних образів у будь-яку пору року.
        </p>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          {[
            "Тканина: 95% бавовна, 5% еластан",
            "Сезон: весна / осінь / зима",
            "Крій: oversize",
            "Капюшон: подвійний",
            "Манжети та низ на резинці",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    value: "specs",
    label: "ХАРАКТЕРИСТИКИ",
    body: (
      <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
        {[
          ["Склад", "95% бавовна, 5% еластан"],
          ["Крій", "Oversize"],
          ["Сезон", "Демісезон / зима"],
          ["Країна бренду", "Україна"],
          ["Догляд", "Прання при 30°C"],
        ].map(([k, v]) => (
          <li key={k} className="flex justify-between gap-4 border-b border-border/60 pb-2">
            <span className="font-medium text-foreground">{k}</span>
            <span className="text-right">{v}</span>
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
        Прати при температурі до 30°C у режимі для делікатних тканин. Не використовувати відбілювач. Прасувати при
        низькій температурі. Не сушити в сушильній машині — рекомендоване природне сушіння.
      </p>
    ),
  },
]

export function ProductDetails() {
  const [active, setActive] = useState("description")
  const current = tabs.find((t) => t.value === active)!

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
                  active === tab.value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-5">{current.body}</div>
        </div>

        <div className="relative order-first aspect-[4/3] overflow-hidden md:order-last md:aspect-auto md:min-h-64">
          <Image
            src="/products/hoodie-3.png"
            alt="Худі street — вид ззаду"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  )
}
