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
       * Только OWNER может создавать менеджеров.
       */
      const {
        data: currentAdmin,
        error:
          currentAdminError,
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
        currentAdminError ||
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
  
      const body =
        await request.json()
  
      const fullName =
        String(
          body.fullName ?? ""
        ).trim()
  
      const email =
        String(
          body.email ?? ""
        )
          .trim()
          .toLowerCase()
  
      if (!fullName) {
        return NextResponse.json(
          {
            error:
              "Вкажіть ім’я менеджера.",
          },
          {
            status: 400,
          }
        )
      }
  
      if (!email) {
        return NextResponse.json(
          {
            error:
              "Вкажіть email менеджера.",
          },
          {
            status: 400,
          }
        )
      }
  
      /*
       * Проверяем admin_users.
       */
      const {
        data: existingAdmin,
      } =
        await supabaseAdmin
          .from(
            "admin_users"
          )
          .select(
            "user_id"
          )
          .ilike(
            "email",
            email
          )
          .maybeSingle()
  
      if (existingAdmin) {
        return NextResponse.json(
          {
            error:
              "Користувач з таким email вже має доступ до адмін-панелі.",
          },
          {
            status: 409,
          }
        )
      }
  
      /*
       * Генерация временного пароля.
       */
      const randomPart =
        crypto
          .randomUUID()
          .replaceAll(
            "-",
            ""
          )
          .slice(
            0,
            12
          )
  
      const temporaryPassword =
        `Ck!${randomPart}Aa1`
  
      /*
       * Создаём пользователя Supabase Auth.
       */
      const {
        data:
          createdUserData,
        error:
          createUserError,
      } =
        await supabaseAdmin.auth.admin.createUser(
          {
            email,
  
            password:
              temporaryPassword,
  
            email_confirm:
              true,
  
            user_metadata: {
              full_name:
                fullName,
            },
          }
        )
  
      if (
        createUserError ||
        !createdUserData.user
      ) {
        console.error(
          "Create manager auth error:",
          createUserError
        )
  
        return NextResponse.json(
          {
            error:
              createUserError?.message ??
              "Не вдалося створити користувача.",
          },
          {
            status: 400,
          }
        )
      }
  
      /*
       * Создаём запись прав доступа.
       */
      const {
        error:
          adminInsertError,
      } =
        await supabaseAdmin
          .from(
            "admin_users"
          )
          .insert({
            user_id:
              createdUserData
                .user.id,
  
            full_name:
              fullName,
  
            email,
  
            role:
              "manager",
  
            is_active:
              true,
  
            must_change_password:
              true,
          })
  
      if (
        adminInsertError
      ) {
        console.error(
          "admin_users insert error:",
          adminInsertError
        )
  
        /*
         * Rollback Auth user.
         */
        await supabaseAdmin.auth.admin.deleteUser(
          createdUserData
            .user.id
        )
  
        return NextResponse.json(
          {
            error:
              "Не вдалося створити права менеджера.",
          },
          {
            status: 500,
          }
        )
      }
  
      /*
       * Пароль отдаём только сейчас.
       * В admin_users его не сохраняем.
       */
      return NextResponse.json(
        {
          success: true,
  
          manager: {
            userId:
              createdUserData
                .user.id,
  
            fullName,
  
            email,
  
            temporaryPassword,
          },
        }
      )
    } catch (error) {
      console.error(
        "Create manager error:",
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