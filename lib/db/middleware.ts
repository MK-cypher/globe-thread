import {createServerClient, type CookieOptions} from "@supabase/ssr";
import {type NextRequest, NextResponse} from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    const {
      data: {user},
    } = await supabase.auth.getUser();

    const loggedUrls = ["/signin", "/signup", "/forgot-password", "/update-password"];
    const protectedRoles = ["Admin", "Super Admin"];

    if (
      !user &&
      (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/settings"))
    ) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    if (
      user &&
      !protectedRoles.includes(user.user_metadata.role) &&
      request.nextUrl.pathname.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (user && loggedUrls.includes(request.nextUrl.pathname)) {
      if (protectedRoles.includes(user.user_metadata.role)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
