"use client"

import { useMemo, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import type { Product } from "@/lib/products"

type Props = {
  product: Product
}

/*
 * Названия старых ключей.
 *
 * Это нужно только для товаров,
 * которые были добавлены до новой админки.
 *
 * Новые товары уже имеют ключи:
 * "Склад"
 * "Сезон"
 * "Посадка"
 * "Комплектація"
 * и т.д.
 */
const LEGACY_LABELS: Record<string, string> = {
  composition: "Склад",
  season: "Сезон",
  fit: "Посадка / крій",
  set: "Комплектація",
  pants: "Особливості штанів",
  pockets: "Кишені",
  hood: "Капюшон",
  cuffs: "Манжети",
  weight: "Вага",
  dimensions: "Габарити",
  care: "Догляд",
  brand_country: "Країна бренду",
}

function getDetailLabel(key: string) {
  return LEGACY_LABELS[key] ?? key
}

function isCareDetail(key: string) {
  const normalized = key
    .trim()
    .toLowerCase()

  return (
    normalized === "care" ||
    normalized === "догляд" ||
    normalized.includes("догляд")
  )
}

export function ProductDetails({
  product,
}: Props) {
  const [active, setActive] =
    useState("description")

  /*
   * =====================================================
   * DETAILS
   * =====================================================
   *
   * Берём абсолютно все характеристики,
   * которые реально лежат в products.details.
   */

  const detailsList = useMemo(() => {
    const details =
      (product.details ??
        {}) as Record<
        string,
        unknown
      >

    return Object.entries(
      details
    )
      .filter(
        ([, value]) =>
          typeof value ===
            "string" &&
          value.trim()
            .length > 0
      )
      .map(
        ([key, value]) => ({
          key,

          label:
            getDetailLabel(
              key
            ),

          value: String(
            value
          ).trim(),
        })
      )
  }, [product.details])

  /*
   * =====================================================
   * CARE
   * =====================================================
   *
   * Поддерживает:
   *
   * старое:
   * care: "..."
   *
   * новое:
   * "Догляд": "..."
   *
   * или даже:
   * "Рекомендації з догляду": "..."
   */

  const careDetail =
    detailsList.find(
      (detail) =>
        isCareDetail(
          detail.key
        ) ||
        isCareDetail(
          detail.label
        )
    )

  const careText =
    careDetail?.value ??
    "Прати при температурі до 30°C у режимі для делікатних тканин. Не використовувати відбілювач. Прасувати при низькій температурі. Рекомендоване природне сушіння."

  /*
   * =====================================================
   * DESCRIPTION BULLETS
   * =====================================================
   *
   * Как и раньше под описанием показываем
   * короткий список характеристик.
   *
   * Догляд туда не дублируем.
   */

  const descriptionItems =
    detailsList
      .filter(
        (detail) =>
          !isCareDetail(
            detail.key
          ) &&
          !isCareDetail(
            detail.label
          )
      )
      .map(
        (detail) =>
          `${detail.label}: ${detail.value}`
      )

  /*
   * =====================================================
   * TABS
   * =====================================================
   */

  const tabs = [
    {
      value:
        "description",

      label:
        "ОПИС",

      body: (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description ||
              "Опис товару відсутній."}
          </p>

          {descriptionItems.length >
            0 && (
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {descriptionItems.map(
                (
                  item,
                  index
                ) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground" />

                    <span>
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          )}
        </>
      ),
    },

    {
      value: "specs",

      label:
        "ХАРАКТЕРИСТИКИ",

      body:
        detailsList.length >
        0 ? (
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {detailsList.map(
              (
                detail,
                index
              ) => (
                <li
                  key={`${detail.key}-${index}`}
                  className="flex justify-between gap-4 border-b border-border/60 pb-2"
                >
                  <span className="font-medium text-foreground">
                    {
                      detail.label
                    }
                  </span>

                  <span className="max-w-[60%] text-right">
                    {
                      detail.value
                    }
                  </span>
                </li>
              )
            )}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Характеристики
            товару поки не
            вказані.
          </p>
        ),
    },

    {
      value: "care",

      label: "ДОГЛЯД",

      body: (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {careText}
        </p>
      ),
    },
  ]

  const current =
    tabs.find(
      (tab) =>
        tab.value ===
        active
    ) ?? tabs[0]

  /*
   * =====================================================
   * IMAGE
   * =====================================================
   */

  const detailImage =
    product.images?.[2]
      ?.url ??
    product.images?.[1]
      ?.url ??
    product.images?.[0]
      ?.url ??
    "/placeholder.svg"

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid grid-cols-1 gap-8 bg-secondary p-6 md:grid-cols-2 md:p-10">
        {/* LEFT */}

        <div className="flex flex-col gap-6">
          {/* TABS */}

          <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border/60 pb-3">
            {tabs.map(
              (tab) => (
                <button
                  key={
                    tab.value
                  }
                  type="button"
                  onClick={() =>
                    setActive(
                      tab.value
                    )
                  }
                  className={cn(
                    "text-xs font-semibold tracking-wide transition-colors",

                    active ===
                      tab.value
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {
                    tab.label
                  }
                </button>
              )
            )}
          </div>

          {/* CONTENT */}

          <div className="flex flex-col gap-5">
            {
              current.body
            }
          </div>
        </div>

        {/* IMAGE */}

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