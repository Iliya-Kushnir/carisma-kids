import {
    NextRequest,
    NextResponse,
  } from "next/server"
  
  import { createClient } from "@/lib/supabase/server"
  import { supabaseAdmin } from "@/lib/supabase/admin"
  
  export async function POST(
    request: NextRequest
  ) {
    try {
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
       * Проверяем, что пользователь
       * действительно имеет доступ.
       */
      const {
        data: admin,
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
        !admin ||
        !admin.is_active
      ) {
        return NextResponse.json(
          {
            error:
              "Доступ до адмін-панелі відсутній.",
          },
          {
            status: 403,
          }
        )
      }
  
      const body =
        await request.json()
  
      const password =
        String(
          body.password ?? ""
        )
  
      if (
        password.length <
        8
      ) {
        return NextResponse.json(
          {
            error:
              "Пароль повинен містити щонайменше 8 символів.",
          },
          {
            status: 400,
          }
        )
      }
  
      /*
       * Меняем пароль Auth пользователя.
       */
      const {
        error:
          passwordError,
      } =
        await supabase.auth.updateUser(
          {
            password,
          }
        )
  
      if (passwordError) {
        return NextResponse.json(
          {
            error:
              passwordError.message,
          },
          {
            status: 400,
          }
        )
      }
  
      /*
       * Снимаем обязательную смену.
       */
      const {
        error:
          adminUpdateError,
      } =
        await supabaseAdmin
          .from(
            "admin_users"
          )
          .update({
            must_change_password:
              false,
          })
          .eq(
            "user_id",
            user.id
          )
  
      if (
        adminUpdateError
      ) {
        console.error(
          adminUpdateError
        )
  
        return NextResponse.json(
          {
            error:
              "Пароль змінено, але виникла помилка при оновленні профілю.",
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
        "Change password error:",
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