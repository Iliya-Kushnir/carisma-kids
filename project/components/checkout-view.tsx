'use client'

import {
  useMemo,
  useState,
  type ReactNode,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
} from 'react'

import {
  Check,
  Truck,
  Package,
  MapPin,
  Bike,
  Wallet,
  CreditCard,
  Minus,
  Plus,
  X,
  ShieldCheck,
} from 'lucide-react'

import { formatPrice } from '@/lib/products'
import { useCart } from '@/context/cart-context'

/* ---------------------------------- data --------------------------------- */

const FREE_SHIPPING_THRESHOLD = 2500
const SHIPPING_COST = 80

type DeliveryMethod =
  | 'np-branch'
  | 'np-locker'
  | 'np-courier'
  | 'ukrposhta'

type PaymentMethod = 'cod' | 'online'

const NP_METHODS: {
  key: DeliveryMethod
  label: string
  hint: string
  icon: typeof Package
}[] = [
  {
    key: 'np-branch',
    label: 'Відділення',
    hint: 'Нова Пошта',
    icon: Package,
  },
  {
    key: 'np-locker',
    label: 'Поштомат',
    hint: 'Нова Пошта',
    icon: MapPin,
  },
  {
    key: 'np-courier',
    label: "Кур'єр",
    hint: 'Адресна доставка',
    icon: Bike,
  },
]

const CITIES = [
  'Київ',
  'Львів',
  'Одеса',
  'Харків',
  'Дніпро',
  'Запоріжжя',
  'Вінниця',
  'Івано-Франківськ',
]

const BRANCHES = [
  'Відділення №1 (вул. Хрещатик, 22)',
  'Відділення №5 (вул. Січових Стрільців, 10)',
  'Відділення №12 (пр. Перемоги, 67)',
  'Відділення №34 (вул. Велика Васильківська, 100)',
  'Відділення №88 (вул. Липківського, 45)',
]

/* ------------------------------- primitives ------------------------------ */

function SectionCard({
  step,
  title,
  children,
}: {
  step: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="border border-border bg-card">
      <div className="flex items-center gap-4 border-b border-border px-5 py-4 md:px-7 md:py-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
          {step}
        </span>

        <h2 className="font-heading text-lg font-extrabold uppercase tracking-wide text-foreground">
          {title}
        </h2>
      </div>

      <div className="px-5 py-6 md:px-7 md:py-7">
        {children}
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
  required,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}

        {required && (
          <span className="ml-0.5 text-foreground">*</span>
        )}
      </label>

      {children}
    </div>
  )
}

const inputClass =
  'h-12 w-full rounded-none border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/15'

function TextInput(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={inputClass}
    />
  )
}

function SelectInput(
  props: SelectHTMLAttributes<HTMLSelectElement> & {
    placeholder?: string
    options: string[]
  }
) {
  const {
    placeholder,
    options,
    ...rest
  } = props

  return (
    <div className="relative">
      <select
        {...rest}
        className={`${inputClass} appearance-none pr-10 ${
          rest.value
            ? 'text-foreground'
            : 'text-muted-foreground/70'
        }`}
      >
        <option
          value=""
          disabled
        >
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="text-foreground"
          >
            {option}
          </option>
        ))}
      </select>

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="m6 9 6 6 6-6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function OptionRow({
  active,
  onSelect,
  icon: Icon,
  title,
  hint,
  trailing,
}: {
  active: boolean
  onSelect: () => void
  icon?: typeof Package
  title: string
  hint?: string
  trailing?: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`flex w-full items-center gap-4 border px-4 py-4 text-left transition-colors ${
        active
          ? 'border-foreground bg-foreground/[0.03]'
          : 'border-border hover:border-foreground/40'
      }`}
    >
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          active
            ? 'border-foreground'
            : 'border-muted-foreground/50'
        }`}
      >
        {active && (
          <span className="size-2.5 rounded-full bg-foreground" />
        )}
      </span>

      {Icon && (
        <Icon
          className="size-5 shrink-0 text-foreground"
          aria-hidden="true"
        />
      )}

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-bold text-foreground">
          {title}
        </span>

        {hint && (
          <span className="text-xs text-muted-foreground">
            {hint}
          </span>
        )}
      </span>

      {trailing}
    </button>
  )
}

/* -------------------------------- component ------------------------------- */

export function CheckoutView() {
  const {
    items: cart,
    updateQty,
    removeItem,
  } = useCart()

  const [delivery, setDelivery] =
    useState<DeliveryMethod>('np-branch')

  const [payment, setPayment] =
    useState<PaymentMethod>('cod')

  const [
    otherRecipient,
    setOtherRecipient,
  ] = useState(false)

  const [city, setCity] =
    useState('')

  const [branch, setBranch] =
    useState('')

  const [address, setAddress] =
    useState('')

  const [submitted, setSubmitted] =
    useState(false)

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          item.price * item.qty,
        0
      ),
    [cart]
  )

  const freeShipping =
    subtotal >=
      FREE_SHIPPING_THRESHOLD ||
    subtotal === 0

  const shipping =
    freeShipping
      ? 0
      : SHIPPING_COST

  const total =
    subtotal + shipping

  const itemCount =
    cart.reduce(
      (sum, item) =>
        sum + item.qty,
      0
    )

  const remainingForFree =
    Math.max(
      0,
      FREE_SHIPPING_THRESHOLD -
        subtotal
    )

  const isCourier =
    delivery === 'np-courier'

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8 md:py-14">
      {/* Page heading */}

      <div className="mb-8 md:mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          Крок до нового образу
        </p>

        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-foreground md:text-5xl">
          Оформлення замовлення
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
        className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:items-start"
      >
        {/* Form column */}

        <div className="flex flex-col gap-6">
          {/* Contact */}

          <SectionCard
            step={1}
            title="Контактні дані"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Ім'я"
                htmlFor="firstName"
                required
              >
                <TextInput
                  id="firstName"
                  name="firstName"
                  placeholder="Іван"
                  required
                />
              </Field>

              <Field
                label="Прізвище"
                htmlFor="lastName"
                required
              >
                <TextInput
                  id="lastName"
                  name="lastName"
                  placeholder="Петренко"
                  required
                />
              </Field>

              <Field
                label="Номер телефону"
                htmlFor="phone"
                required
              >
                <TextInput
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  defaultValue="+38 "
                  placeholder="+38 (099) 000 00 00"
                  required
                />
              </Field>

              <Field
                label="Email"
                htmlFor="email"
                required
              >
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hello@example.com"
                  required
                />
              </Field>
            </div>

            <label className="mt-6 flex cursor-pointer items-center gap-3 select-none">
              <span className="relative flex size-5 items-center justify-center">
                <input
                  type="checkbox"
                  checked={
                    otherRecipient
                  }
                  onChange={(e) =>
                    setOtherRecipient(
                      e.target.checked
                    )
                  }
                  className="peer size-5 appearance-none border border-border bg-background transition-colors checked:border-foreground checked:bg-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />

                <Check className="pointer-events-none absolute size-3.5 text-background opacity-0 peer-checked:opacity-100" />
              </span>

              <span className="text-sm text-foreground">
                Отримує інша особа
              </span>
            </label>

            {otherRecipient && (
              <div className="mt-5 grid grid-cols-1 gap-5 border-t border-border pt-6 sm:grid-cols-2">
                <Field
                  label="Ім'я отримувача"
                  htmlFor="recFirstName"
                  required
                >
                  <TextInput
                    id="recFirstName"
                    name="recFirstName"
                    placeholder="Ім'я"
                    required
                  />
                </Field>

                <Field
                  label="Телефон отримувача"
                  htmlFor="recPhone"
                  required
                >
                  <TextInput
                    id="recPhone"
                    name="recPhone"
                    type="tel"
                    placeholder="+38 (099) 000 00 00"
                    required
                  />
                </Field>
              </div>
            )}
          </SectionCard>

          {/* Delivery */}

          <SectionCard
            step={2}
            title="Доставка"
          >
            <div className="flex flex-col gap-6">
              {/* Nova Poshta */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Truck
                    className="size-4 text-foreground"
                    aria-hidden="true"
                  />

                  <span className="text-sm font-bold uppercase tracking-wide text-foreground">
                    Нова Пошта
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {NP_METHODS.map(
                    (method) => (
                      <OptionRow
                        key={
                          method.key
                        }
                        active={
                          delivery ===
                          method.key
                        }
                        onSelect={() =>
                          setDelivery(
                            method.key
                          )
                        }
                        icon={
                          method.icon
                        }
                        title={
                          method.label
                        }
                        hint={
                          method.hint
                        }
                      />
                    )
                  )}
                </div>
              </div>

              {/* Ukrposhta */}

              <OptionRow
                active={
                  delivery ===
                  'ukrposhta'
                }
                onSelect={() =>
                  setDelivery(
                    'ukrposhta'
                  )
                }
                icon={Package}
                title="Укрпошта"
                hint="Доставка у відділення"
              />

              {/* Delivery fields */}

              <div className="grid grid-cols-1 gap-5 border-t border-border pt-6 sm:grid-cols-2">
                <Field
                  label="Місто"
                  htmlFor="city"
                  required
                >
                  <SelectInput
                    id="city"
                    name="city"
                    placeholder="Оберіть місто"
                    options={CITIES}
                    value={city}
                    onChange={(e) =>
                      setCity(
                        e.target.value
                      )
                    }
                    required
                  />
                </Field>

                {isCourier ? (
                  <Field
                    label="Адреса доставки"
                    htmlFor="address"
                    required
                  >
                    <TextInput
                      id="address"
                      name="address"
                      placeholder="Вулиця, будинок, квартира"
                      value={address}
                      onChange={(e) =>
                        setAddress(
                          e.target.value
                        )
                      }
                      required
                    />
                  </Field>
                ) : (
                  <Field
                    label={
                      delivery ===
                      'np-locker'
                        ? 'Поштомат'
                        : delivery ===
                            'ukrposhta'
                          ? 'Відділення Укрпошти'
                          : 'Відділення'
                    }
                    htmlFor="branch"
                    required
                  >
                    <SelectInput
                      id="branch"
                      name="branch"
                      placeholder="Оберіть відділення"
                      options={
                        BRANCHES
                      }
                      value={branch}
                      onChange={(e) =>
                        setBranch(
                          e.target
                            .value
                        )
                      }
                      required
                    />
                  </Field>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Payment */}

          <SectionCard
            step={3}
            title="Оплата"
          >
            <div className="flex flex-col gap-3">
              <OptionRow
                active={
                  payment === 'cod'
                }
                onSelect={() =>
                  setPayment('cod')
                }
                icon={Wallet}
                title="Оплата при отриманні"
                hint="Післяплата — оплата на відділенні"
              />

              <OptionRow
                active={
                  payment ===
                  'online'
                }
                onSelect={() =>
                  setPayment(
                    'online'
                  )
                }
                icon={CreditCard}
                title="Онлайн-оплата картою"
                hint="LiqPay · Apple Pay · Google Pay"
                trailing={
                  <div className="hidden items-center gap-1.5 sm:flex">
                    {[
                      'LiqPay',
                      'Apple Pay',
                      'G Pay',
                    ].map(
                      (item) => (
                        <span
                          key={
                            item
                          }
                          className="rounded-sm border border-border px-2 py-1 text-[0.65rem] font-semibold text-muted-foreground"
                        >
                          {
                            item
                          }
                        </span>
                      )
                    )}
                  </div>
                }
              />
            </div>

            <label className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
              <span className="relative mt-0.5 flex size-5 items-center justify-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="peer size-5 appearance-none border border-border bg-background checked:border-foreground checked:bg-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />

                <Check className="pointer-events-none absolute size-3.5 text-background opacity-0 peer-checked:opacity-100" />
              </span>

              <span>
                Я погоджуюся з{' '}
                <a
                  href="#"
                  className="font-semibold text-foreground underline underline-offset-2"
                >
                  умовами обробки
                  персональних даних
                </a>{' '}
                та публічною офертою.
              </span>
            </label>
          </SectionCard>
        </div>

        {/* Summary column */}

        <aside className="lg:sticky lg:top-28">
          <div className="border border-border bg-card">
            <div className="border-b border-border px-5 py-5 md:px-6">
              <h2 className="flex items-center justify-between font-heading text-lg font-extrabold uppercase tracking-wide text-foreground">
                Ваше замовлення

                <span className="text-sm font-semibold text-muted-foreground">
                  {itemCount} тов.
                </span>
              </h2>
            </div>

            {/* Items */}

            <ul className="divide-y divide-border px-5 md:px-6">
              {cart.length ===
                0 && (
                <li className="py-10 text-center text-sm text-muted-foreground">
                  Кошик порожній
                </li>
              )}

              {cart.map(
                (item) => (
                  <li
                    key={`${item.productId}-${item.variantId}`}
                    className="flex gap-4 py-5"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          item.image ||
                          '/placeholder.svg'
                        }
                        alt={
                          item.title
                        }
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold uppercase leading-tight tracking-wide text-foreground">
                          {
                            item.title
                          }
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.productId,
                              item.variantId
                            )
                          }
                          aria-label={`Видалити ${item.title}`}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <X className="size-4" />
                        </button>
                      </div>

                      <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                          className="inline-block size-3 rounded-full border border-border"
                          style={{
                            backgroundColor:
                              item.colorHex,
                          }}
                          aria-hidden="true"
                        />

                        {
                          item.colorName
                        }{' '}
                        · зріст{' '}
                        {item.size}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(
                                item.productId,
                                item.variantId,
                                -1
                              )
                            }
                            aria-label="Зменшити кількість"
                            className="flex size-7 items-center justify-center text-foreground transition-colors hover:bg-muted"
                          >
                            <Minus className="size-3" />
                          </button>

                          <span className="w-7 text-center text-sm font-semibold text-foreground">
                            {item.qty}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQty(
                                item.productId,
                                item.variantId,
                                1
                              )
                            }
                            aria-label="Збільшити кількість"
                            className="flex size-7 items-center justify-center text-foreground transition-colors hover:bg-muted"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-foreground">
                          {formatPrice(
                            item.price *
                              item.qty
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>

            {/* Free shipping progress */}

            {cart.length > 0 && (
              <div className="border-t border-border px-5 py-4 md:px-6">
                {freeShipping ? (
                  <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Truck
                      className="size-4"
                      aria-hidden="true"
                    />

                    Ви отримали
                    безкоштовну
                    доставку
                  </p>
                ) : (
                  <>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Додайте товарів
                      на{' '}
                      <span className="font-bold text-foreground">
                        {formatPrice(
                          remainingForFree
                        )}
                      </span>{' '}
                      для безкоштовної
                      доставки
                    </p>

                    <div className="h-1 w-full overflow-hidden bg-muted">
                      <div
                        className="h-full bg-foreground transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (subtotal /
                              FREE_SHIPPING_THRESHOLD) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Totals */}

            <div className="flex flex-col gap-3 border-t border-border px-5 py-5 md:px-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Сума замовлення
                </span>

                <span className="text-foreground">
                  {formatPrice(
                    subtotal
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Доставка
                </span>

                <span
                  className={
                    freeShipping
                      ? 'font-semibold text-foreground'
                      : 'text-foreground'
                  }
                >
                  {freeShipping
                    ? 'Безкоштовно'
                    : formatPrice(
                        shipping
                      )}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
                <span className="font-heading text-base font-extrabold uppercase tracking-wide text-foreground">
                  До сплати
                </span>

                <span className="font-heading text-2xl font-extrabold text-foreground">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* CTA */}

            <div className="px-5 pb-6 md:px-6">
              <button
                type="submit"
                disabled={
                  cart.length === 0
                }
                className="h-14 w-full bg-foreground text-sm font-bold uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Підтвердити
                замовлення
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck
                  className="size-4"
                  aria-hidden="true"
                />

                Безпечне оформлення ·
                дані захищені
              </p>

              {submitted && (
                <p
                  role="status"
                  className="mt-4 border border-foreground bg-foreground/[0.03] px-4 py-3 text-center text-xs font-semibold text-foreground"
                >
                  Дякуємо! Замовлення
                  прийнято, менеджер
                  зв&apos;яжеться з вами
                  найближчим часом.
                </p>
              )}
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}