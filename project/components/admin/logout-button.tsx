"use client"

import { LogOut } from "lucide-react"

import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

export function LogoutButton() {
  const router = useRouter()

  async function logout() {
    const supabase =
      createClient()

    await supabase.auth.signOut()

    router.replace(
      "/admin/login"
    )

    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      <LogOut className="size-4" />

      Вийти
    </button>
  )
}