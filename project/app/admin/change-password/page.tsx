"use client"

import {
  useState,
  type FormEvent,
} from "react"

import {
  Loader2,
  LockKeyhole,
} from "lucide-react"

import { useRouter } from "next/navigation"

export default function ChangePasswordPage() {
  const router =
    useRouter()

  const [
    password,
    setPassword,
  ] =
    useState("")

  const [
    repeatPassword,
    setRepeatPassword,
  ] =
    useState("")

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")

    if (
      password.length <
      8
    ) {
      setError(
        "Пароль повинен містити щонайменше 8 символів."
      )

      return
    }

    if (
      password !==
      repeatPassword
    ) {
      setError(
        "Паролі не співпадають."
      )

      return
    }

    try {
      setSaving(true)

      const response =
        await fetch(
          "/api/admin/change-password",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  password,
                }
              ),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Не вдалося змінити пароль."
        )
      }

      router.replace(
        "/admin/products"
      )

      router.refresh()
    } catch (error) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Не вдалося змінити пароль."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md border border-border bg-background p-8">
        <div className="mb-8">
          <div className="mb-4 flex size-11 items-center justify-center bg-foreground text-background">
            <LockKeyhole className="size-5" />
          </div>

          <h1 className="text-2xl font-bold">
            Створіть новий
            пароль
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Для першого входу
            було використано
            тимчасовий пароль.
            Встановіть власний
            пароль для подальшої
            роботи.
          </p>
        </div>

        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
          className="flex flex-col gap-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Новий пароль
            </label>

            <input
              type="password"
              autoComplete="new-password"
              value={
                password
              }
              onChange={(
                event
              ) =>
                setPassword(
                  event.target
                    .value
                )
              }
              className="h-12 w-full border border-border bg-background px-4 outline-none focus:border-foreground"
              placeholder="Мінімум 8 символів"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Повторіть пароль
            </label>

            <input
              type="password"
              autoComplete="new-password"
              value={
                repeatPassword
              }
              onChange={(
                event
              ) =>
                setRepeatPassword(
                  event.target
                    .value
                )
              }
              className="h-12 w-full border border-border bg-background px-4 outline-none focus:border-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={
              saving
            }
            className="flex h-12 items-center justify-center gap-2 bg-foreground px-5 text-sm font-bold text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving && (
              <Loader2 className="size-4 animate-spin" />
            )}

            Зберегти пароль
          </button>
        </form>
      </div>
    </main>
  )
}