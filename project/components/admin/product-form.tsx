"use client"

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"

import {
  ArrowDown,
  ArrowUp,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { useRouter } from "next/navigation"

import {
  createProduct,
  type ProductColorInput,
} from "@/lib/admin/create-product"

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = [
  "Костюми",
  "Худі",
  "Світшоти",
  "Футболки",
  "Штани",
  "Джинси",
  "Куртки",
  "Шорти",
  "Взуття",
  "Аксесуари",
]

/* =========================================================
   PRODUCT TYPES
========================================================= */

const PRODUCT_TYPES = [
  {
    value: "suit",
    label: "Костюм",
    skuPrefix: "SUIT",
  },
  {
    value: "hoodie",
    label: "Худі",
    skuPrefix: "HOOD",
  },
  {
    value: "sweatshirt",
    label: "Світшот",
    skuPrefix: "SWEAT",
  },
  {
    value: "tshirt",
    label: "Футболка",
    skuPrefix: "TSHIRT",
  },
  {
    value: "pants",
    label: "Штани",
    skuPrefix: "PANTS",
  },
  {
    value: "jeans",
    label: "Джинси",
    skuPrefix: "JEANS",
  },
  {
    value: "jacket",
    label: "Куртка",
    skuPrefix: "JACKET",
  },
  {
    value: "shorts",
    label: "Шорти",
    skuPrefix: "SHORTS",
  },
  {
    value: "shoes",
    label: "Взуття",
    skuPrefix: "SHOES",
  },
  {
    value: "accessory",
    label: "Аксесуар",
    skuPrefix: "ACC",
  },
]

/* =========================================================
   SIZES
========================================================= */

const CLOTHING_SIZES = [
  "90",
  "100",
  "110",
  "120",
  "130",
  "140",
  "150",
  "160",
  "170",
]

const SHOE_SIZES = [
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
]

/* =========================================================
   COLORS
========================================================= */

const COLOR_PRESETS = [
  {
    key: "black",
    name: "Чорний",
    hex: "#1F1F1F",
  },
  {
    key: "gray",
    name: "Сірий",
    hex: "#85817B",
  },
  {
    key: "white",
    name: "Білий",
    hex: "#F5F5F5",
  },
  {
    key: "beige",
    name: "Бежевий",
    hex: "#CFC1AA",
  },
  {
    key: "cream",
    name: "Молочний",
    hex: "#E8E2D4",
  },
  {
    key: "blue",
    name: "Синій",
    hex: "#43566B",
  },
  {
    key: "navy",
    name: "Темно-синій",
    hex: "#253347",
  },
  {
    key: "brown",
    name: "Коричневий",
    hex: "#6B4C3B",
  },
  {
    key: "green",
    name: "Зелений",
    hex: "#536554",
  },
  {
    key: "pink",
    name: "Рожевий",
    hex: "#D9A6AE",
  },
  {
    key: "red",
    name: "Червоний",
    hex: "#A94343",
  },
]

/* =========================================================
   CHARACTERISTIC SUGGESTIONS

   Это НЕ обязательные характеристики.
   Это просто быстрые подсказки менеджеру.
========================================================= */

const CHARACTERISTIC_SUGGESTIONS: Record<
  string,
  string[]
> = {
  suit: [
    "Склад",
    "Сезон",
    "Посадка",
    "Комплектація",
    "Особливості штанів",
    "Кишені",
    "Догляд",
  ],

  hoodie: [
    "Склад",
    "Сезон",
    "Крій",
    "Капюшон",
    "Кишені",
    "Манжети",
    "Догляд",
  ],

  sweatshirt: [
    "Склад",
    "Сезон",
    "Крій",
    "Манжети",
    "Догляд",
  ],

  tshirt: [
    "Склад",
    "Сезон",
    "Крій",
    "Довжина рукава",
    "Догляд",
  ],

  pants: [
    "Склад",
    "Сезон",
    "Посадка",
    "Крій",
    "Пояс",
    "Кишені",
    "Догляд",
  ],

  jeans: [
    "Склад",
    "Сезон",
    "Посадка",
    "Крій",
    "Застібка",
    "Кишені",
    "Догляд",
  ],

  jacket: [
    "Матеріал",
    "Утеплювач",
    "Сезон",
    "Капюшон",
    "Застібка",
    "Кишені",
    "Догляд",
  ],

  shorts: [
    "Склад",
    "Сезон",
    "Посадка",
    "Пояс",
    "Кишені",
    "Догляд",
  ],

  shoes: [
    "Матеріал верху",
    "Матеріал підошви",
    "Сезон",
    "Застібка",
    "Підкладка",
    "Догляд",
  ],

  accessory: [
    "Матеріал",
    "Розмір",
    "Особливості",
    "Комплектація",
    "Догляд",
  ],
}

/* =========================================================
   TYPES
========================================================= */

type Audience =
  | "boys"
  | "girls"
  | "unisex"

type VariantValue = {
  stock: string
  price: string
}

type Characteristic = {
  id: string
  label: string
  value: string
}

/* =========================================================
   HELPERS
========================================================= */

function slugify(value: string) {
  const map: Record<
    string,
    string
  > = {
    а: "a",
    б: "b",
    в: "v",
    г: "h",
    ґ: "g",
    д: "d",
    е: "e",
    є: "ie",
    ж: "zh",
    з: "z",
    и: "y",
    і: "i",
    ї: "i",
    й: "i",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ь: "",
    ю: "iu",
    я: "ia",
  }

  return value
    .toLowerCase()
    .split("")
    .map(
      (char) =>
        map[char] ??
        char
    )
    .join("")
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    )
}

function parseMoney(
  value: string
) {
  return Number(
    value.replace(
      ",",
      "."
    )
  )
}

function sortSizes(
  sizes: string[]
) {
  return [...sizes].sort(
    (a, b) => {
      const aNumber =
        Number(a)

      const bNumber =
        Number(b)

      const aIsNumber =
        Number.isFinite(
          aNumber
        )

      const bIsNumber =
        Number.isFinite(
          bNumber
        )

      if (
        aIsNumber &&
        bIsNumber
      ) {
        return (
          aNumber -
          bNumber
        )
      }

      if (aIsNumber) {
        return -1
      }

      if (bIsNumber) {
        return 1
      }

      return a.localeCompare(
        b,
        "uk"
      )
    }
  )
}

/* =========================================================
   IMAGE PREVIEW
========================================================= */

function FilePreview({
  file,
}: {
  file: File
}) {
  const [src, setSrc] =
    useState("")

  useEffect(() => {
    const url =
      URL.createObjectURL(
        file
      )

    setSrc(url)

    return () => {
      URL.revokeObjectURL(
        url
      )
    }
  }, [file])

  if (!src) {
    return (
      <div className="size-16 bg-muted" />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={file.name}
      className="size-16 shrink-0 object-cover"
    />
  )
}

/* =========================================================
   COMPONENT
========================================================= */

export function ProductForm() {
  const router =
    useRouter()

  /* =======================================================
     BASIC
  ======================================================= */

  const [
    name,
    setName,
  ] =
    useState("")

  const [
    description,
    setDescription,
  ] =
    useState("")

  const [
    price,
    setPrice,
  ] =
    useState("")

  const [
    compareAtPrice,
    setCompareAtPrice,
  ] =
    useState("")

  const [
    productType,
    setProductType,
  ] =
    useState("")

  const [
    audience,
    setAudience,
  ] =
    useState<Audience>(
      "boys"
    )

  const [
    categories,
    setCategories,
  ] =
    useState<string[]>(
      []
    )

  /* =======================================================
     SIZES
  ======================================================= */

  const [
    selectedSizes,
    setSelectedSizes,
  ] =
    useState<string[]>(
      []
    )

  const [
    customSize,
    setCustomSize,
  ] =
    useState("")

  /* =======================================================
     COLORS
  ======================================================= */

  const [
    colors,
    setColors,
  ] =
    useState<
      ProductColorInput[]
    >([])

  /* =======================================================
     VARIANTS
  ======================================================= */

  const [
    variants,
    setVariants,
  ] =
    useState<
      Record<
        string,
        VariantValue
      >
    >({})

  /* =======================================================
     CHARACTERISTICS
  ======================================================= */

  const [
    characteristics,
    setCharacteristics,
  ] =
    useState<
      Characteristic[]
    >([])

  /* =======================================================
     PUBLICATION
  ======================================================= */

  const [
    isFeatured,
    setIsFeatured,
  ] =
    useState(false)

  const [
    isActive,
    setIsActive,
  ] =
    useState(true)

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const [
    error,
    setError,
  ] =
    useState("")

  /* =======================================================
     COMPUTED
  ======================================================= */

  const isAccessory =
    productType ===
    "accessory"

  const isShoes =
    productType ===
    "shoes"

  const sizePresets =
    isShoes
      ? SHOE_SIZES
      : CLOTHING_SIZES

  /*
   * Для аксессуара создаём технический вариант ONE.
   *
   * Менеджер его не видит как обычный размер.
   */
  const effectiveSizes =
    useMemo(
      () =>
        isAccessory
          ? ["ONE"]
          : sortSizes(
              selectedSizes
            ),
      [
        isAccessory,
        selectedSizes,
      ]
    )

  const suggestedCharacteristics =
    CHARACTERISTIC_SUGGESTIONS[
      productType
    ] ?? []

  /* =======================================================
     CATEGORIES
  ======================================================= */

  function toggleCategory(
    category: string
  ) {
    setCategories(
      (current) =>
        current.includes(
          category
        )
          ? current.filter(
              (item) =>
                item !==
                category
            )
          : [
              ...current,
              category,
            ]
    )
  }

  /* =======================================================
     SIZES
  ======================================================= */

  function toggleSize(
    size: string
  ) {
    setSelectedSizes(
      (current) =>
        current.includes(
          size
        )
          ? current.filter(
              (item) =>
                item !==
                size
            )
          : [
              ...current,
              size,
            ]
    )
  }

  function addCustomSize() {
    const value =
      customSize.trim()

    if (!value) {
      return
    }

    setSelectedSizes(
      (current) =>
        current.includes(
          value
        )
          ? current
          : [
              ...current,
              value,
            ]
    )

    setCustomSize("")
  }

  function handleProductTypeChange(
    value: string
  ) {
    setProductType(
      value
    )

    /*
     * Чтобы размеры предыдущего типа
     * случайно не попали в новый товар.
     */
    setSelectedSizes([])

    setVariants({})
  }

  /* =======================================================
     COLORS
  ======================================================= */

  function addColor() {
    const firstAvailable =
      COLOR_PRESETS.find(
        (preset) =>
          !colors.some(
            (color) =>
              color.key ===
              preset.key
          )
      )

    if (!firstAvailable) {
      setError(
        "Усі доступні кольори вже додані."
      )

      return
    }

    setError("")

    setColors(
      (current) => [
        ...current,

        {
          id:
            crypto.randomUUID(),

          key:
            firstAvailable.key,

          name:
            firstAvailable.name,

          hex:
            firstAvailable.hex,

          files: [],
        },
      ]
    )
  }

  function updateColor(
    id: string,
    key: string
  ) {
    const preset =
      COLOR_PRESETS.find(
        (item) =>
          item.key === key
      )

    if (!preset) {
      return
    }

    const duplicate =
      colors.some(
        (color) =>
          color.id !== id &&
          color.key === key
      )

    if (duplicate) {
      setError(
        "Цей колір вже доданий."
      )

      return
    }

    setError("")

    setColors(
      (current) =>
        current.map(
          (color) =>
            color.id === id
              ? {
                  ...color,

                  key:
                    preset.key,

                  name:
                    preset.name,

                  hex:
                    preset.hex,
                }
              : color
        )
    )
  }

  function removeColor(
    id: string
  ) {
    setColors(
      (current) =>
        current.filter(
          (color) =>
            color.id !== id
        )
    )

    /*
     * Удаляем значения stock/price
     * удалённого цвета.
     */
    setVariants(
      (current) => {
        const next = {
          ...current,
        }

        Object.keys(
          next
        ).forEach(
          (key) => {
            if (
              key.startsWith(
                `${id}:`
              )
            ) {
              delete next[key]
            }
          }
        )

        return next
      }
    )
  }

  /* =======================================================
     IMAGES
  ======================================================= */

  function handleFiles(
    colorId: string,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files =
      Array.from(
        event.target
          .files ?? []
      )

    const allowed =
      files.filter(
        (file) => {
          const validType =
            [
              "image/jpeg",
              "image/png",
              "image/webp",
            ].includes(
              file.type
            )

          const validSize =
            file.size <=
            8 *
              1024 *
              1024

          return (
            validType &&
            validSize
          )
        }
      )

    if (
      allowed.length !==
      files.length
    ) {
      setError(
        "Дозволені тільки JPG, PNG або WEBP до 8 МБ."
      )
    } else {
      setError("")
    }

    setColors(
      (current) =>
        current.map(
          (color) =>
            color.id ===
            colorId
              ? {
                  ...color,

                  files: [
                    ...color.files,
                    ...allowed,
                  ],
                }
              : color
        )
    )

    event.target.value =
      ""
  }

  function removeFile(
    colorId: string,
    index: number
  ) {
    setColors(
      (current) =>
        current.map(
          (color) => {
            if (
              color.id !==
              colorId
            ) {
              return color
            }

            return {
              ...color,

              files:
                color.files.filter(
                  (
                    _,
                    fileIndex
                  ) =>
                    fileIndex !==
                    index
                ),
            }
          }
        )
    )
  }

  function moveFile(
    colorId: string,
    index: number,
    direction:
      | -1
      | 1
  ) {
    setColors(
      (current) =>
        current.map(
          (color) => {
            if (
              color.id !==
              colorId
            ) {
              return color
            }

            const next = [
              ...color.files,
            ]

            const target =
              index +
              direction

            if (
              target < 0 ||
              target >=
                next.length
            ) {
              return color
            }

            ;[
              next[index],
              next[target],
            ] = [
              next[target],
              next[index],
            ]

            return {
              ...color,
              files: next,
            }
          }
        )
    )
  }

  /* =======================================================
     VARIANTS
  ======================================================= */

  function variantKey(
    colorId: string,
    size: string
  ) {
    return `${colorId}:${size}`
  }

  function setVariantValue(
    colorId: string,
    size: string,
    field:
      | "stock"
      | "price",
    value: string
  ) {
    const key =
      variantKey(
        colorId,
        size
      )

    setVariants(
      (current) => ({
        ...current,

        [key]: {
          stock:
            current[key]
              ?.stock ??
            "",

          price:
            current[key]
              ?.price ??
            "",

          [field]:
            value,
        },
      })
    )
  }

  /* =======================================================
     CHARACTERISTICS
  ======================================================= */

  function addCharacteristic(
    label = ""
  ) {
    /*
     * Если такая характеристика уже
     * существует, второй раз её не добавляем.
     */
    if (
      label &&
      characteristics.some(
        (item) =>
          item.label ===
          label
      )
    ) {
      return
    }

    setCharacteristics(
      (current) => [
        ...current,

        {
          id:
            crypto.randomUUID(),

          label,

          value: "",
        },
      ]
    )
  }

  function updateCharacteristic(
    id: string,
    field:
      | "label"
      | "value",
    value: string
  ) {
    setCharacteristics(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  [field]:
                    value,
                }
              : item
        )
    )
  }

  function removeCharacteristic(
    id: string
  ) {
    setCharacteristics(
      (current) =>
        current.filter(
          (item) =>
            item.id !== id
        )
    )
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (saving) {
      return
    }

    setError("")

    /* -----------------------
       BASIC VALIDATION
    ----------------------- */

    if (!name.trim()) {
      setError(
        "Вкажіть назву товару."
      )

      return
    }

    const numericPrice =
      parseMoney(price)

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice <= 0
    ) {
      setError(
        "Вкажіть правильну базову ціну."
      )

      return
    }

    if (!productType) {
      setError(
        "Оберіть тип товару."
      )

      return
    }

    if (
      categories.length ===
      0
    ) {
      setError(
        "Оберіть хоча б одну категорію."
      )

      return
    }

    if (
      !isAccessory &&
      selectedSizes.length ===
        0
    ) {
      setError(
        "Оберіть хоча б один розмір."
      )

      return
    }

    if (
      colors.length ===
      0
    ) {
      setError(
        "Додайте хоча б один колір."
      )

      return
    }

    /* -----------------------
       COLORS
    ----------------------- */

    const colorKeys =
      colors.map(
        (color) =>
          color.key
      )

    if (
      new Set(
        colorKeys
      ).size !==
      colorKeys.length
    ) {
      setError(
        "Один колір не можна додавати декілька разів."
      )

      return
    }

    /*
     * Для опубликованного товара
     * требуем фото КАЖДОГО цвета.
     *
     * Иначе покупатель выберет цвет,
     * а фотографий не будет.
     */
    if (isActive) {
      const colorWithoutImages =
        colors.find(
          (color) =>
            color.files
              .length === 0
        )

      if (
        colorWithoutImages
      ) {
        setError(
          `Додайте хоча б одне фото для кольору "${colorWithoutImages.name}".`
        )

        return
      }
    }

    /* -----------------------
       VARIANTS
    ----------------------- */

    const preparedVariants =
      colors.flatMap(
        (color) =>
          effectiveSizes.map(
            (size) => {
              const value =
                variants[
                  variantKey(
                    color.id,
                    size
                  )
                ]

              const stock =
                Math.max(
                  0,
                  Number(
                    value
                      ?.stock ||
                      0
                  )
                )

              const variantPrice =
                value?.price
                  ? parseMoney(
                      value.price
                    )
                  : undefined

              return {
                id:
                  crypto.randomUUID(),

                color:
                  color.key,

                size,

                stock,

                ...(variantPrice &&
                Number.isFinite(
                  variantPrice
                ) &&
                variantPrice >
                  0
                  ? {
                      price:
                        variantPrice,
                    }
                  : {}),
              }
            }
          )
      )

    if (
      isActive &&
      !preparedVariants.some(
        (variant) =>
          variant.stock >
          0
      )
    ) {
      setError(
        "Для активного товару вкажіть хоча б один залишок більше 0."
      )

      return
    }

    /* -----------------------
       CHARACTERISTICS
    ----------------------- */

    /*
     * details остаётся JSONB object,
     * поэтому миграцию БД делать не нужно.
     *
     * Например:
     *
     * {
     *   "Склад": "95% бавовна",
     *   "Крій": "Oversize"
     * }
     */
    const preparedDetails =
      characteristics.reduce<
        Record<
          string,
          string
        >
      >(
        (
          result,
          item
        ) => {
          const label =
            item.label.trim()

          const value =
            item.value.trim()

          if (
            label &&
            value
          ) {
            result[label] =
              value
          }

          return result
        },
        {}
      )

    /* -----------------------
       AUTO SLUG + SKU
    ----------------------- */

    const uniqueCode =
      crypto
        .randomUUID()
        .replaceAll(
          "-",
          ""
        )
        .slice(
          0,
          6
        )
        .toUpperCase()

    const baseSlug =
      slugify(
        name.trim()
      ) || "product"

    const generatedSlug =
      `${baseSlug}-${uniqueCode.toLowerCase()}`

    const selectedType =
      PRODUCT_TYPES.find(
        (item) =>
          item.value ===
          productType
      )

    const generatedSku =
      `CK-${
        selectedType
          ?.skuPrefix ??
        "ITEM"
      }-${uniqueCode}`

    /* -----------------------
       COMPARE PRICE
    ----------------------- */

    const numericComparePrice =
      compareAtPrice.trim()
        ? parseMoney(
            compareAtPrice
          )
        : null

    if (
      numericComparePrice !==
        null &&
      (
        !Number.isFinite(
          numericComparePrice
        ) ||
        numericComparePrice <=
          0
      )
    ) {
      setError(
        "Стара ціна вказана неправильно."
      )

      return
    }

    /* -----------------------
       CREATE
    ----------------------- */

    try {
      setSaving(true)

      await createProduct({
        name:
          name.trim(),

        slug:
          generatedSlug,

        sku:
          generatedSku,

        description:
          description.trim(),

        price:
          numericPrice,

        compareAtPrice:
          numericComparePrice,

        productType,

        audience,

        categories,

        /*
         * ONE нужен для текущей модели variants.
         * Потом на витрине аксессуару просто
         * не показываем выбор размера.
         */
        sizes:
          effectiveSizes,

        colors,

        variants:
          preparedVariants,

        details:
          preparedDetails,

        isFeatured,

        isActive,
      })

      router.push(
        "/admin/products"
      )

      router.refresh()
    } catch (error) {
      console.error(
        "CREATE PRODUCT ERROR:",
        error
      )

      const message =
        error instanceof
        Error
          ? error.message
          : String(error)

      if (
        message.includes(
          "products_slug_unique"
        ) ||
        message.includes(
          "products_sku_unique"
        ) ||
        message.includes(
          "duplicate key value"
        )
      ) {
        setError(
          "Не вдалося створити унікальний код товару. Спробуйте зберегти ще раз."
        )
      } else {
        setError(
          `Не вдалося створити товар: ${message}`
        )
      }
    } finally {
      setSaving(false)
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="flex flex-col gap-8"
    >
      {/* ERROR */}

      {error && (
        <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ===================================================
          BASIC
      =================================================== */}

      <section className="border border-border bg-background">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-lg font-bold">
            Основна інформація
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Назва товару *
            </label>

            <input
              value={name}
              onChange={(
                event
              ) =>
                setName(
                  event.target
                    .value
                )
              }
              className="h-12 w-full border border-border bg-background px-4 outline-none transition focus:border-foreground"
              placeholder="Костюм-двійка з імітацією сорочки"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Опис
            </label>

            <textarea
              value={
                description
              }
              onChange={(
                event
              ) =>
                setDescription(
                  event.target
                    .value
                )
              }
              rows={7}
              className="w-full resize-y border border-border bg-background p-4 outline-none transition focus:border-foreground"
              placeholder="Повний опис товару..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Базова ціна *
            </label>

            <input
              value={price}
              onChange={(
                event
              ) =>
                setPrice(
                  event.target
                    .value
                )
              }
              inputMode="decimal"
              className="h-12 w-full border border-border bg-background px-4 outline-none transition focus:border-foreground"
              placeholder="1790"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Основна ціна.
              Для окремого
              розміру її можна
              перевизначити нижче.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Стара ціна
            </label>

            <input
              value={
                compareAtPrice
              }
              onChange={(
                event
              ) =>
                setCompareAtPrice(
                  event.target
                    .value
                )
              }
              inputMode="decimal"
              className="h-12 w-full border border-border bg-background px-4 outline-none transition focus:border-foreground"
              placeholder="Наприклад 2190"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Використовується
              тільки для показу
              знижки.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Тип товару *
            </label>

            <select
              value={
                productType
              }
              onChange={(
                event
              ) =>
                handleProductTypeChange(
                  event.target
                    .value
                )
              }
              className="h-12 w-full border border-border bg-background px-4 outline-none focus:border-foreground"
            >
              <option value="">
                Оберіть тип
              </option>

              {PRODUCT_TYPES.map(
                (type) => (
                  <option
                    key={
                      type.value
                    }
                    value={
                      type.value
                    }
                  >
                    {
                      type.label
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Для кого *
            </label>

            <select
              value={
                audience
              }
              onChange={(
                event
              ) =>
                setAudience(
                  event.target
                    .value as
                    Audience
                )
              }
              className="h-12 w-full border border-border bg-background px-4 outline-none focus:border-foreground"
            >
              <option value="boys">
                Хлопчикам
              </option>

              <option value="girls">
                Дівчаткам
              </option>

              <option value="unisex">
                Unisex
              </option>
            </select>
          </div>

          {/* SYSTEM INFO */}

          <div className="md:col-span-2 rounded-sm bg-muted/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Системні дані
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              SKU та URL товару
              будуть створені
              автоматично після
              збереження. Менеджеру
              їх заповнювати не
              потрібно.
            </p>

            {name && (
              <p className="mt-2 break-all text-xs text-muted-foreground">
                URL: /product/
                {slugify(name)}
                -xxxxxx
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          CATEGORIES
      =================================================== */}

      <section className="border border-border bg-background">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-lg font-bold">
            Категорії
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Можна обрати
            декілька категорій.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 p-6">
          {CATEGORIES.map(
            (category) => {
              const active =
                categories.includes(
                  category
                )

              return (
                <button
                  key={
                    category
                  }
                  type="button"
                  onClick={() =>
                    toggleCategory(
                      category
                    )
                  }
                  className={`border px-4 py-2 text-sm transition ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {
                    category
                  }
                </button>
              )
            }
          )}
        </div>
      </section>

      {/* ===================================================
          SIZES
      =================================================== */}

      {productType && (
        <section className="border border-border bg-background">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-bold">
              Розміри
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isAccessory
                ? "Для аксесуара використовується один технічний варіант без вибору розміру."
                : "Оберіть усі розміри, які можуть бути доступні для товару."}
            </p>
          </div>

          {!isAccessory && (
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {sizePresets.map(
                  (size) => {
                    const active =
                      selectedSizes.includes(
                        size
                      )

                    return (
                      <button
                        key={
                          size
                        }
                        type="button"
                        onClick={() =>
                          toggleSize(
                            size
                          )
                        }
                        className={`flex h-11 min-w-14 items-center justify-center border px-3 text-sm font-semibold transition ${
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {
                          size
                        }
                      </button>
                    )
                  }
                )}
              </div>

              {/* CUSTOM SIZE */}

              <div className="mt-6 flex max-w-sm gap-2">
                <input
                  value={
                    customSize
                  }
                  onChange={(
                    event
                  ) =>
                    setCustomSize(
                      event.target
                        .value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault()

                      addCustomSize()
                    }
                  }}
                  className="h-11 flex-1 border border-border bg-background px-3 outline-none focus:border-foreground"
                  placeholder="Інший розмір, напр. S"
                />

                <button
                  type="button"
                  onClick={
                    addCustomSize
                  }
                  className="h-11 border border-foreground px-4 text-sm font-semibold"
                >
                  Додати
                </button>
              </div>

              {/* SELECTED */}

              {selectedSizes.length >
                0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {sortSizes(
                    selectedSizes
                  ).map(
                    (size) => (
                      <span
                        key={
                          size
                        }
                        className="flex items-center gap-2 bg-muted px-3 py-2 text-xs"
                      >
                        {
                          size
                        }

                        <button
                          type="button"
                          onClick={() =>
                            toggleSize(
                              size
                            )
                          }
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ===================================================
          COLORS + PHOTOS
      =================================================== */}

      <section className="border border-border bg-background">
        <div className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">
              Кольори та фото
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Завантажуйте
              фотографії окремо
              для кожного кольору.
            </p>
          </div>

          <button
            type="button"
            onClick={addColor}
            className="flex items-center justify-center gap-2 border border-foreground px-4 py-2 text-sm font-semibold"
          >
            <Plus className="size-4" />

            Додати колір
          </button>
        </div>

        <div className="flex flex-col divide-y divide-border">
          {colors.length ===
          0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Додайте хоча б
              один колір товару.
            </div>
          ) : (
            colors.map(
              (
                color,
                colorIndex
              ) => (
                <div
                  key={
                    color.id
                  }
                  className="p-6"
                >
                  <div className="mb-5 flex flex-wrap items-center gap-4">
                    <span
                      className="size-8 rounded-full border border-border"
                      style={{
                        backgroundColor:
                          color.hex,
                      }}
                    />

                    <select
                      value={
                        color.key
                      }
                      onChange={(
                        event
                      ) =>
                        updateColor(
                          color.id,
                          event
                            .target
                            .value
                        )
                      }
                      className="h-11 min-w-48 border border-border bg-background px-3"
                    >
                      {COLOR_PRESETS.map(
                        (
                          preset
                        ) => (
                          <option
                            key={
                              preset.key
                            }
                            value={
                              preset.key
                            }
                          >
                            {
                              preset.name
                            }
                          </option>
                        )
                      )}
                    </select>

                    <span className="text-sm text-muted-foreground">
                      {
                        color.hex
                      }
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeColor(
                          color.id
                        )
                      }
                      className="ml-auto flex size-10 items-center justify-center border border-border text-muted-foreground transition hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* UPLOAD */}

                  <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-border p-8 text-center transition hover:border-foreground">
                    <Upload className="mb-3 size-6 text-muted-foreground" />

                    <span className="text-sm font-semibold">
                      Завантажити
                      фото кольору
                      «
                      {
                        color.name
                      }
                      »
                    </span>

                    <span className="mt-1 text-xs text-muted-foreground">
                      JPG, PNG або
                      WEBP · до 8 МБ
                    </span>

                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(
                        event
                      ) =>
                        handleFiles(
                          color.id,
                          event
                        )
                      }
                      className="hidden"
                    />
                  </label>

                  {/* IMAGES */}

                  {color.files
                    .length >
                    0 && (
                    <div className="mt-5 flex flex-col gap-2">
                      {color.files.map(
                        (
                          file,
                          index
                        ) => (
                          <div
                            key={`${file.name}-${file.lastModified}-${index}`}
                            className="flex items-center gap-3 border border-border p-3"
                          >
                            <FilePreview
                              file={
                                file
                              }
                            />

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {
                                  file.name
                                }
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {(
                                  file.size /
                                  1024 /
                                  1024
                                ).toFixed(
                                  2
                                )}{" "}
                                MB
                              </p>

                              {index ===
                                0 && (
                                <p className="mt-1 text-xs font-semibold">
                                  Головне фото цього кольору
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              disabled={
                                index ===
                                0
                              }
                              onClick={() =>
                                moveFile(
                                  color.id,
                                  index,
                                  -1
                                )
                              }
                              className="flex size-8 items-center justify-center disabled:opacity-30"
                              title="Перемістити вище"
                            >
                              <ArrowUp className="size-4" />
                            </button>

                            <button
                              type="button"
                              disabled={
                                index ===
                                color
                                  .files
                                  .length -
                                  1
                              }
                              onClick={() =>
                                moveFile(
                                  color.id,
                                  index,
                                  1
                                )
                              }
                              className="flex size-8 items-center justify-center disabled:opacity-30"
                              title="Перемістити нижче"
                            >
                              <ArrowDown className="size-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeFile(
                                  color.id,
                                  index
                                )
                              }
                              className="flex size-8 items-center justify-center text-muted-foreground transition hover:text-red-600"
                              title="Видалити"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <p className="mt-4 text-xs text-muted-foreground">
                    Колір №
                    {colorIndex +
                      1}
                    :{" "}
                    <strong>
                      {
                        color.name
                      }
                    </strong>
                  </p>
                </div>
              )
            )
          )}
        </div>
      </section>

      {/* ===================================================
          STOCK + VARIANT PRICE
      =================================================== */}

      {colors.length >
        0 &&
        effectiveSizes.length >
          0 && (
          <section className="border border-border bg-background">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-bold">
                Залишки та ціни
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                «К-сть» —
                фактичний залишок
                конкретного кольору
                та розміру.
                Якщо поле ціни
                порожнє —
                використовується
                базова ціна товару.
              </p>
            </div>

            <div className="overflow-x-auto p-6">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr>
                    <th className="w-40 border border-border bg-muted/40 p-3 text-left text-xs uppercase text-muted-foreground">
                      Колір
                    </th>

                    {effectiveSizes.map(
                      (size) => (
                        <th
                          key={
                            size
                          }
                          className="min-w-28 border border-border bg-muted/40 p-3 text-center text-xs"
                        >
                          {size ===
                          "ONE"
                            ? "Один розмір"
                            : size}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {colors.map(
                    (color) => (
                      <tr
                        key={
                          color.id
                        }
                      >
                        <td className="border border-border p-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="size-4 rounded-full border"
                              style={{
                                backgroundColor:
                                  color.hex,
                              }}
                            />

                            <span className="text-sm font-semibold">
                              {
                                color.name
                              }
                            </span>
                          </div>
                        </td>

                        {effectiveSizes.map(
                          (
                            size
                          ) => {
                            const key =
                              variantKey(
                                color.id,
                                size
                              )

                            const value =
                              variants[
                                key
                              ] ?? {
                                stock:
                                  "",
                                price:
                                  "",
                              }

                            return (
                              <td
                                key={
                                  size
                                }
                                className="border border-border p-2"
                              >
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={
                                    value.stock
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setVariantValue(
                                      color.id,
                                      size,
                                      "stock",
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  placeholder="К-сть"
                                  className="mb-2 h-9 w-full border border-border bg-background px-2 text-center text-xs outline-none focus:border-foreground"
                                />

                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={
                                    value.price
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setVariantValue(
                                      color.id,
                                      size,
                                      "price",
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  placeholder="Ціна"
                                  className="h-9 w-full border border-border bg-background px-2 text-center text-xs outline-none focus:border-foreground"
                                />
                              </td>
                            )
                          }
                        )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      {/* ===================================================
          DYNAMIC CHARACTERISTICS
      =================================================== */}

      <section className="border border-border bg-background">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-lg font-bold">
            Характеристики
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Додавайте тільки
            характеристики,
            які реально
            стосуються цього
            товару.
          </p>
        </div>

        <div className="p-6">
          {/* SUGGESTIONS */}

          {suggestedCharacteristics.length >
            0 && (
            <div className="mb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Швидко додати
              </p>

              <div className="flex flex-wrap gap-2">
                {suggestedCharacteristics.map(
                  (
                    suggestion
                  ) => {
                    const exists =
                      characteristics.some(
                        (
                          item
                        ) =>
                          item.label ===
                          suggestion
                      )

                    return (
                      <button
                        key={
                          suggestion
                        }
                        type="button"
                        disabled={
                          exists
                        }
                        onClick={() =>
                          addCharacteristic(
                            suggestion
                          )
                        }
                        className="border border-border px-3 py-2 text-xs transition hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="mr-1 inline size-3" />

                        {
                          suggestion
                        }
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          )}

          {/* ROWS */}

          <div className="flex flex-col gap-3">
            {characteristics.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item.id
                  }
                  className="grid gap-3 border border-border p-4 md:grid-cols-[220px_1fr_auto]"
                >
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground">
                      Характеристика
                    </label>

                    <input
                      value={
                        item.label
                      }
                      onChange={(
                        event
                      ) =>
                        updateCharacteristic(
                          item.id,
                          "label",
                          event
                            .target
                            .value
                        )
                      }
                      className="h-11 w-full border border-border bg-background px-3 outline-none focus:border-foreground"
                      placeholder="Наприклад: Склад"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground">
                      Значення
                    </label>

                    <input
                      value={
                        item.value
                      }
                      onChange={(
                        event
                      ) =>
                        updateCharacteristic(
                          item.id,
                          "value",
                          event
                            .target
                            .value
                        )
                      }
                      className="h-11 w-full border border-border bg-background px-3 outline-none focus:border-foreground"
                      placeholder="Наприклад: 95% бавовна, 5% еластан"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        removeCharacteristic(
                          item.id
                        )
                      }
                      className="flex size-11 items-center justify-center border border-border text-muted-foreground transition hover:border-red-300 hover:text-red-600"
                      title={`Видалити характеристику ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              addCharacteristic()
            }
            className="mt-5 flex items-center gap-2 border border-foreground px-4 py-2.5 text-sm font-semibold"
          >
            <Plus className="size-4" />

            Додати свою
            характеристику
          </button>
        </div>
      </section>

      {/* ===================================================
          PUBLICATION
      =================================================== */}

      <section className="border border-border bg-background p-6">
        <div className="flex flex-col gap-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={
                isActive
              }
              onChange={(
                event
              ) =>
                setIsActive(
                  event.target
                    .checked
                )
              }
              className="mt-0.5 size-5"
            />

            <div>
              <p className="text-sm font-semibold">
                Активний товар
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Якщо увімкнено,
                товар одразу
                буде доступний
                покупцям.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={
                isFeatured
              }
              onChange={(
                event
              ) =>
                setIsFeatured(
                  event.target
                    .checked
                )
              }
              className="mt-0.5 size-5"
            />

            <div>
              <p className="text-sm font-semibold">
                Рекомендований
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Товар можна
                використовувати
                у блоках
                рекомендованих
                товарів та
                бестселерів.
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* ===================================================
          SUBMIT
      =================================================== */}

      <div className="sticky bottom-0 z-20 flex items-center justify-between border border-border bg-background/95 p-4 shadow-lg backdrop-blur">
        <div className="hidden md:block">
          <p className="text-sm font-medium">
            {isActive
              ? "Товар буде опубліковано"
              : "Товар буде збережено як чернетку"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            SKU та slug
            створяться
            автоматично.
          </p>
        </div>

        <button
          type="submit"
          disabled={
            saving
          }
          className="ml-auto flex h-12 min-w-52 items-center justify-center gap-2 bg-foreground px-6 text-sm font-bold uppercase tracking-wider text-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />

              Збереження...
            </>
          ) : (
            <>
              <Check className="size-4" />

              Створити товар
            </>
          )}
        </button>
      </div>
    </form>
  )
}