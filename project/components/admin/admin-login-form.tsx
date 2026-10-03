"use client"

import {
  useState,
  type FormEvent,
} from "react"

import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

export function AdminLoginForm() {
  const router = useRouter()

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [error, setError] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setLoading(true)

    const supabase =
      createClient()

    const {
      error: loginError,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (loginError) {
      setError(
        "Невірний email або пароль."
      )

      setLoading(false)

      return
    }

    router.replace(
      "/admin/products"
    )

    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md border border-border bg-background p-8"
    >
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Carisma KIDS
        </p>

        <h1 className="text-2xl font-bold">
          Адмін-панель
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Увійдіть у свій
          обліковий запис.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            required
            className="h-12 w-full border border-border bg-background px-4 outline-none transition focus:border-foreground"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium"
          >
            Пароль
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            required
            className="h-12 w-full border border-border bg-background px-4 outline-none transition focus:border-foreground"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 bg-foreground text-sm font-bold uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Вхід..."
            : "Увійти"}
        </button>
      </div>
    </form>
  )
}