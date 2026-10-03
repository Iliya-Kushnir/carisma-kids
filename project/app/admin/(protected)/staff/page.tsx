import { redirect } from "next/navigation"

import { StaffManager } from "@/components/admin/staff-manager"

import { getCurrentAdmin } from "@/lib/admin/get-current-admin"
import { supabaseAdmin } from "@/lib/supabase/admin"

export default async function StaffPage() {
  const current =
    await getCurrentAdmin()

  if (!current) {
    redirect(
      "/admin/login"
    )
  }

  /*
   * Manager не может открыть Staff
   * даже вручную через URL.
   */
  if (
    current.admin.role !==
    "owner"
  ) {
    redirect(
      "/admin/products"
    )
  }

  const {
    data: staff,
    error,
  } =
    await supabaseAdmin
      .from(
        "admin_users"
      )
      .select(
        `
          user_id,
          full_name,
          email,
          role,
          is_active,
          must_change_password,
          created_at
        `
      )
      .order(
        "created_at",
        {
          ascending:
            true,
        }
      )

  if (error) {
    console.error(
      "Staff load error:",
      error
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">
          Співробітники
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Створюйте доступи
          менеджерів та керуйте
          їх роботою в
          адміністративній
          панелі.
        </p>
      </div>

      <StaffManager
        initialStaff={
          staff ?? []
        }
        currentUserId={
          current.user.id
        }
      />
    </div>
  )
}