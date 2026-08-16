import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Nota: en Next.js 16 `middleware.ts` fue renombrado a `proxy.ts`.
// Cumple la función del middleware: valida el JWT de la cookie `token`.
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserId(request: NextRequest): Promise<number | null> {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const sub = Number(payload.sub);
    return Number.isInteger(sub) ? sub : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = await getUserId(request);

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/registro");
  const isProtected =
    pathname.startsWith("/proyectos") || pathname.startsWith("/api/proyectos");

  if (!userId && isProtected) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userId && isAuthPage) {
    return NextResponse.redirect(new URL("/proyectos", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
