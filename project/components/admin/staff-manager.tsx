"use client"

import {
  useState,
  type FormEvent,
} from "react"

import {
  Check,
  Copy,
  Loader2,
  Mail,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import { useRouter } from "next/navigation"

type Staff = {
  user_id: string

  full_name:
    | string
    | null

  email:
    | string
    | null

  role: string

  is_active: boolean

  must_change_password:
    boolean

  created_at: string
}

type CreatedManager = {
  fullName: string
  email: string
  temporaryPassword: string
}

type Props = {
  initialStaff: Staff[]
  currentUserId: string
}

export function StaffManager({
  initialStaff,
  currentUserId,
}: Props) {
  const router =
    useRouter()

  const [
    fullName,
    setFullName,
  ] =
    useState("")

  const [
    email,
    setEmail,
  ] =
    useState("")

  const [
    inviting,
    setInviting,
  ] =
    useState(false)

  const [
    loadingUser,
    setLoadingUser,
  ] =
    useState<
      string | null
    >(null)

  const [
    error,
    setError,
  ] =
    useState("")

  const [
    success,
    setSuccess,
  ] =
    useState("")

  const [
    createdManager,
    setCreatedManager,
  ] =
    useState<
      CreatedManager | null
    >(null)

  const [
    copied,
    setCopied,
  ] =
    useState(false)

  async function handleCreateManager(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (inviting) {
      return
    }

    setError("")
    setSuccess("")
    setCreatedManager(
      null
    )
    setCopied(false)

    if (
      !fullName.trim()
    ) {
      setError(
        "Вкажіть ім’я менеджера."
      )

      return
    }

    if (!email.trim()) {
      setError(
        "Вкажіть email менеджера."
      )

      return
    }

    try {
      setInviting(true)

      const response =
        await fetch(
          "/api/admin/staff/invite",
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
                  fullName:
                    fullName.trim(),

                  email:
                    email
                      .trim()
                      .toLowerCase(),
                }
              ),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Не вдалося створити менеджера."
        )
      }

      setCreatedManager(
        {
          fullName:
            data.manager
              .fullName,

          email:
            data.manager
              .email,

          temporaryPassword:
            data.manager
              .temporaryPassword,
        }
      )

      setFullName("")
      setEmail("")

      setSuccess(
        "Менеджера успішно створено."
      )

      router.refresh()
    } catch (error) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Не вдалося створити менеджера."
      )
    } finally {
      setInviting(false)
    }
  }

  async function toggleAccess(
    member: Staff
  ) {
    if (loadingUser) {
      return
    }

    setError("")
    setSuccess("")

    try {
      setLoadingUser(
        member.user_id
      )

      const response =
        await fetch(
          `/api/admin/staff/${member.user_id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  isActive:
                    !member.is_active,
                }
              ),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Не вдалося змінити доступ."
        )
      }

      setSuccess(
        member.is_active
          ? "Доступ менеджера вимкнено."
          : "Доступ менеджера увімкнено."
      )

      router.refresh()
    } catch (error) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Не вдалося змінити доступ."
      )
    } finally {
      setLoadingUser(
        null
      )
    }
  }

  async function copyCredentials() {
    if (
      !createdManager
    ) {
      return
    }

    const text = [
      `Email: ${createdManager.email}`,
      `Тимчасовий пароль: ${createdManager.temporaryPassword}`,
    ].join("\n")

    try {
      await navigator.clipboard.writeText(
        text
      )

      setCopied(true)

      window.setTimeout(
        () =>
          setCopied(
            false
          ),
        2000
      )
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* CREATE */}

      <section className="border border-border bg-background">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-lg font-bold">
            Додати менеджера
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Створіть обліковий
            запис менеджера.
            Після створення
            система покаже
            тимчасовий пароль
            для першого входу.
          </p>
        </div>

        <form
          onSubmit={
            handleCreateManager
          }
          className="grid gap-5 p-6 md:grid-cols-[1fr_1fr_auto]"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Ім&apos;я
            </label>

            <input
              value={
                fullName
              }
              onChange={(
                event
              ) =>
                setFullName(
                  event.target
                    .value
                )
              }
              placeholder="Анна Іваненко"
              className="h-12 w-full border border-border bg-background px-4 outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(
                event
              ) =>
                setEmail(
                  event.target
                    .value
                )
              }
              placeholder="manager@example.com"
              className="h-12 w-full border border-border bg-background px-4 outline-none focus:border-foreground"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={
                inviting
              }
              className="flex h-12 min-w-52 items-center justify-center gap-2 bg-foreground px-5 text-sm font-semibold text-background disabled:opacity-50"
            >
              {inviting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}

              Створити менеджера
            </button>
          </div>
        </form>
      </section>

      {/* ERROR */}

      {error && (
        <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* TEMPORARY PASSWORD */}

      {createdManager && (
        <section className="border border-foreground bg-background">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-bold">
              Дані для першого
              входу
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Передайте ці дані
              менеджеру. Тимчасовий
              пароль показується
              після створення
              облікового запису.
            </p>
          </div>

          <div className="p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Менеджер
                </p>

                <p className="mt-2 font-semibold">
                  {
                    createdManager.fullName
                  }
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </p>

                <p className="mt-2 font-semibold">
                  {
                    createdManager.email
                  }
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Тимчасовий пароль
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="min-w-0 flex-1 break-all border border-border bg-muted/30 px-4 py-3 font-mono text-sm font-bold">
                    {
                      createdManager.temporaryPassword
                    }
                  </div>

                  <button
                    type="button"
                    onClick={
                      copyCredentials
                    }
                    className="flex h-11 shrink-0 items-center gap-2 border border-border px-4 text-sm font-semibold"
                  >
                    {copied ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}

                    {copied
                      ? "Скопійовано"
                      : "Копіювати"}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Після першого
              входу менеджер буде
              зобов&apos;язаний
              створити власний
              пароль.
            </p>
          </div>
        </section>
      )}

      {/* TEAM */}

      <section className="border border-border bg-background">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-lg font-bold">
            Команда
          </h2>
        </div>

        <div className="divide-y divide-border">
          {initialStaff.map(
            (member) => {
              const isOwner =
                member.role ===
                "owner"

              const isCurrentUser =
                member.user_id ===
                currentUserId

              return (
                <div
                  key={
                    member.user_id
                  }
                  className="flex flex-col gap-4 p-6 md:flex-row md:items-center"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
                    {isOwner ? (
                      <ShieldCheck className="size-5" />
                    ) : (
                      <UserRound className="size-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {member.full_name ||
                          "Без імені"}
                      </p>

                      <span className="border border-border px-2 py-1 text-[10px] font-semibold uppercase">
                        {isOwner
                          ? "Owner"
                          : "Manager"}
                      </span>

                      {isCurrentUser && (
                        <span className="text-xs text-muted-foreground">
                          Ви
                        </span>
                      )}

                      {!isOwner &&
                        member.must_change_password && (
                          <span className="text-xs text-amber-700">
                            Очікує зміни пароля
                          </span>
                        )}
                    </div>

                    {member.email && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="size-3.5" />

                        {
                          member.email
                        }
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold ${
                        member.is_active
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      {member.is_active
                        ? "Доступ активний"
                        : "Доступ вимкнено"}
                    </span>

                    {!isOwner && (
                      <button
                        type="button"
                        disabled={
                          loadingUser ===
                          member.user_id
                        }
                        onClick={() =>
                          toggleAccess(
                            member
                          )
                        }
                        className="min-w-40 border border-border px-4 py-2 text-sm font-semibold transition hover:border-foreground disabled:opacity-50"
                      >
                        {loadingUser ===
                        member.user_id ? (
                          <Loader2 className="mx-auto size-4 animate-spin" />
                        ) : member.is_active ? (
                          "Вимкнути доступ"
                        ) : (
                          "Увімкнути доступ"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            }
          )}
        </div>
      </section>
    </div>
  )
}