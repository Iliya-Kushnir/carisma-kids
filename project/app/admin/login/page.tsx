import { redirect } from "next/navigation"

import { AdminLoginForm } from "@/components/admin/admin-login-form"

import { createClient } from "@/lib/supabase/server"

export default async function AdminLoginPage() {
  const supabase =
    await createClient()

  const {
    data: { user },
  } =
    await supabase.auth.getUser()

  if (user) {
    const {
      data: admin,
    } = await supabase
      .from("admin_users")
      .select(
        "user_id, role, is_active"
      )
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle()

    if (
      admin?.is_active &&
      (
        admin.role ===
          "owner" ||
        admin.role ===
          "manager"
      )
    ) {
      redirect(
        "/admin/products"
      )
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <AdminLoginForm />
    </main>
  )
}