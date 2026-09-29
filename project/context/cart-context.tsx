"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type CartItem = {
  productId: string
  variantId: string

  title: string
  price: number
  image: string

  colorKey: string
  colorName: string
  colorHex: string

  size: string
  qty: number
}

type CartContextType = {
  items: CartItem[]

  addItem: (item: CartItem) => void

  updateQty: (
    productId: string,
    variantId: string,
    delta: number
  ) => void

  removeItem: (
    productId: string,
    variantId: string
  ) => void

  clearCart: () => void

  cartCount: number
  cartTotal: number
}

const CartContext =
  createContext<CartContextType | null>(null)

/*
 * Новый ключ специально.
 * Старые кривые данные корзины
 * сюда уже не попадут.
 */
const STORAGE_KEY = "carisma-cart-v2"

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {
  const [items, setItems] =
    useState<CartItem[]>([])

  const [loaded, setLoaded] =
    useState(false)

  /*
   * Загружаем корзину из localStorage
   * один раз после загрузки браузера.
   */
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        )

      if (!saved) {
        return
      }

      const parsed =
        JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        return
      }

      const validItems =
        parsed
          .filter(
            (item) =>
              item &&
              typeof item.productId ===
                "string" &&
              typeof item.variantId ===
                "string"
          )
          .map((item) => ({
            ...item,

            price:
              Number(item.price) ||
              0,

            qty: Math.max(
              1,
              Number(item.qty) ||
                1
            ),
          }))

      setItems(validItems)
    } catch (error) {
      console.error(
        "Помилка завантаження кошика:",
        error
      )

      localStorage.removeItem(
        STORAGE_KEY
      )
    } finally {
      setLoaded(true)
    }
  }, [])

  /*
   * Сохраняем корзину при любом
   * изменении items.
   */
  useEffect(() => {
    if (!loaded) {
      return
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    )
  }, [items, loaded])

  /*
   * Синхронизация корзины между
   * несколькими вкладками браузера.
   */
  useEffect(() => {
    function handleStorage(
      event: StorageEvent
    ) {
      if (
        event.key !==
        STORAGE_KEY
      ) {
        return
      }

      if (!event.newValue) {
        setItems([])
        return
      }

      try {
        const parsed =
          JSON.parse(
            event.newValue
          )

        if (
          Array.isArray(parsed)
        ) {
          setItems(parsed)
        }
      } catch (error) {
        console.error(
          "Помилка синхронізації кошика:",
          error
        )
      }
    }

    window.addEventListener(
      "storage",
      handleStorage
    )

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      )
    }
  }, [])

  /*
   * Добавление товара.
   *
   * Один товар определяется:
   * productId + variantId
   *
   * Например:
   * hoodie + black-110
   */
  function addItem(
    newItem: CartItem
  ) {
    const qtyToAdd =
      Math.max(
        1,
        Number(newItem.qty) ||
          1
      )

    setItems((prev) => {
      const existing =
        prev.find(
          (item) =>
            item.productId ===
              newItem.productId &&
            item.variantId ===
              newItem.variantId
        )

      /*
       * Такой вариант уже есть —
       * увеличиваем количество.
       */
      if (existing) {
        return prev.map(
          (item) =>
            item.productId ===
                newItem.productId &&
            item.variantId ===
                newItem.variantId
              ? {
                  ...item,

                  qty:
                    item.qty +
                    qtyToAdd,
                }
              : item
        )
      }

      /*
       * Новый вариант товара.
       */
      return [
        ...prev,

        {
          ...newItem,

          price:
            Number(
              newItem.price
            ) || 0,

          qty: qtyToAdd,
        },
      ]
    })
  }

  /*
   * Изменение количества.
   */
  function updateQty(
    productId: string,
    variantId: string,
    delta: number
  ) {
    setItems((prev) =>
      prev.map((item) => {
        if (
          item.productId !==
            productId ||
          item.variantId !==
            variantId
        ) {
          return item
        }

        return {
          ...item,

          qty: Math.max(
            1,
            item.qty + delta
          ),
        }
      })
    )
  }

  /*
   * Удаление конкретного варианта.
   */
  function removeItem(
    productId: string,
    variantId: string
  ) {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId ===
              productId &&
            item.variantId ===
              variantId
          )
      )
    )
  }

  /*
   * Полная очистка.
   */
  function clearCart() {
    setItems([])

    localStorage.removeItem(
      STORAGE_KEY
    )
  }

  /*
   * Общее количество товаров.
   *
   * qty 2 + qty 3 = 5
   */
  const cartCount =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item
          ) =>
            total +
            Math.max(
              0,
              Number(
                item.qty
              ) || 0
            ),

          0
        ),

      [items]
    )

  /*
   * Общая стоимость.
   */
  const cartTotal =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.price
            ) *
              Number(
                item.qty
              ),

          0
        ),

      [items]
    )

  return (
    <CartContext.Provider
      value={{
        items,

        addItem,
        updateQty,
        removeItem,
        clearCart,

        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context =
    useContext(CartContext)

  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    )
  }

  return context
}