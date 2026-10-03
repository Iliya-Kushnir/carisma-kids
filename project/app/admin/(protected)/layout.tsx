import Link from "next/link"
import { redirect } from "next/navigation"

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react"

import { createClient } from "@/lib/supabase/server"

import { LogoutButton } from "@/components/admin/logout-button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase =
    await createClient()

  const {
    data: { user },
  } =
    await supabase.auth.getUser()

  if (!user) {
    redirect(
      "/admin/login"
    )
  }

  const {
    data: admin,
    error,
  } = await supabase
    .from("admin_users")
    .select(
      `
        full_name,
        email,
        role,
        is_active,
        must_change_password
      `
    )
    .eq(
      "user_id",
      user.id
    )
    .maybeSingle()

  if (
    error ||
    !admin ||
    !admin.is_active ||
    ![
      "owner",
      "manager",
    ].includes(
      admin.role
    )
  ) {
    redirect(
      "/admin/login"
    )
  }

  /*
   * Новый менеджер не сможет
   * попасть в админку,
   * пока не поменяет временный пароль.
   */
  if (
    admin.must_change_password
  ) {
    redirect(
      "/admin/change-password"
    )
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-background lg:flex">
        <div className="border-b border-border px-6 py-6">
          <Link
            href="/admin/products"
            className="block"
          >
            <p className="text-lg font-extrabold">
              carisma
            </p>

            <p className="text-[10px] font-medium tracking-[0.4em] text-muted-foreground">
              KIDS ADMIN
            </p>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            <LayoutDashboard className="size-4" />

            Головна
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            <Package className="size-4" />

            Товари
          </Link>

          {admin.role ===
            "owner" && (
            <Link
              href="/admin/staff"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-muted"
            >
              <Users className="size-4" />

              Співробітники
            </Link>
          )}

          <span className="flex cursor-not-allowed items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground opacity-50">
            <ShoppingBag className="size-4" />

            Замовлення
          </span>
        </nav>

        <div className="border-t border-border">
          <div className="px-4 py-4">
            <p className="text-sm font-semibold">
              {admin.full_name ||
                user.email}
            </p>

            <p className="mt-1 text-xs uppercase text-muted-foreground">
              {admin.role}
            </p>
          </div>

          <LogoutButton />
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Carisma KIDS
          </p>

          <p className="text-sm text-muted-foreground">
            {user.email}
          </p>
        </header>

        <main className="p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}