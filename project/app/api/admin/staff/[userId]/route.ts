import {
    NextRequest,
    NextResponse,
  } from "next/server"
  
  import { createClient } from "@/lib/supabase/server"
  import { supabaseAdmin } from "@/lib/supabase/admin"
  
  type Props = {
    params: Promise<{
      userId: string
    }>
  }
  
  export async function PATCH(
    request: NextRequest,
    {
      params,
    }: Props
  ) {
    try {
      const {
        userId,
      } =
        await params
  
      const supabase =
        await createClient()
  
      const {
        data: { user },
      } =
        await supabase.auth.getUser()
  
      if (!user) {
        return NextResponse.json(
          {
            error:
              "Необхідна авторизація.",
          },
          {
            status: 401,
          }
        )
      }
  
      /*
       * Проверяем OWNER.
       */
      const {
        data: currentAdmin,
      } = await supabase
        .from("admin_users")
        .select(
          "role, is_active"
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle()
  
      if (
        !currentAdmin ||
        !currentAdmin.is_active ||
        currentAdmin.role !==
          "owner"
      ) {
        return NextResponse.json(
          {
            error:
              "Недостатньо прав.",
          },
          {
            status: 403,
          }
        )
      }
  
      /*
       * Самого себя owner отключить не может.
       */
      if (
        userId === user.id
      ) {
        return NextResponse.json(
          {
            error:
              "Не можна вимкнути власний доступ.",
          },
          {
            status: 400,
          }
        )
      }
  
      const body =
        await request.json()
  
      const isActive =
        body.isActive
  
      if (
        typeof isActive !==
        "boolean"
      ) {
        return NextResponse.json(
          {
            error:
              "Некоректний статус доступу.",
          },
          {
            status: 400,
          }
        )
      }
  
      /*
       * Можно управлять только manager.
       */
      const {
        data: target,
        error:
          targetError,
      } =
        await supabaseAdmin
          .from(
            "admin_users"
          )
          .select(
            "role"
          )
          .eq(
            "user_id",
            userId
          )
          .maybeSingle()
  
      if (
        targetError ||
        !target
      ) {
        return NextResponse.json(
          {
            error:
              "Менеджера не знайдено.",
          },
          {
            status: 404,
          }
        )
      }
  
      if (
        target.role !==
        "manager"
      ) {
        return NextResponse.json(
          {
            error:
              "Можна змінювати доступ лише менеджерів.",
          },
          {
            status: 400,
          }
        )
      }
  
      const {
        error:
          updateError,
      } =
        await supabaseAdmin
          .from(
            "admin_users"
          )
          .update({
            is_active:
              isActive,
          })
          .eq(
            "user_id",
            userId
          )
  
      if (updateError) {
        console.error(
          "Toggle manager access error:",
          updateError
        )
  
        return NextResponse.json(
          {
            error:
              "Не вдалося змінити доступ менеджера.",
          },
          {
            status: 500,
          }
        )
      }
  
      return NextResponse.json(
        {
          success: true,
        }
      )
    } catch (error) {
      console.error(
        "Staff PATCH error:",
        error
      )
  
      return NextResponse.json(
        {
          error:
            "Внутрішня помилка сервера.",
        },
        {
          status: 500,
        }
      )
    }
  }