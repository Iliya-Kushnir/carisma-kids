import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getCurrentAdmin() {
  const supabase =
    await createClient()

  const {
    data: { user },
  } =
    await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const {
    data: admin,
    error,
  } = await supabase
    .from("admin_users")
    .select(
      `
        user_id,
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
    !admin.is_active
  ) {
    return null
  }

  return {
    user,
    admin,
  }
}