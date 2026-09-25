"use client"

import { useState } from "react"
import { Check, Ruler, Truck, ShieldCheck, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const colors = [
  { name: "Чорний", value: "black", className: "bg-foreground" },
  { name: "Графіт", value: "graphite", className: "bg-muted-foreground" },
  { name: "Беж", value: "beige", className: "bg-[#c9bda8]" },
]

const sizes = ["90", "100", "110", "120", "130", "140", "150", "160"]

const perks = [
  { icon: Truck, text: "Безкоштовна доставка\nвід 2000 грн" },
  { icon: ShieldCheck, text: "Примірка перед оплатою" },
  { icon: RefreshCw, text: "Легке повернення\n14 днів" },
]

export function ProductInfo() {
  const [color, setColor] = useState("black")
  const [size, setSize] = useState("110")

  return (
    <div className="flex flex-col gap-5">
      {/* Title block */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Худі street</h1>
        <p className="text-xs text-muted-foreground">Код товару: 12345</p>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-bold md:text-3xl">890 грн</p>
        <p className="text-xs text-muted-foreground">Оплата частинами від 148 грн/міс</p>
      </div>

      {/* Color */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Колір: <span className="text-muted-foreground">{colors.find((c) => c.value === color)?.name}</span>
        </p>
        <div className="flex gap-3">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              aria-label={c.name}
              className={cn(
                "flex size-8 items-center justify-center rounded-full border transition",
                c.className,
                color === c.value ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "border-border",
              )}
            >
              {color === c.value && <Check className="size-4 text-background" />}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Розмір:</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={cn(
                "flex h-10 min-w-11 items-center justify-center border px-3 text-sm font-medium transition",
                size === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:border-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 self-start text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
          <Ruler className="size-4" />
          Таблиця розмірів
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-1">
        <Button className="h-13 w-full rounded-none text-sm font-bold tracking-widest">ДОДАТИ В КОШИК</Button>
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
          <li key={perk.text} className="flex items-center gap-3">
            <perk.icon className="size-5 shrink-0 text-muted-foreground" />
            <span className="whitespace-pre-line text-xs leading-snug text-muted-foreground">{perk.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
